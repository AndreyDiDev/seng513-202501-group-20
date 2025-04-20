import passport from "passport";
import { response, Router } from "express";

const router = Router();

router.post('/api/auth', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err || !user) {
        return res.status(401).json({ error: 'Authentication failed' });
      }
  
      req.login(user, (err) => {
        if (err) return next(err);
        return res.status(200).json({ message: 'Logged in', user });
      });
    })(req, res, next);
  });
  

router.get("/api/auth/status", (request, response) => {
	return request.user ? response.send(request.user) : response.sendStatus(401);
});


export default router