import {Router} from "express";
const router = Router();
import {createRecipeController, getAllRecipesController} from '../controllers/recipeController.js'
import {removeRecipeController} from '../controllers/recipeController.js';
import { isAuthenticated } from "../utils/isAuthenticated.mjs";
import {getRecipesByIngredients} from '../controllers/recipeController.js';
import { requireRole } from "../utils/requireRole.mjs";


router.post('/api/recipe', createRecipeController);
router.delete('/api/recipe/:id', isAuthenticated, requireRole('admin'), removeRecipeController);
router.post('/api/recipe/filteredGet', getRecipesByIngredients);
router.get('/api/recipe/all', getAllRecipesController);

export default router