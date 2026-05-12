import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/auth.js';
import * as findingsController from './findings.controller.js';

const router = Router();
router.use(authenticate);

const statusSchema = z.object({
  body: z.object({
    status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'ACCEPTED_RISK', 'FALSE_POSITIVE']),
  }),
});

const assignSchema = z.object({
  body: z.object({
    assignedTo: z.string().uuid().nullable().optional(),
  }),
});

router.get('/', findingsController.listFindings);
router.get('/:id', findingsController.getFinding);
router.patch('/:id/status', validate(statusSchema), findingsController.updateStatus);
router.patch('/:id/assign', validate(assignSchema), findingsController.assignFinding);

export default router;
