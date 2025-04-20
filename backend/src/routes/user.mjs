import {Router} from "express";
const router = Router();
import {createUserController} from '../controllers/userController.js'
import { getUserFromEmail } from "../controllers/userController.js";
import { isAuthenticated } from "../utils/isAuthenticated.mjs";
import { requireRole } from "../utils/requireRole.mjs";
import { buyPremiumController } from "../controllers/userController.js";


router.post('/api/user', createUserController);
router.get('/api/user/byEmail',isAuthenticated, getUserFromEmail);
router.get('/api/user/makePremium', isAuthenticated ,buyPremiumController);

export default router;