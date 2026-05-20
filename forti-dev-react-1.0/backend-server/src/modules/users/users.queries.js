import { query } from '../../config/database.js';

const SAFE_COLS = `id, email, name, role, is_active, created_at, updated_at`;

export const listUsers = () =>
  query(`SELECT ${SAFE_COLS} FROM users ORDER BY created_at DESC`);

export const findUserById = (id) =>
  query(`SELECT ${SAFE_COLS} FROM users WHERE id = $1`, [id]);

export const findUserByEmail = (email) =>
  query(`SELECT ${SAFE_COLS} FROM users WHERE email = $1`, [email]);

export const findUserByIdWithPassword = (id) =>
  query(`SELECT id, email, password, name, role, is_active FROM users WHERE id = $1`, [id]);

export const insertUser = (email, hashedPassword, name, role) =>
  query(
    `INSERT INTO users (email, password, name, role)
     VALUES ($1, $2, $3, $4)
     RETURNING ${SAFE_COLS}`,
    [email, hashedPassword, name, role]
  );

export const updateUser = (id, fields) => {
  const sets = [];
  const params = [];
  let i = 1;
  if (fields.email !== undefined)    { sets.push(`email = $${i++}`);     params.push(fields.email); }
  if (fields.name !== undefined)     { sets.push(`name = $${i++}`);      params.push(fields.name); }
  if (fields.role !== undefined)     { sets.push(`role = $${i++}`);      params.push(fields.role); }
  if (fields.isActive !== undefined) { sets.push(`is_active = $${i++}`); params.push(fields.isActive); }
  sets.push(`updated_at = NOW()`);
  params.push(id);
  return query(
    `UPDATE users SET ${sets.join(', ')} WHERE id = $${i} RETURNING ${SAFE_COLS}`,
    params
  );
};

export const updatePassword = (id, hashedPassword) =>
  query(
    `UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2`,
    [hashedPassword, id]
  );
