import { Worker } from 'worker_threads';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { prisma } from '../../config/database.js';
import { env } from '../../config/env.js';
import { logger } from '../../config/logger.js';

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function verifySemgrep() {
  try {
    await execFileAsync('semgrep', ['--version'], { timeout: 10000 });
    return true;
  } catch {
    logger.warn('Semgrep is not available. SAST scans will fail.');
    return false;
  }
}
verifySemgrep();

async function assertProjectAccess(projectId, userId) {
  const project = await prisma.project.findFirst({
    where: { id: projectId, members: { some: { userId } } },
  });
  if (!project) {
    const err = new Error('Project not found');
    err.status = 404;
    throw err;
  }
  return project;
}

export async function startScan(projectId, userId) {
  const project = await assertProjectAccess(projectId, userId);

  const scan = await prisma.scan.create({
    data: { projectId, triggeredBy: userId, status: 'PENDING', type: 'SAST' },
    select: { id: true, status: true, type: true, createdAt: true, projectId: true },
  });

  logger.info({ msg: 'Scan started', scanId: scan.id, projectId, userId });

  // Run in background worker thread — does not block event loop
  const worker = new Worker(path.join(__dirname, 'semgrep.worker.js'), {
    workerData: {
      scanId: scan.id,
      projectId,
      repoUrl: project.repoUrl,
      branch: project.branch,
      SCAN_TEMP_DIR: env.SCAN_TEMP_DIR,
    },
  });

  worker.on('error', (err) => {
    logger.error({ msg: 'Worker error', scanId: scan.id, error: err.message });
  });

  return scan;
}

export async function listScans(projectId, userId) {
  await assertProjectAccess(projectId, userId);
  return prisma.scan.findMany({
    where: { projectId },
    select: {
      id: true, type: true, status: true, tool: true,
      startedAt: true, completedAt: true, summary: true,
      errorMessage: true, createdAt: true,
      triggeredByUser: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getScan(id, userId) {
  const scan = await prisma.scan.findFirst({
    where: { id, project: { members: { some: { userId } } } },
    select: {
      id: true, type: true, status: true, tool: true,
      startedAt: true, completedAt: true, summary: true,
      errorMessage: true, createdAt: true, projectId: true,
      triggeredByUser: { select: { id: true, name: true, email: true } },
    },
  });
  if (!scan) {
    const err = new Error('Scan not found');
    err.status = 404;
    throw err;
  }
  return scan;
}

export async function getScanFindings(scanId, userId, filters = {}) {
  await getScan(scanId, userId);
  const where = { scanId };
  if (filters.severity) where.severity = filters.severity;
  if (filters.status) where.status = filters.status;
  if (filters.category) where.category = { contains: filters.category, mode: 'insensitive' };

  return prisma.finding.findMany({
    where,
    orderBy: [{ severity: 'asc' }, { createdAt: 'desc' }],
    select: {
      id: true, title: true, description: true, severity: true,
      category: true, cwe: true, owasp: true, filePath: true,
      lineStart: true, lineEnd: true, codeSnippet: true, rule: true,
      status: true, notes: true, evidence: true, createdAt: true,
      assignedUser: { select: { id: true, name: true, email: true } },
    },
  });
}

export async function createManualReview(projectId, userId, { title, description, findings }) {
  await assertProjectAccess(projectId, userId);

  return prisma.$transaction(async (tx) => {
    const scan = await tx.scan.create({
      data: {
        projectId,
        triggeredBy: userId,
        type: 'MANUAL_REVIEW',
        status: 'COMPLETED',
        tool: 'manual',
        startedAt: new Date(),
        completedAt: new Date(),
        summary: {
          total: findings.length,
          critical: findings.filter((f) => f.severity === 'CRITICAL').length,
          high: findings.filter((f) => f.severity === 'HIGH').length,
          medium: findings.filter((f) => f.severity === 'MEDIUM').length,
          low: findings.filter((f) => f.severity === 'LOW').length,
          info: findings.filter((f) => f.severity === 'INFO').length,
        },
      },
    });

    await tx.finding.createMany({
      data: findings.map((f) => ({ ...f, scanId: scan.id })),
    });

    logger.info({ msg: 'Manual review created', scanId: scan.id, projectId, userId });
    return tx.scan.findUnique({
      where: { id: scan.id },
      include: { findings: true },
    });
  });
}
