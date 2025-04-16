import { isAuthenticated } from "../utils/isAuthenticated.mjs";
import { Router } from "express";
import { requireRole } from "../utils/requireRole.mjs";

const router = Router()

router.get('/api/health', isAuthenticated, (req,res)=>{
    console.log("USER USER USER:::: ")
    console.log(req.user)
    res.sendStatus(200)
})

router.get('/api/health/admin', isAuthenticated, requireRole('admin'), (req,res)=>{
    res.sendStatus(200)
})

export default router