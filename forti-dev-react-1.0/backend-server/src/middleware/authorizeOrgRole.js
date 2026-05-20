import { query } from '../config/database.js';

export function authorizeOrgRole(...roles) {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const organizationId = req.params.id;
    const userId = req.user.id;

    try {
      const { rows } = await query(
        `SELECT role FROM organization_members
         WHERE organization_id = $1 AND user_id = $2`,
        [organizationId, userId]
      );

      if (!rows[0]) {
        return res.status(403).json({ error: 'Not a member of this organization' });
      }

      if (roles.length > 0 && !roles.includes(rows[0].role)) {
        return res.status(403).json({ error: 'Insufficient organization permissions' });
      }

      req.orgMember = rows[0];
      next();
    } catch (err) {
      next(err);
    }
  };
}
