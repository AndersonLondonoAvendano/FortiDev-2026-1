import { prisma } from '../../config/database.js';
import { env } from '../../config/env.js';
import { logger } from '../../config/logger.js';

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

const PROJECT_SELECT = {
  id: true, name: true, description: true, repoUrl: true,
  repoOwner: true, repoName: true, branch: true, language: true,
  status: true, createdAt: true, updatedAt: true,
  _count: { select: { scans: true } },
};

export async function listProjects(userId) {
  return prisma.project.findMany({
    where: { members: { some: { userId } } },
    select: PROJECT_SELECT,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getProject(id, userId) {
  const project = await prisma.project.findFirst({
    where: { id, members: { some: { userId } } },
    select: { ...PROJECT_SELECT, members: { select: { user: { select: { id: true, name: true, email: true, role: true } } } } },
  });
  if (!project) {
    const err = new Error('Project not found');
    err.status = 404;
    throw err;
  }
  return project;
}

export async function createProject({ repoUrl, name, description, branch }, userId) {
  const { repoOwner, repoName } = parseGitHubUrl(repoUrl);
  const ghMeta = await fetchGitHubMeta(repoOwner, repoName);

  const project = await prisma.project.create({
    data: {
      name,
      description: description ?? ghMeta.description ?? null,
      repoUrl,
      repoOwner,
      repoName,
      branch: branch ?? ghMeta.default_branch ?? 'main',
      language: ghMeta.language ?? null,
      members: { create: { userId } },
    },
    select: PROJECT_SELECT,
  });

  logger.info({ msg: 'Project created', projectId: project.id, userId });
  return project;
}

export async function updateProject(id, userId, data) {
  await getProject(id, userId);
  const project = await prisma.project.update({
    where: { id },
    data,
    select: PROJECT_SELECT,
  });
  logger.info({ msg: 'Project updated', projectId: id, userId });
  return project;
}

export async function deleteProject(id, userId) {
  await getProject(id, userId);
  await prisma.project.delete({ where: { id } });
  logger.info({ msg: 'Project deleted', projectId: id, userId });
}
