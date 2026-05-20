import { query } from '../../config/database.js';

// Base project columns
const PROJ_COLS = `
  p.id, p.name, p.description, p.repo_url, p.repo_owner, p.repo_name,
  p.branch, p.language, p.status, p.organization_id, p.created_at, p.updated_at,
  COUNT(DISTINCT s.id)::int AS scan_count`;

export const listProjects = (userId) =>
  query(
    `SELECT ${PROJ_COLS}
     FROM projects p
     JOIN project_members pm ON pm.project_id = p.id AND pm.user_id = $1
     LEFT JOIN scans s ON s.project_id = p.id
     GROUP BY p.id
     ORDER BY p.created_at DESC`,
    [userId]
  );

export const findProjectById = (id, userId) =>
  query(
    `SELECT ${PROJ_COLS}
     FROM projects p
     JOIN project_members pm ON pm.project_id = p.id AND pm.user_id = $1
     LEFT JOIN scans s ON s.project_id = p.id
     WHERE p.id = $2
     GROUP BY p.id`,
    [userId, id]
  );

export const findProjectMembers = (projectId) =>
  query(
    `SELECT u.id, u.name, u.email, u.role
     FROM project_members pm
     JOIN users u ON u.id = pm.user_id
     WHERE pm.project_id = $1`,
    [projectId]
  );

export const insertProject = (name, description, repoUrl, repoOwner, repoName, branch, language, organizationId) =>
  query(
    `INSERT INTO projects (name, description, repo_url, repo_owner, repo_name, branch, language, organization_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id, name, description, repo_url, repo_owner, repo_name,
               branch, language, status, organization_id, created_at, updated_at`,
    [name, description, repoUrl, repoOwner, repoName, branch, language, organizationId ?? null]
  );

export const insertProjectMember = (projectId, userId) =>
  query(
    `INSERT INTO project_members (project_id, user_id) VALUES ($1, $2)`,
    [projectId, userId]
  );

export const updateProject = (id, fields) => {
  const sets = [];
  const params = [];
  let i = 1;
  if (fields.name !== undefined)        { sets.push(`name = $${i++}`);        params.push(fields.name); }
  if (fields.description !== undefined) { sets.push(`description = $${i++}`); params.push(fields.description); }
  if (fields.branch !== undefined)      { sets.push(`branch = $${i++}`);      params.push(fields.branch); }
  if (fields.status !== undefined)      { sets.push(`status = $${i++}`);      params.push(fields.status); }
  sets.push(`updated_at = NOW()`);
  params.push(id);
  return query(
    `UPDATE projects SET ${sets.join(', ')} WHERE id = $${i}
     RETURNING id, name, description, repo_url, repo_owner, repo_name,
               branch, language, status, organization_id, created_at, updated_at`,
    params
  );
};

export const deleteProject = (id) =>
  query('DELETE FROM projects WHERE id = $1', [id]);

// Used by scans service for access check — returns repoUrl + branch too
export const findProjectForScan = (id, userId) =>
  query(
    `SELECT p.id, p.repo_url, p.branch
     FROM projects p
     JOIN project_members pm ON pm.project_id = p.id AND pm.user_id = $1
     WHERE p.id = $2`,
    [userId, id]
  );
