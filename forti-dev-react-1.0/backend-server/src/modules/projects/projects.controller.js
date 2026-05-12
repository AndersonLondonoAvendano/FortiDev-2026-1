import * as projectsService from './projects.service.js';

export async function listProjects(req, res, next) {
  try {
    res.json(await projectsService.listProjects(req.user.id));
  } catch (err) { next(err); }
}

export async function getProject(req, res, next) {
  try {
    res.json(await projectsService.getProject(req.params.id, req.user.id));
  } catch (err) { next(err); }
}

export async function createProject(req, res, next) {
  try {
    const project = await projectsService.createProject(req.validated.body, req.user.id);
    res.status(201).json(project);
  } catch (err) { next(err); }
}

export async function updateProject(req, res, next) {
  try {
    res.json(await projectsService.updateProject(req.params.id, req.user.id, req.validated.body));
  } catch (err) { next(err); }
}

export async function deleteProject(req, res, next) {
  try {
    await projectsService.deleteProject(req.params.id, req.user.id);
    res.json({ message: 'Project deleted' });
  } catch (err) { next(err); }
}
