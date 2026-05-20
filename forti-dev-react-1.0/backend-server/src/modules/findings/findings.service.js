import { logger } from '../../config/logger.js';
import * as q from './findings.queries.js';

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
    updatedAt: row.updated_at,
    scan: {
      id: row.scan_id,
      type: row.scan_type,
      projectId: row.scan_project_id,
    },
    assignedUser: row.assigned_user_id
      ? { id: row.assigned_user_id, name: row.assigned_user_name, email: row.assigned_user_email }
      : null,
  };
}

async function assertFindingAccess(id, userId) {
  const { rows } = await q.findFindingById(id, userId);
  if (!rows[0]) {
    const err = new Error('Finding not found');
    err.status = 404;
    throw err;
  }
  return mapFinding(rows[0]);
}

export async function listFindings(userId, filters = {}) {
  const { rows } = await q.listFindings(userId, filters);
  return rows.map(mapFinding);
}

export async function getFinding(id, userId) {
  return assertFindingAccess(id, userId);
}

export async function updateStatus(id, userId, status) {
  await assertFindingAccess(id, userId);
  await q.updateFindingStatus(id, status);
  const finding = await assertFindingAccess(id, userId);
  logger.info({ msg: 'Finding status updated', findingId: id, status, userId });
  return finding;
}

export async function assignFinding(id, userId, assignedTo) {
  await assertFindingAccess(id, userId);

  if (assignedTo) {
    const { rows } = await q.findUserById(assignedTo);
    if (!rows[0] || !rows[0].is_active) {
      const err = new Error('Assignee user not found or inactive');
      err.status = 404;
      throw err;
    }
  }

  await q.updateFindingAssignee(id, assignedTo);
  const finding = await assertFindingAccess(id, userId);
  logger.info({ msg: 'Finding assigned', findingId: id, assignedTo, userId });
  return finding;
}
