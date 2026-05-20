import { query } from '../../config/database.js';

export const countUsers = () =>
  query('SELECT COUNT(*)::int AS count FROM users');

export const findUserByEmail = (email) =>
  query(
    `SELECT id, email, password, name, role, is_active, created_at, updated_at
     FROM users WHERE email = $1`,
    [email]
  );

export const findUserById = (id) =>
  query(
    `SELECT id, email, name, role, is_active, created_at, updated_at
     FROM users WHERE id = $1`,
    [id]
  );

export const insertUser = (email, hashedPassword, name, role) =>
  query(
    `INSERT INTO users (email, password, name, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, name, role, is_active, created_at`,
    [email, hashedPassword, name, role]
  );

export const insertRefreshToken = (userId, token, expiresAt) =>
  query(
    `INSERT INTO refresh_tokens (user_id, token, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, token, expiresAt]
  );

export const findRefreshToken = (token) =>
  query(
    `SELECT rt.id, rt.token, rt.user_id, rt.expires_at,
            u.id AS uid, u.email, u.name, u.role, u.is_active
     FROM refresh_tokens rt
     JOIN users u ON u.id = rt.user_id
     WHERE rt.token = $1 AND rt.expires_at > NOW()`,
    [token]
  );

export const deleteRefreshTokenById = (id) =>
  query('DELETE FROM refresh_tokens WHERE id = $1', [id]);

export const deleteRefreshTokenByValue = (token) =>
  query('DELETE FROM refresh_tokens WHERE token = $1', [token]);
