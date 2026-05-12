import * as findingsService from './findings.service.js';

export async function listFindings(req, res, next) {
  try {
    const { projectId, severity, status } = req.query;
    res.json(await findingsService.listFindings(req.user.id, { projectId, severity, status }));
  } catch (err) { next(err); }
}

export async function getFinding(req, res, next) {
  try {
    res.json(await findingsService.getFinding(req.params.id, req.user.id));
  } catch (err) { next(err); }
}

export async function updateStatus(req, res, next) {
  try {
    const { status } = req.validated.body;
    res.json(await findingsService.updateStatus(req.params.id, req.user.id, status));
  } catch (err) { next(err); }
}

export async function assignFinding(req, res, next) {
  try {
    const { assignedTo } = req.validated.body;
    res.json(await findingsService.assignFinding(req.params.id, req.user.id, assignedTo));
  } catch (err) { next(err); }
}
