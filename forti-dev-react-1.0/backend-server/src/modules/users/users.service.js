import bcrypt from 'bcryptjs';
import { prisma } from '../../config/database.js';
import { logger } from '../../config/logger.js';

const SALT_ROUNDS = 12;
const SAFE_SELECT = {
  id: true, email: true, name: true, role: true,
  isActive: true, createdAt: true, updatedAt: true,
};

export async function listUsers() {
  return prisma.user.findMany({ select: SAFE_SELECT, orderBy: { createdAt: 'desc' } });
}

export async function getUser(id) {
  const user = await prisma.user.findUnique({ where: { id }, select: SAFE_SELECT });
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  return user;
}

export async function createUser({ email, password, name, role }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error('Email already in use');
    err.status = 409;
    throw err;
  }
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: { email, password: hashed, name, role: role ?? 'DEVELOPER' },
    select: SAFE_SELECT,
  });
  logger.info({ msg: 'Admin created user', userId: user.id });
  return user;
}

export async function updateUser(id, { email, name, role, isActive }) {
  await getUser(id);
  const user = await prisma.user.update({
    where: { id },
    data: { email, name, role, isActive },
    select: SAFE_SELECT,
  });
  logger.info({ msg: 'Admin updated user', userId: id });
  return user;
}

export async function deleteUser(id, requesterId) {
  if (id === requesterId) {
    const err = new Error('Cannot deactivate your own account');
    err.status = 400;
    throw err;
  }
  await getUser(id);
  const user = await prisma.user.update({
    where: { id },
    data: { isActive: false },
    select: SAFE_SELECT,
  });
  logger.info({ msg: 'Admin soft-deleted user', userId: id });
  return user;
}

export async function changePassword(id, { currentPassword, newPassword }, requesterId) {
  const isSelf = id === requesterId;
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }

  if (isSelf) {
    const match = await bcrypt.compare(currentPassword, target.password);
    if (!match) {
      const err = new Error('Current password is incorrect');
      err.status = 400;
      throw err;
    }
  }

  const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await prisma.user.update({ where: { id }, data: { password: hashed } });
  logger.info({ msg: 'Password changed', userId: id });
}
