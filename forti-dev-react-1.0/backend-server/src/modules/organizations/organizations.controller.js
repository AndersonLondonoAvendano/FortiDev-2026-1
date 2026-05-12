import * as svc from './organizations.service.js';

export async function create(req, res, next) {
  try {
    const org = await svc.createOrganization(req.user.id, req.body);
    res.status(201).json(org);
  } catch (err) { next(err); }
}

export async function list(req, res, next) {
  try {
    const orgs = await svc.listUserOrganizations(req.user.id);
    res.json(orgs);
  } catch (err) { next(err); }
}

export async function getOne(req, res, next) {
  try {
    const org = await svc.getOrganization(req.params.id);
    res.json(org);
  } catch (err) { next(err); }
}

export async function update(req, res, next) {
  try {
    const org = await svc.updateOrganization(req.params.id, req.body);
    res.json(org);
  } catch (err) { next(err); }
}

export async function remove(req, res, next) {
  try {
    await svc.deleteOrganization(req.params.id);
    res.status(204).end();
  } catch (err) { next(err); }
}

export async function getMembers(req, res, next) {
  try {
    const members = await svc.listMembers(req.params.id);
    res.json(members);
  } catch (err) { next(err); }
}

export async function addMember(req, res, next) {
  try {
    const member = await svc.inviteMember(req.params.id, req.body);
    res.status(201).json(member);
  } catch (err) { next(err); }
}

export async function changeMemberRole(req, res, next) {
  try {
    const member = await svc.updateMemberRole(req.params.id, req.params.userId, req.body.role);
    res.json(member);
  } catch (err) { next(err); }
}

export async function deleteMember(req, res, next) {
  try {
    await svc.removeMember(req.params.id, req.params.userId);
    res.status(204).end();
  } catch (err) { next(err); }
}

export async function getProjects(req, res, next) {
  try {
    const projects = await svc.listOrgProjects(req.params.id, req.user.id);
    res.json(projects);
  } catch (err) { next(err); }
}
