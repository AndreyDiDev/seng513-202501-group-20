import {Router} from "express";
const router = Router();
import {createRecipeController} from '../controllers/recipeController.js'
import {removeRecipeController} from '../controllers/recipeController.js';
import {getRecipesByIngredients} from '../controllers/recipeController.js';

router.post('/api/recipe', createRecipeController);
router.delete('/api/recipe/:id', removeRecipeController);
router.get('/api/recipe', getRecipesByIngredients);

export default router