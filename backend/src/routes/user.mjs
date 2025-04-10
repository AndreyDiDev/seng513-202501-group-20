import {Router} from "express";
const router = Router();
import userControllerCreateUser from '../controllers/userController.js'

// router.get(
//     "/api/user", (req, res)=>{
//         console.log('You hit the user route')
//         return res.sendStatus(200)
// })
router.post('/api/user', userControllerCreateUser);

export default router