import { env } from '../../config/env.js';
import { logger } from '../../config/logger.js';
import { transaction } from '../../config/database.js';
import * as q from './projects.queries.js';

const GITHUB_URL_RE = /^https:\/\/github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+?)(\.git)?\/?$/;

function parseGitHubUrl(repoUrl) {
  const match = repoUrl.match(GITHUB_URL_RE);
  if (!match) {
    const err = new Error('Invalid GitHub URL. Expected: https://github.com/owner/repo');
    err.status = 422;
    throw err;
  }
  return { repoOwner: match[1], repoName: match[2] };
}

async function fetchGitHubMeta(owner, repo) {
  const headers = { 'User-Agent': 'FortiDev/2.0', Accept: 'application/vnd.github.v3+json' };
  if (env.GITHUB_TOKEN) headers['Authorization'] = `Bearer ${env.GITHUB_TOKEN}`;

  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
  if (response.status === 404) {
    const err = new Error('GitHub repository not found or is private');
    err.status = 422;
    throw err;
  }
  if (!response.ok) {
    const err = new Error('Failed to verify GitHub repository');
    err.status = 502;
    throw err;
  }
  return response.json();
}

function mapProject(row, members = null) {
  const project = {
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
  if (members !== null) project.members = members;
  return project;
}

function throwNotFound() {
  const err = new Error('Project not found');
  err.status = 404;
  throw err;
}

export async function listProjects(userId) {
  const { rows } = await q.listProjects(userId);
  return rows.map((r) => mapProject(r));
}

export async function getProject(id, userId) {
  const { rows } = await q.findProjectById(id, userId);
  if (!rows[0]) throwNotFound();
  const { rows: memberRows } = await q.findProjectMembers(id);
  const members = memberRows.map((m) => ({ user: { id: m.id, name: m.name, email: m.email, role: m.role } }));
  return mapProject(rows[0], members);
}

export async function createProject({ repoUrl, name, description, branch, organizationId }, userId) {
  const { repoOwner, repoName } = parseGitHubUrl(repoUrl);
  const ghMeta = await fetchGitHubMeta(repoOwner, repoName);

  const resolvedDesc = description ?? ghMeta.description ?? null;
  const resolvedBranch = branch ?? ghMeta.default_branch ?? 'main';
  const resolvedLang = ghMeta.language ?? null;

  const project = await transaction(async (client) => {
    const { rows: [proj] } = await client.query(
      `INSERT INTO projects (name, description, repo_url, repo_owner, repo_name, branch, language, organization_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, name, description, repo_url, repo_owner, repo_name,
                 branch, language, status, organization_id, created_at, updated_at`,
      [name, resolvedDesc, repoUrl, repoOwner, repoName, resolvedBranch, resolvedLang, organizationId ?? null]
    );
    await client.query(
      `INSERT INTO project_members (project_id, user_id) VALUES ($1, $2)`,
      [proj.id, userId]
    );
    return proj;
  });

  logger.info({ msg: 'Project created', projectId: project.id, userId });
  return mapProject({ ...project, scan_count: 0 });
}

export async function updateProject(id, userId, data) {
  await getProject(id, userId);
  const { rows: [project] } = await q.updateProject(id, data);
  logger.info({ msg: 'Project updated', projectId: id, userId });
  return mapProject({ ...project, scan_count: 0 });
}

export async function deleteProject(id, userId) {
  await getProject(id, userId);
  await q.deleteProject(id);
  logger.info({ msg: 'Project deleted', projectId: id, userId });
}
