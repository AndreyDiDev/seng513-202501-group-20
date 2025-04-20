import { Router } from "express";
import { isAuthenticated } from "../utils/isAuthenticated.mjs";

const router = Router()

router.get('/api/me', isAuthenticated ,(req, res)=> {
    const user = req.user
    res.status(200).json(user)
})

export default router;
