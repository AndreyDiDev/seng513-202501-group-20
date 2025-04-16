export function requireRole(...allowedRoles) {
    return (req, res, next) => {
      const user = req.user;
  
      // if (!user) {
      //   return res.status(401).json({ error: 'Not logged in' });
      // }
  
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
      }
  
      next();
    };
  }
  