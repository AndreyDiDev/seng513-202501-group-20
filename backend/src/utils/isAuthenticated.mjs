export function isAuthenticated(req, res, next) {
    if (typeof req.isAuthenticated === 'function' && req.isAuthenticated()) {
      return next();
    }
  
    if (req.session?.passport?.user) {
      return next();
    }
  
    return res.status(401).json({ error: 'Unauthorized' });
  }
  