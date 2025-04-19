import {Router} from "express";
const router = Router();
import {createUserController} from '../controllers/userController.js'


router.post('/api/user', createUserController);

export default router