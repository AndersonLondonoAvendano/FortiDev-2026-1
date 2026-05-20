import { Worker } from 'worker_threads';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { env } from '../../config/env.js';
import { logger } from '../../config/logger.js';
import { transaction } from '../../config/database.js';
import * as q from './scans.queries.js';

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

function mapScan(row) {
  return {
    id: row.id,
    type: row.type,
    status: row.status,
    tool: row.tool,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    summary: row.summary,
    errorMessage: row.error_message,
    createdAt: row.created_at,
    projectId: row.project_id,
    triggeredByUser: row.user_id
      ? { id: row.user_id, name: row.user_name, email: row.user_email }
      : undefined,
  };
}

function mapFinding(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    severity: row.severity,
    category: row.category,
    cwe: row.cwe,
    owasp: row.owasp,
    filePath: row.file_path,
    lineStart: row.line_start,
    lineEnd: row.line_end,
    codeSnippet: row.code_snippet,
    rule: row.rule,
    status: row.status,
    notes: row.notes,
    evidence: row.evidence,
    createdAt: row.created_at,
    assignedUser: row.assigned_user_id
      ? { id: row.assigned_user_id, name: row.assigned_user_name, email: row.assigned_user_email }
      : null,
  };
}

async function assertProjectAccess(projectId, userId) {
  const { rows } = await q.findProjectForScan(projectId, userId);
  if (!rows[0]) {
    const err = new Error('Project not found');
    err.status = 404;
    throw err;
  }
  return rows[0];
}

export async function startScan(projectId, userId) {
  const project = await assertProjectAccess(projectId, userId);

  const { rows: [scan] } = await q.insertScan(projectId, userId, 'SAST', 'semgrep');
  logger.info({ msg: 'Scan started', scanId: scan.id, projectId, userId });

  const worker = new Worker(path.join(__dirname, 'semgrep.worker.js'), {
    workerData: {
      scanId: scan.id,
      projectId,
      repoUrl: project.repo_url,
      branch: project.branch,
      SCAN_TEMP_DIR: env.SCAN_TEMP_DIR,
      DATABASE_URL: process.env.DATABASE_URL,
    },
  });

  worker.on('error', (err) => {
    logger.error({ msg: 'Worker error', scanId: scan.id, error: err.message });
  });

  return {
    id: scan.id,
    status: scan.status,
    type: scan.type,
    createdAt: scan.created_at,
    projectId: scan.project_id,
  };
}

export async function listScans(projectId, userId) {
  await assertProjectAccess(projectId, userId);
  const { rows } = await q.listScans(projectId);
  return rows.map(mapScan);
}

export async function getScan(id, userId) {
  const { rows } = await q.findScan(id, userId);
  if (!rows[0]) {
    const err = new Error('Scan not found');
    err.status = 404;
    throw err;
  }
  return mapScan(rows[0]);
}

export async function getScanFindings(scanId, userId, filters = {}) {
  await getScan(scanId, userId);
  const { rows } = await q.findScanFindings(scanId, filters);
  return rows.map(mapFinding);
}

export async function createManualReview(projectId, userId, { title, description, findings }) {
  await assertProjectAccess(projectId, userId);

  const summary = {
    total: findings.length,
    critical: findings.filter((f) => f.severity === 'CRITICAL').length,
    high:     findings.filter((f) => f.severity === 'HIGH').length,
    medium:   findings.filter((f) => f.severity === 'MEDIUM').length,
    low:      findings.filter((f) => f.severity === 'LOW').length,
    info:     findings.filter((f) => f.severity === 'INFO').length,
  };

  return transaction(async (client) => {
    const { rows: [scan] } = await q.insertManualScan(client, projectId, userId, summary);

    for (const f of findings) {
      await q.insertFinding(client, { ...f, scanId: scan.id });
    }

    const { rows: [full] } = await q.findManualScanWithFindings(scan.id);
    logger.info({ msg: 'Manual review created', scanId: scan.id, projectId, userId });
    return {
      id: full.id,
      type: full.type,
      status: full.status,
      tool: full.tool,
      startedAt: full.started_at,
      completedAt: full.completed_at,
      summary: full.summary,
      createdAt: full.created_at,
      findings: full.findings ?? [],
    };
  });
}
