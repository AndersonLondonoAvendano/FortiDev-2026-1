import { query } from '../../config/database.js';

export const findProjectForScan = (projectId, userId) =>
  query(
    `SELECT p.id, p.repo_url, p.branch
     FROM projects p
     JOIN project_members pm ON pm.project_id = p.id AND pm.user_id = $1
     WHERE p.id = $2`,
    [userId, projectId]
  );

export const insertScan = (projectId, userId, type, tool) =>
  query(
    `INSERT INTO scans (project_id, triggered_by, status, type, tool)
     VALUES ($1, $2, 'PENDING', $3, $4)
     RETURNING id, status, type, created_at, project_id`,
    [projectId, userId, type, tool ?? 'semgrep']
  );

export const listScans = (projectId) =>
  query(
    `SELECT s.id, s.type, s.status, s.tool, s.started_at, s.completed_at,
            s.summary, s.error_message, s.created_at,
            u.id AS user_id, u.name AS user_name, u.email AS user_email
     FROM scans s
     JOIN users u ON u.id = s.triggered_by
     WHERE s.project_id = $1
     ORDER BY s.created_at DESC`,
    [projectId]
  );

export const findScan = (scanId, userId) =>
  query(
    `SELECT s.id, s.type, s.status, s.tool, s.started_at, s.completed_at,
            s.summary, s.error_message, s.created_at, s.project_id,
            u.id AS user_id, u.name AS user_name, u.email AS user_email
     FROM scans s
     JOIN users u ON u.id = s.triggered_by
     JOIN project_members pm ON pm.project_id = s.project_id AND pm.user_id = $1
     WHERE s.id = $2`,
    [userId, scanId]
  );

export const findScanFindings = (scanId, filters) => {
  const conditions = ['f.scan_id = $1'];
  const params = [scanId];
  let i = 2;

  if (filters.severity) { conditions.push(`f.severity = $${i++}`); params.push(filters.severity); }
  if (filters.status)   { conditions.push(`f.status = $${i++}`);   params.push(filters.status); }
  if (filters.category) { conditions.push(`f.category ILIKE $${i++}`); params.push(`%${filters.category}%`); }

  return query(
    `SELECT f.id, f.title, f.description, f.severity, f.category, f.cwe, f.owasp,
            f.file_path, f.line_start, f.line_end, f.code_snippet, f.rule,
            f.status, f.notes, f.evidence, f.created_at,
            u.id AS assigned_user_id, u.name AS assigned_user_name, u.email AS assigned_user_email
     FROM findings f
     LEFT JOIN users u ON u.id = f.assigned_to
     WHERE ${conditions.join(' AND ')}
     ORDER BY
       CASE f.severity WHEN 'CRITICAL' THEN 1 WHEN 'HIGH' THEN 2 WHEN 'MEDIUM' THEN 3 WHEN 'LOW' THEN 4 ELSE 5 END,
       f.created_at DESC`,
    params
  );
};

export const insertManualScan = (client, projectId, userId, summary) =>
  client.query(
    `INSERT INTO scans (project_id, triggered_by, type, status, tool, started_at, completed_at, summary)
     VALUES ($1, $2, 'MANUAL_REVIEW', 'COMPLETED', 'manual', NOW(), NOW(), $3)
     RETURNING id, type, status, tool, started_at, completed_at, summary, created_at, project_id`,
    [projectId, userId, JSON.stringify(summary)]
  );

export const insertFinding = (client, finding) =>
  client.query(
    `INSERT INTO findings
       (scan_id, title, description, severity, category, cwe, owasp,
        file_path, line_start, line_end, code_snippet, rule, notes, evidence)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
     RETURNING id`,
    [
      finding.scanId, finding.title, finding.description, finding.severity,
      finding.category ?? null, finding.cwe ?? null, finding.owasp ?? null,
      finding.filePath ?? null, finding.lineStart ?? null, finding.lineEnd ?? null,
      finding.codeSnippet ?? null, finding.rule ?? null,
      finding.notes ?? null, finding.evidence ?? null,
    ]
  );

export const findManualScanWithFindings = (scanId) =>
  query(
    `SELECT s.id, s.type, s.status, s.tool, s.started_at, s.completed_at, s.summary, s.created_at,
            json_agg(json_build_object(
              'id', f.id, 'title', f.title, 'description', f.description,
              'severity', f.severity, 'status', f.status, 'filePath', f.file_path,
              'lineStart', f.line_start, 'lineEnd', f.line_end
            )) AS findings
     FROM scans s
     LEFT JOIN findings f ON f.scan_id = s.id
     WHERE s.id = $1
     GROUP BY s.id`,
    [scanId]
  );
