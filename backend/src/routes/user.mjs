import {Router} from "express";
const router = Router();
import {createUserController} from '../controllers/userController.js'


router.post('/api/user', createUserController);
router.patch('/api/user/makePremium', isAuthenticated, requireRole('normal'), buyPremiumController);

export default router