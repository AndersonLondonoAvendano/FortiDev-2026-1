import { query } from '../../config/database.js';

const FINDING_COLS = `
  f.id, f.title, f.description, f.severity, f.category, f.cwe, f.owasp,
  f.file_path, f.line_start, f.line_end, f.code_snippet, f.rule,
  f.status, f.notes, f.evidence, f.created_at, f.updated_at,
  f.scan_id, s.type AS scan_type, s.project_id AS scan_project_id,
  u.id AS assigned_user_id, u.name AS assigned_user_name, u.email AS assigned_user_email`;

export const listFindings = (userId, filters) => {
  const conditions = ['pm.user_id = $1'];
  const params = [userId];
  let i = 2;

  if (filters.projectId) { conditions.push(`s.project_id = $${i++}`); params.push(filters.projectId); }
  if (filters.severity)  { conditions.push(`f.severity = $${i++}`);   params.push(filters.severity); }
  if (filters.status)    { conditions.push(`f.status = $${i++}`);     params.push(filters.status); }

  return query(
    `SELECT ${FINDING_COLS}
     FROM findings f
     JOIN scans s ON s.id = f.scan_id
     JOIN project_members pm ON pm.project_id = s.project_id
     LEFT JOIN users u ON u.id = f.assigned_to
     WHERE ${conditions.join(' AND ')}
     ORDER BY
       CASE f.severity WHEN 'CRITICAL' THEN 1 WHEN 'HIGH' THEN 2 WHEN 'MEDIUM' THEN 3 WHEN 'LOW' THEN 4 ELSE 5 END,
       f.created_at DESC`,
    params
  );
};

export const findFindingById = (id, userId) =>
  query(
    `SELECT ${FINDING_COLS}
     FROM findings f
     JOIN scans s ON s.id = f.scan_id
     JOIN project_members pm ON pm.project_id = s.project_id AND pm.user_id = $1
     LEFT JOIN users u ON u.id = f.assigned_to
     WHERE f.id = $2`,
    [userId, id]
  );

export const findUserById = (id) =>
  query(`SELECT id, is_active FROM users WHERE id = $1`, [id]);

export const updateFindingStatus = (id, status) =>
  query(
    `UPDATE findings SET status = $1, updated_at = NOW() WHERE id = $2
     RETURNING id`,
    [status, id]
  );

export const updateFindingAssignee = (id, assignedTo) =>
  query(
    `UPDATE findings SET assigned_to = $1, updated_at = NOW() WHERE id = $2
     RETURNING id`,
    [assignedTo ?? null, id]
  );
