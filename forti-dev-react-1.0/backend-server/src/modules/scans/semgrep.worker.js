import { workerData } from 'worker_threads';
import path from 'path';
import fs from 'fs/promises';
import { execFile } from 'child_process';
import { promisify } from 'util';
import pg from 'pg';
import simpleGit from 'simple-git';

const { Pool } = pg;
const execFileAsync = promisify(execFile);

// Worker creates its own pool — does not share with main thread
const pool = new Pool({ connectionString: workerData.DATABASE_URL });

const SEVERITY_MAP = {
  ERROR: 'CRITICAL',
  WARNING: 'HIGH',
  INFO: 'MEDIUM',
};

function mapSeverity(semgrepSeverity) {
  return SEVERITY_MAP[semgrepSeverity?.toUpperCase()] ?? 'LOW';
}

// "java.lang.security.audit.sqli.jdbc-sqli" → "Jdbc Sqli"
function formatRuleName(checkId) {
  if (!checkId) return 'Unknown Rule';
  const parts = checkId.split('.');
  const lastPart = parts[parts.length - 1];
  return lastPart
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function extractCwe(metadata) {
  if (!metadata) return null;
  if (Array.isArray(metadata.cwe)) return metadata.cwe[0] ?? null;
  return metadata.cwe ?? null;
}

function extractOwasp(metadata) {
  if (!metadata) return null;
  if (Array.isArray(metadata.owasp)) return metadata.owasp[0] ?? null;
  return metadata.owasp ?? null;
}

async function run() {
  const { scanId, repoUrl, branch, SCAN_TEMP_DIR } = workerData;
  const cloneDir = path.join(SCAN_TEMP_DIR, scanId);

  try {
    await pool.query(
      `UPDATE scans SET status = 'RUNNING', started_at = NOW() WHERE id = $1`,
      [scanId]
    );

    await fs.mkdir(cloneDir, { recursive: true });
    const git = simpleGit();
    await git.clone(repoUrl, cloneDir, ['--depth', '1', '--branch', branch]);

    const { stdout } = await execFileAsync(
      'semgrep',
      ['--config=p/security-audit', '--config=p/owasp-top-ten', '--json', cloneDir],
      { timeout: 10 * 60 * 1000, maxBuffer: 50 * 1024 * 1024 }
    );

    const semgrepOutput = JSON.parse(stdout);
    const results = semgrepOutput.results ?? [];

    const findingsData = results.map((r) => {
      const meta = r.extra?.metadata;
      return {
        title: formatRuleName(r.check_id),
        description: r.extra?.message ?? meta?.description ?? 'Sin descripción disponible',
        severity: mapSeverity(r.extra?.severity),
        category: meta?.category ?? (Array.isArray(meta?.cwe) ? meta.cwe[0] : meta?.cwe) ?? null,
        cwe: extractCwe(meta),
        owasp: extractOwasp(meta),
        filePath: r.path ?? null,
        lineStart: r.start?.line ?? null,
        lineEnd: r.end?.line ?? null,
        codeSnippet: r.extra?.lines ?? null,
        rule: r.check_id ?? null,
      };
    });

    const summary = findingsData.reduce(
      (acc, f) => { acc.total++; acc[f.severity.toLowerCase()]++; return acc; },
      { total: 0, critical: 0, high: 0, medium: 0, low: 0, info: 0 }
    );

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      for (const f of findingsData) {
        await client.query(
          `INSERT INTO findings
             (scan_id, title, description, severity, category, cwe, owasp,
              file_path, line_start, line_end, code_snippet, rule)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
          [
            scanId, f.title, f.description, f.severity,
            f.category, f.cwe, f.owasp,
            f.filePath, f.lineStart, f.lineEnd, f.codeSnippet, f.rule,
          ]
        );
      }

      await client.query(
        `UPDATE scans
         SET status = 'COMPLETED', completed_at = NOW(),
             raw_output = $1, summary = $2
         WHERE id = $3`,
        [JSON.stringify(semgrepOutput), JSON.stringify(summary), scanId]
      );

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    await pool.query(
      `UPDATE scans
       SET status = 'FAILED', completed_at = NOW(), error_message = $1
       WHERE id = $2`,
      [err.message?.slice(0, 500) ?? 'Unknown error', scanId]
    ).catch(() => {});
  } finally {
    await fs.rm(cloneDir, { recursive: true, force: true }).catch(() => {});
    await pool.end();
  }
}

run();
