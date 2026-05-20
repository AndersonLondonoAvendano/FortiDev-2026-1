import { logger } from '../../config/logger.js';
import { query, transaction } from '../../config/database.js';
import * as q from './organizations.queries.js';

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .substring(0, 60);
}

async function uniqueSlug(base) {
  let slug = base;
  let attempt = 0;
  while (true) {
    const { rows } = await q.findOrgBySlug(slug);
    if (!rows[0]) return slug;
    slug = `${base}-${++attempt}`;
  }
}

function throwNotFound(msg = 'Organization not found') {
  const err = new Error(msg);
  err.status = 404;
  throw err;
}

function mapOrg(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    logoUrl: row.logo_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapMember(row) {
  return {
    id: row.id,
    role: row.role,
    joinedAt: row.joined_at,
    user: {
      id: row.user_id,
      name: row.user_name,
      email: row.user_email,
      role: row.user_role,
      isActive: row.user_is_active,
    },
  };
}

function mapProject(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    repoUrl: row.repo_url,
    repoOwner: row.repo_owner,
    repoName: row.repo_name,
    branch: row.branch,
    language: row.language,
    status: row.status,
    organizationId: row.organization_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    _count: { scans: row.scan_count ?? 0 },
  };
}

export async function createOrganization(userId, { name, description }) {
  const slug = await uniqueSlug(generateSlug(name));

  const org = await transaction(async (client) => {
    const { rows: [orgRow] } = await q.insertOrganization(client, name, slug, description);
    await q.insertOrgMember(client, orgRow.id, userId, 'OWNER');
    return orgRow;
  });

  logger.info({ msg: 'Organization created', orgId: org.id, userId });

  // Return with members included (matches Prisma response shape)
  const { rows: memberRows } = await q.findOrgMembers(org.id);
  return { ...mapOrg(org), members: memberRows.map(mapMember) };
}

export async function listUserOrganizations(userId) {
  const { rows } = await q.listUserOrgs(userId);
  return rows.map((row) => ({
    ...mapOrg(row),
    members: [{ role: row.my_role }],
    _count: { members: row.member_count, projects: row.project_count },
  }));
}

export async function getOrganization(id) {
  const { rows: [orgRow] } = await q.findOrgById(id);
  if (!orgRow) throwNotFound();

  const [{ rows: memberRows }, { rows: [counts] }] = await Promise.all([
    q.findOrgMembers(id),
    q.countOrgMembersAndProjects(id),
  ]);

  return {
    ...mapOrg(orgRow),
    members: memberRows.map(mapMember),
    _count: { members: counts.member_count, projects: counts.project_count },
  };
}

export async function updateOrganization(id, { name, description, logoUrl }) {
  const fields = {};
  if (name !== undefined) {
    fields.name = name;
    fields.slug = await uniqueSlug(generateSlug(name));
  }
  if (description !== undefined) fields.description = description;
  if (logoUrl !== undefined) fields.logoUrl = logoUrl;

  const { rows: [updated] } = await q.updateOrg(id, fields);
  return mapOrg(updated);
}

export async function deleteOrganization(id) {
  await q.deleteOrg(id);
  logger.info({ msg: 'Organization deleted', orgId: id });
}

export async function listMembers(organizationId) {
  const { rows } = await q.findOrgMembers(organizationId);
  return rows.map(mapMember);
}

export async function inviteMember(organizationId, { email, role = 'MEMBER' }) {
  const { rows: userRows } = await q.findUserByEmail(email);
  if (!userRows[0]) {
    const err = new Error('User with that email not found');
    err.status = 404;
    throw err;
  }
  const user = userRows[0];

  const { rows: existing } = await q.findOrgMember(organizationId, user.id);
  if (existing[0]) {
    const err = new Error('User is already a member of this organization');
    err.status = 409;
    throw err;
  }

  await query(
    `INSERT INTO organization_members (organization_id, user_id, role) VALUES ($1, $2, $3)`,
    [organizationId, user.id, role]
  );

  const { rows: all } = await q.findOrgMembers(organizationId);
  const member = all.find((m) => m.user_id === user.id);
  return mapMember(member);
}

export async function updateMemberRole(organizationId, userId, role) {
  const { rows: existing } = await q.findOrgMember(organizationId, userId);
  if (!existing[0]) throwNotFound('Member not found');

  await q.updateOrgMemberRole(organizationId, userId, role);
  const { rows: all } = await q.findOrgMembers(organizationId);
  const updated = all.find((m) => m.user_id === userId);
  return mapMember(updated);
}

export async function removeMember(organizationId, userId) {
  const { rows: [member] } = await q.findOrgMember(organizationId, userId);
  if (!member) throwNotFound('Member not found');
  if (member.role === 'OWNER') {
    const err = new Error('Cannot remove the owner of the organization');
    err.status = 400;
    throw err;
  }
  await q.deleteOrgMember(organizationId, userId);
}

export async function listOrgProjects(organizationId, userId) {
  const { rows } = await q.listOrgProjects(organizationId, userId);
  return rows.map(mapProject);
}
