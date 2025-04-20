import {Router} from "express";
const router = Router();
import {createUserController} from '../controllers/userController.js'
import { getUserFromEmail } from "../controllers/userController.js";
import { isAuthenticated } from "../utils/isAuthenticated.mjs";
import { requireRole } from "../utils/requireRole.mjs";


router.post('/api/user', createUserController);
router.get('/api/user/byEmail', isAuthenticated, getUserFromEmail);
router.patch('/api/user/makePremium', isAuthenticated, requireRole('normal'), buyPremiumController);

export default router;