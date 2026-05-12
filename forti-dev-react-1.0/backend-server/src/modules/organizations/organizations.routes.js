import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { authorizeOrgRole } from '../../middleware/authorizeOrgRole.js';
import * as ctrl from './organizations.controller.js';

const router = Router();

// All organization routes require authentication
router.use(authenticate);

// Org CRUD
router.post('/', ctrl.create);
router.get('/', ctrl.list);
router.get('/:id', authorizeOrgRole(), ctrl.getOne);
router.put('/:id', authorizeOrgRole('OWNER', 'ADMIN'), ctrl.update);
router.delete('/:id', authorizeOrgRole('OWNER'), ctrl.remove);

// Org projects
router.get('/:id/projects', authorizeOrgRole(), ctrl.getProjects);

// Org members
router.get('/:id/members', authorizeOrgRole(), ctrl.getMembers);
router.post('/:id/members', authorizeOrgRole('OWNER', 'ADMIN'), ctrl.addMember);
router.patch('/:id/members/:userId', authorizeOrgRole('OWNER'), ctrl.changeMemberRole);
router.delete('/:id/members/:userId', authorizeOrgRole('OWNER', 'ADMIN'), ctrl.deleteMember);

export default router;
