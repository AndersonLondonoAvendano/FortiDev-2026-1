import bcrypt from 'bcryptjs';
import { logger } from '../../config/logger.js';
import * as q from './users.queries.js';

const SALT_ROUNDS = 12;

function mapUser(row) {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function throwNotFound() {
  const err = new Error('User not found');
  err.status = 404;
  throw err;
}

export async function listUsers() {
  const { rows } = await q.listUsers();
  return rows.map(mapUser);
}

export async function getUser(id) {
  const { rows } = await q.findUserById(id);
  if (!rows[0]) throwNotFound();
  return mapUser(rows[0]);
}

export async function createUser({ email, password, name, role }) {
  const { rows: existing } = await q.findUserByEmail(email);
  if (existing.length > 0) {
    const err = new Error('Email already in use');
    err.status = 409;
    throw err;
  }
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const { rows: [user] } = await q.insertUser(email, hashed, name, role ?? 'DEVELOPER');
  logger.info({ msg: 'Admin created user', userId: user.id });
  return mapUser(user);
}

export async function updateUser(id, { email, name, role, isActive }) {
  await getUser(id);
  const { rows: [user] } = await q.updateUser(id, { email, name, role, isActive });
  logger.info({ msg: 'Admin updated user', userId: id });
  return mapUser(user);
}

export async function deleteUser(id, requesterId) {
  if (id === requesterId) {
    const err = new Error('Cannot deactivate your own account');
    err.status = 400;
    throw err;
  }
  await getUser(id);
  const { rows: [user] } = await q.updateUser(id, { isActive: false });
  logger.info({ msg: 'Admin soft-deleted user', userId: id });
  return mapUser(user);
}

export async function changePassword(id, { currentPassword, newPassword }, requesterId) {
  const isSelf = id === requesterId;
  const { rows } = await q.findUserByIdWithPassword(id);
  if (!rows[0]) throwNotFound();
  const target = rows[0];

  if (isSelf) {
    const match = await bcrypt.compare(currentPassword, target.password);
    if (!match) {
      const err = new Error('Current password is incorrect');
      err.status = 400;
      throw err;
    }
  }

  const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await q.updatePassword(id, hashed);
  logger.info({ msg: 'Password changed', userId: id });
}
