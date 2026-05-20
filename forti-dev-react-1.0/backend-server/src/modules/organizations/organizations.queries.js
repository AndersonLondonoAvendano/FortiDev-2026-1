import { query } from '../../config/database.js';

export const findOrgBySlug = (slug) =>
  query(`SELECT id FROM organizations WHERE slug = $1`, [slug]);

export const insertOrganization = (client, name, slug, description) =>
  client.query(
    `INSERT INTO organizations (name, slug, description)
     VALUES ($1, $2, $3)
     RETURNING id, name, slug, description, logo_url, created_at, updated_at`,
    [name, slug, description ?? null]
  );

export const insertOrgMember = (client, organizationId, userId, role) =>
  client.query(
    `INSERT INTO organization_members (organization_id, user_id, role)
     VALUES ($1, $2, $3)`,
    [organizationId, userId, role]
  );

export const listUserOrgs = (userId) =>
  query(
    `SELECT o.id, o.name, o.slug, o.description, o.logo_url, o.created_at, o.updated_at,
            om_me.role AS my_role,
            COUNT(DISTINCT om.id)::int AS member_count,
            COUNT(DISTINCT p.id)::int  AS project_count
     FROM organizations o
     JOIN organization_members om_me ON om_me.organization_id = o.id AND om_me.user_id = $1
     LEFT JOIN organization_members om ON om.organization_id = o.id
     LEFT JOIN projects p ON p.organization_id = o.id
     GROUP BY o.id, om_me.role
     ORDER BY o.created_at DESC`,
    [userId]
  );

export const findOrgById = (id) =>
  query(
    `SELECT id, name, slug, description, logo_url, created_at, updated_at
     FROM organizations WHERE id = $1`,
    [id]
  );

export const findOrgMembers = (organizationId) =>
  query(
    `SELECT om.id, om.role, om.joined_at,
            u.id AS user_id, u.name AS user_name, u.email AS user_email,
            u.role AS user_role, u.is_active AS user_is_active
     FROM organization_members om
     JOIN users u ON u.id = om.user_id
     WHERE om.organization_id = $1
     ORDER BY om.joined_at ASC`,
    [organizationId]
  );

export const countOrgMembersAndProjects = (organizationId) =>
  query(
    `SELECT
       (SELECT COUNT(*)::int FROM organization_members WHERE organization_id = $1) AS member_count,
       (SELECT COUNT(*)::int FROM projects WHERE organization_id = $1) AS project_count`,
    [organizationId]
  );

export const updateOrg = (id, fields) => {
  const sets = [];
  const params = [];
  let i = 1;
  if (fields.name        !== undefined) { sets.push(`name = $${i++}`);        params.push(fields.name); }
  if (fields.slug        !== undefined) { sets.push(`slug = $${i++}`);        params.push(fields.slug); }
  if (fields.description !== undefined) { sets.push(`description = $${i++}`); params.push(fields.description); }
  if (fields.logoUrl     !== undefined) { sets.push(`logo_url = $${i++}`);    params.push(fields.logoUrl); }
  sets.push(`updated_at = NOW()`);
  params.push(id);
  return query(
    `UPDATE organizations SET ${sets.join(', ')} WHERE id = $${i}
     RETURNING id, name, slug, description, logo_url, created_at, updated_at`,
    params
  );
};

export const deleteOrg = (id) =>
  query(`DELETE FROM organizations WHERE id = $1`, [id]);

export const findUserByEmail = (email) =>
  query(`SELECT id, email FROM users WHERE email = $1`, [email]);

export const findOrgMember = (organizationId, userId) =>
  query(
    `SELECT id, role FROM organization_members WHERE organization_id = $1 AND user_id = $2`,
    [organizationId, userId]
  );

export const updateOrgMemberRole = (organizationId, userId, role) =>
  query(
    `UPDATE organization_members SET role = $1
     WHERE organization_id = $2 AND user_id = $3
     RETURNING id, role`,
    [role, organizationId, userId]
  );

export const deleteOrgMember = (organizationId, userId) =>
  query(
    `DELETE FROM organization_members WHERE organization_id = $1 AND user_id = $2`,
    [organizationId, userId]
  );

export const listOrgProjects = (organizationId, userId) =>
  query(
    `SELECT p.id, p.name, p.description, p.repo_url, p.repo_owner, p.repo_name,
            p.branch, p.language, p.status, p.organization_id, p.created_at, p.updated_at,
            COUNT(DISTINCT s.id)::int AS scan_count
     FROM projects p
     JOIN project_members pm ON pm.project_id = p.id AND pm.user_id = $1
     LEFT JOIN scans s ON s.project_id = p.id
     WHERE p.organization_id = $2
     GROUP BY p.id
     ORDER BY p.created_at DESC`,
    [userId, organizationId]
  );
