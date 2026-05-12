import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/auth.js';
import { scanLimiter } from '../../middleware/rateLimiter.js';
import * as scansController from './scans.controller.js';

const findingSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  severity: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO']),
  filePath: z.string().optional(),
  lineStart: z.number().int().optional(),
  lineEnd: z.number().int().optional(),
  cwe: z.string().optional(),
  owasp: z.string().optional(),
  evidence: z.string().optional(),
  notes: z.string().optional(),
  category: z.string().optional(),
});

const manualReviewSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200),
    description: z.string().min(1),
    findings: z.array(findingSchema).min(1),
  }),
});

// Nested router: mounted under /api/projects/:projectId/scans
// mergeParams lets us access :projectId from parent
export const nestedScanRouter = Router({ mergeParams: true });
nestedScanRouter.post('/', authenticate, scanLimiter, scansController.startScan);
nestedScanRouter.get('/', authenticate, scansController.listScans);

// Reviews router: mounted under /api/projects/:projectId/reviews
export const reviewRouter = Router({ mergeParams: true });
reviewRouter.post('/', authenticate, validate(manualReviewSchema), scansController.createManualReview);

// Standalone router: mounted under /api/scans
export const standaloneRouter = Router();
standaloneRouter.get('/:id', authenticate, scansController.getScan);
standaloneRouter.get('/:id/findings', authenticate, scansController.getScanFindings);
