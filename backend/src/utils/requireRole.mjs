export function requireRole(...allowedRoles) {
    return (req, res, next) => {
      const user = req.user;
  
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
      }
  
      next();
    };
  }
  