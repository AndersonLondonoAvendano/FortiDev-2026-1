import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/auth.js';
import * as projectsController from './projects.controller.js';
import { nestedScanRouter, reviewRouter } from '../scans/scans.routes.js';

const router = Router();
router.use(authenticate);

const createSchema = z.object({
  body: z.object({
    repoUrl: z.string().url(),
    name: z.string().min(1).max(200),
    description: z.string().max(1000).optional(),
    branch: z.string().max(100).optional(),
  }),
});

const updateSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(200).optional(),
    description: z.string().max(1000).optional(),
    branch: z.string().max(100).optional(),
    status: z.enum(['ACTIVE', 'ARCHIVED']).optional(),
  }),
});

router.get('/', projectsController.listProjects);
router.post('/', validate(createSchema), projectsController.createProject);
router.get('/:id', projectsController.getProject);
router.put('/:id', validate(updateSchema), projectsController.updateProject);
router.delete('/:id', projectsController.deleteProject);

router.use('/:projectId/scans', nestedScanRouter);
router.use('/:projectId/reviews', reviewRouter);

export default router;
