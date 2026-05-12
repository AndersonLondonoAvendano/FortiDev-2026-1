import { workerData } from 'worker_threads';
import path from 'path';
import fs from 'fs/promises';
import { execFile } from 'child_process';
import { promisify } from 'util';
import simpleGit from 'simple-git';
import { PrismaClient } from '@prisma/client';

const execFileAsync = promisify(execFile);
const prisma = new PrismaClient();

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
  const { scanId, projectId, repoUrl, branch, scanDir, SCAN_TEMP_DIR } = workerData;
  const cloneDir = path.join(SCAN_TEMP_DIR, scanId);

  try {
    await prisma.scan.update({
      where: { id: scanId },
      data: { status: 'RUNNING', startedAt: new Date() },
    });

    // Clone repository
    await fs.mkdir(cloneDir, { recursive: true });
    const git = simpleGit();
    await git.clone(repoUrl, cloneDir, ['--depth', '1', '--branch', branch]);

    // Run semgrep with timeout (10 minutes)
    const { stdout } = await execFileAsync(
      'semgrep',
      ['--config=p/security-audit', '--config=p/owasp-top-ten', '--json', cloneDir],
      { timeout: 10 * 60 * 1000, maxBuffer: 50 * 1024 * 1024 }
    );

    const semgrepOutput = JSON.parse(stdout);
    const results = semgrepOutput.results ?? [];

    // Map semgrep results to findings
    const findingsData = results.map((r) => {
      const meta = r.extra?.metadata;
      return {
        scanId,
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
      (acc, f) => {
        acc.total++;
        acc[f.severity.toLowerCase()]++;
        return acc;
      },
      { total: 0, critical: 0, high: 0, medium: 0, low: 0, info: 0 }
    );

    await prisma.$transaction([
      prisma.finding.createMany({ data: findingsData }),
      prisma.scan.update({
        where: { id: scanId },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          rawOutput: semgrepOutput,
          summary,
        },
      }),
    ]);
  } catch (err) {
    await prisma.scan.update({
      where: { id: scanId },
      data: {
        status: 'FAILED',
        completedAt: new Date(),
        errorMessage: err.message?.slice(0, 500) ?? 'Unknown error',
      },
    }).catch(() => {});
  } finally {
    await fs.rm(cloneDir, { recursive: true, force: true }).catch(() => {});
    await prisma.$disconnect();
  }
}

run();
