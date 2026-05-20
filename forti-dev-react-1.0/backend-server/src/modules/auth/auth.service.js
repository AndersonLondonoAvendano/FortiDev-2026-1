import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { logger } from '../../config/logger.js';
import * as q from './auth.queries.js';

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

function mapUser(row) {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    isActive: row.is_active ?? row.isActive,
    createdAt: row.created_at ?? row.createdAt,
  };
}

export async function register({ email, password, name, role, requester }) {
  const { rows: [{ count }] } = await q.countUsers();

  if (count > 0 && requester?.role !== 'ADMIN') {
    const err = new Error('Only admins can register new users');
    err.status = 403;
    throw err;
  }

  const { rows: existing } = await q.findUserByEmail(email);
  if (existing.length > 0) {
    const err = new Error('Email already in use');
    err.status = 409;
    throw err;
  }

  const assignedRole = count === 0 ? 'ADMIN' : (role ?? 'DEVELOPER');
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const { rows: [user] } = await q.insertUser(email, hashed, name, assignedRole);

  logger.info({ msg: 'User registered', userId: user.id, role: user.role });
  return mapUser(user);
}

export async function login({ email, password }) {
  const { rows } = await q.findUserByEmail(email);
  const user = rows[0];

  if (!user || !user.is_active) {
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
  await q.insertRefreshToken(user.id, refreshToken, expiresAt);

  logger.info({ msg: 'User logged in', userId: user.id });
  const { password: _pw, ...safeRow } = user;
  return { accessToken, refreshToken, user: mapUser(safeRow) };
}

export async function refresh(rawCookieToken) {
  if (!rawCookieToken) {
    const err = new Error('Refresh token required');
    err.status = 401;
    throw err;
  }

  try {
    jwt.verify(rawCookieToken, env.REFRESH_TOKEN_SECRET);
  } catch {
    const err = new Error('Invalid refresh token');
    err.status = 401;
    throw err;
  }

  const { rows } = await q.findRefreshToken(rawCookieToken);
  const stored = rows[0];
  if (!stored) {
    const err = new Error('Refresh token expired or revoked');
    err.status = 401;
    throw err;
  }
  if (!stored.is_active) {
    const err = new Error('User not found or inactive');
    err.status = 401;
    throw err;
  }

  await q.deleteRefreshTokenById(stored.id);
  const user = { id: stored.uid, email: stored.email, role: stored.role };
  const newAccessToken = signAccessToken(user);
  const newRefreshToken = signRefreshToken(user);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  await q.insertRefreshToken(stored.uid, newRefreshToken, expiresAt);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

export async function logout(rawCookieToken) {
  if (!rawCookieToken) return;
  await q.deleteRefreshTokenByValue(rawCookieToken);
}
