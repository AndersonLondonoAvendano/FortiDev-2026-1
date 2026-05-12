import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/database.js';
import { env } from '../../config/env.js';
import { logger } from '../../config/logger.js';

const SALT_ROUNDS = 12;

function signAccessToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );
}

function signRefreshToken(user) {
  return jwt.sign(
    { sub: user.id },
    env.REFRESH_TOKEN_SECRET,
    { expiresIn: env.REFRESH_TOKEN_EXPIRES_IN }
  );
}

export async function register({ email, password, name, role, requester }) {
  const count = await prisma.user.count();

  // After first user exists, only ADMIN can register new users
  if (count > 0 && requester?.role !== 'ADMIN') {
    const err = new Error('Only admins can register new users');
    err.status = 403;
    throw err;
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error('Email already in use');
    err.status = 409;
    throw err;
  }

  const assignedRole = count === 0 ? 'ADMIN' : (role ?? 'DEVELOPER');
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: { email, password: hashed, name, role: assignedRole },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  logger.info({ msg: 'User registered', userId: user.id, role: user.role });
  return user;
}

export async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: user.id, expiresAt },
  });

  logger.info({ msg: 'User logged in', userId: user.id });
  const { password: _pw, ...safeUser } = user;
  return { accessToken, refreshToken, user: safeUser };
}

export async function refresh(rawCookieToken) {
  if (!rawCookieToken) {
    const err = new Error('Refresh token required');
    err.status = 401;
    throw err;
  }

  let payload;
  try {
    payload = jwt.verify(rawCookieToken, env.REFRESH_TOKEN_SECRET);
  } catch {
    const err = new Error('Invalid refresh token');
    err.status = 401;
    throw err;
  }

  const stored = await prisma.refreshToken.findUnique({ where: { token: rawCookieToken } });
  if (!stored || stored.expiresAt < new Date()) {
    const err = new Error('Refresh token expired or revoked');
    err.status = 401;
    throw err;
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user || !user.isActive) {
    const err = new Error('User not found or inactive');
    err.status = 401;
    throw err;
  }

  await prisma.refreshToken.delete({ where: { id: stored.id } });
  const newAccessToken = signAccessToken(user);
  const newRefreshToken = signRefreshToken(user);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  await prisma.refreshToken.create({
    data: { token: newRefreshToken, userId: user.id, expiresAt },
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

export async function logout(rawCookieToken) {
  if (!rawCookieToken) return;
  await prisma.refreshToken.deleteMany({ where: { token: rawCookieToken } });
}
