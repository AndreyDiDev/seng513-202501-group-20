import passport from "passport";
import { response, Router } from "express";

const router = Router();

router.post('/api/auth', 
    passport.authenticate('local'), 
    (req, res) => {
        res.sendStatus(200)
    }
)

router.get("/api/auth/status", (request, response) => {
	return request.user ? response.send(request.user) : response.sendStatus(401);
});


export default router