import {Router} from "express";
const router = Router();
import {createUserController} from '../controllers/userController.js'

// router.get(
//     "/api/user", (req, res)=>{
//         console.log('You hit the user route')
//         return res.sendStatus(200)
// })
router.post('/api/user', createUserController);

export default router