import { prisma } from '../../config/database.js';
import { logger } from '../../config/logger.js';

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
    const existing = await prisma.organization.findUnique({ where: { slug } });
    if (!existing) return slug;
    attempt++;
    slug = `${base}-${attempt}`;
  }
}

function throwNotFound(msg = 'Organization not found') {
  const err = new Error(msg);
  err.status = 404;
  throw err;
}

export async function createOrganization(userId, { name, description }) {
  const slug = await uniqueSlug(generateSlug(name));

  const org = await prisma.organization.create({
    data: {
      name,
      slug,
      description: description ?? null,
      members: {
        create: { userId, role: 'OWNER' },
      },
    },
    include: { members: { include: { user: { select: { id: true, name: true, email: true } } } } },
  });

  logger.info({ msg: 'Organization created', orgId: org.id, userId });
  return org;
}

export async function listUserOrganizations(userId) {
  return prisma.organization.findMany({
    where: { members: { some: { userId } } },
    include: {
      _count: { select: { members: true, projects: true } },
      members: {
        where: { userId },
        select: { role: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getOrganization(id) {
  const org = await prisma.organization.findUnique({
    where: { id },
    include: {
      _count: { select: { members: true, projects: true } },
      members: {
        include: { user: { select: { id: true, name: true, email: true, role: true } } },
        orderBy: { joinedAt: 'asc' },
      },
    },
  });
  if (!org) throwNotFound();
  return org;
}

export async function updateOrganization(id, { name, description, logoUrl }) {
  const data = {};
  if (name !== undefined) {
    data.name = name;
    data.slug = await uniqueSlug(generateSlug(name));
  }
  if (description !== undefined) data.description = description;
  if (logoUrl !== undefined) data.logoUrl = logoUrl;

  return prisma.organization.update({ where: { id }, data });
}

export async function deleteOrganization(id) {
  await prisma.organization.delete({ where: { id } });
  logger.info({ msg: 'Organization deleted', orgId: id });
}

export async function listMembers(organizationId) {
  return prisma.organizationMember.findMany({
    where: { organizationId },
    include: { user: { select: { id: true, name: true, email: true, role: true, isActive: true } } },
    orderBy: { joinedAt: 'asc' },
  });
}

export async function inviteMember(organizationId, { email, role = 'MEMBER' }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const err = new Error('User with that email not found');
    err.status = 404;
    throw err;
  }

  const existing = await prisma.organizationMember.findUnique({
    where: { organizationId_userId: { organizationId, userId: user.id } },
  });
  if (existing) {
    const err = new Error('User is already a member of this organization');
    err.status = 409;
    throw err;
  }

  return prisma.organizationMember.create({
    data: { organizationId, userId: user.id, role },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
}

export async function updateMemberRole(organizationId, userId, role) {
  const member = await prisma.organizationMember.findUnique({
    where: { organizationId_userId: { organizationId, userId } },
  });
  if (!member) throwNotFound('Member not found');

  return prisma.organizationMember.update({
    where: { organizationId_userId: { organizationId, userId } },
    data: { role },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
}

export async function removeMember(organizationId, userId) {
  const member = await prisma.organizationMember.findUnique({
    where: { organizationId_userId: { organizationId, userId } },
  });
  if (!member) throwNotFound('Member not found');
  if (member.role === 'OWNER') {
    const err = new Error('Cannot remove the owner of the organization');
    err.status = 400;
    throw err;
  }

  await prisma.organizationMember.delete({
    where: { organizationId_userId: { organizationId, userId } },
  });
}

export async function listOrgProjects(organizationId, userId) {
  return prisma.project.findMany({
    where: { organizationId, members: { some: { userId } } },
    include: { _count: { select: { scans: true } } },
    orderBy: { createdAt: 'desc' },
  });
}
