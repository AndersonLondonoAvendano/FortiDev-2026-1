import { prisma } from '../config/database.js';

/**
 * Verifies that req.user is a member of the organization referenced by req.params.id
 * and optionally enforces one of the allowed OrgRole values.
 *
 * Usage:
 *   router.put('/:id', authenticate, authorizeOrgRole('OWNER', 'ADMIN'), controller.update)
 */
export function authorizeOrgRole(...roles) {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const organizationId = req.params.id;
    const userId = req.user.id;

    try {
      const member = await prisma.organizationMember.findUnique({
        where: { organizationId_userId: { organizationId, userId } },
      });

      if (!member) {
        return res.status(403).json({ error: 'Not a member of this organization' });
      }

      if (roles.length > 0 && !roles.includes(member.role)) {
        return res.status(403).json({ error: 'Insufficient organization permissions' });
      }

      req.orgMember = member;
      next();
    } catch (err) {
      next(err);
    }
  };
}
