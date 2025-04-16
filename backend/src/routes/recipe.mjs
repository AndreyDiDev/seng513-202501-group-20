import {Router} from "express";
const router = Router();
import {createRecipeController} from '../controllers/recipeController.js'

router.post('/api/recipe', createRecipeController);

export default router