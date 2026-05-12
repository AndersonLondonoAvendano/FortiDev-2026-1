import { prisma } from '../../config/database.js';
import { logger } from '../../config/logger.js';

const FINDING_SELECT = {
  id: true, title: true, description: true, severity: true,
  category: true, cwe: true, owasp: true, filePath: true,
  lineStart: true, lineEnd: true, codeSnippet: true, rule: true,
  status: true, notes: true, evidence: true, createdAt: true, updatedAt: true,
  scan: { select: { id: true, type: true, projectId: true } },
  assignedUser: { select: { id: true, name: true, email: true } },
};

async function assertFindingAccess(id, userId) {
  const finding = await prisma.finding.findFirst({
    where: { id, scan: { project: { members: { some: { userId } } } } },
    select: FINDING_SELECT,
  });
  if (!finding) {
    const err = new Error('Finding not found');
    err.status = 404;
    throw err;
  }
  return finding;
}

export async function listFindings(userId, filters = {}) {
  const where = { scan: { project: { members: { some: { userId } } } } };
  if (filters.projectId) where.scan = { ...where.scan, projectId: filters.projectId };
  if (filters.severity) where.severity = filters.severity;
  if (filters.status) where.status = filters.status;

  return prisma.finding.findMany({
    where,
    select: FINDING_SELECT,
    orderBy: [{ severity: 'asc' }, { createdAt: 'desc' }],
  });
}

export async function getFinding(id, userId) {
  return assertFindingAccess(id, userId);
}

export async function updateStatus(id, userId, status) {
  await assertFindingAccess(id, userId);
  const finding = await prisma.finding.update({
    where: { id },
    data: { status },
    select: FINDING_SELECT,
  });
  logger.info({ msg: 'Finding status updated', findingId: id, status, userId });
  return finding;
}

export async function assignFinding(id, userId, assignedTo) {
  await assertFindingAccess(id, userId);

  if (assignedTo) {
    const target = await prisma.user.findUnique({ where: { id: assignedTo } });
    if (!target || !target.isActive) {
      const err = new Error('Assignee user not found or inactive');
      err.status = 404;
      throw err;
    }
  }

  const finding = await prisma.finding.update({
    where: { id },
    data: { assignedTo: assignedTo ?? null },
    select: FINDING_SELECT,
  });
  logger.info({ msg: 'Finding assigned', findingId: id, assignedTo, userId });
  return finding;
}
