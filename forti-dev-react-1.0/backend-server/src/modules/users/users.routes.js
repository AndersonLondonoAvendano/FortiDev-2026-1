import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import * as usersController from './users.controller.js';

const router = Router();
router.use(authenticate, authorize('ADMIN'));

const createUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8).max(128),
    name: z.string().min(1).max(100),
    role: z.enum(['ADMIN', 'DEVELOPER', 'ANALYST', 'PENTESTER']).optional(),
  }),
});

const updateUserSchema = z.object({
  body: z.object({
    email: z.string().email().optional(),
    name: z.string().min(1).max(100).optional(),
    role: z.enum(['ADMIN', 'DEVELOPER', 'ANALYST', 'PENTESTER']).optional(),
    isActive: z.boolean().optional(),
  }),
});

const passwordSchema = z.object({
  body: z.object({
    currentPassword: z.string().optional(),
    newPassword: z.string().min(8).max(128),
  }),
});

router.get('/', usersController.listUsers);
router.get('/:id', usersController.getUser);
router.post('/', validate(createUserSchema), usersController.createUser);
router.put('/:id', validate(updateUserSchema), usersController.updateUser);
router.delete('/:id', usersController.deleteUser);
router.patch('/:id/password', validate(passwordSchema), usersController.changePassword);

export default router;
