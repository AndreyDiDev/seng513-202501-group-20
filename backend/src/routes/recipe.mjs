import {Router} from "express";
const router = Router();
import {createRecipeController} from '../controllers/recipeController.js'
import {removeRecipeController} from '../controllers/recipeController.js';

router.post('/api/recipe', createRecipeController);
router.delete('/api/recipe/:id', removeRecipeController);

export default router