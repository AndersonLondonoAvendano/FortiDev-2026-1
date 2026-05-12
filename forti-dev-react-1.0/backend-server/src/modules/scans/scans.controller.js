import * as scansService from './scans.service.js';

export async function startScan(req, res, next) {
  try {
    const scan = await scansService.startScan(req.params.projectId, req.user.id);
    res.status(202).json(scan);
  } catch (err) { next(err); }
}

export async function listScans(req, res, next) {
  try {
    res.json(await scansService.listScans(req.params.projectId, req.user.id));
  } catch (err) { next(err); }
}

export async function getScan(req, res, next) {
  try {
    res.json(await scansService.getScan(req.params.id, req.user.id));
  } catch (err) { next(err); }
}

export async function getScanFindings(req, res, next) {
  try {
    const { severity, status, category } = req.query;
    res.json(await scansService.getScanFindings(req.params.id, req.user.id, { severity, status, category }));
  } catch (err) { next(err); }
}

export async function createManualReview(req, res, next) {
  try {
    const review = await scansService.createManualReview(
      req.params.projectId,
      req.user.id,
      req.validated.body
    );
    res.status(201).json(review);
  } catch (err) { next(err); }
}
