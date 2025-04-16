import {Router} from "express";
const router = Router();
import {createRecipeController} from '../controllers/recipeController.js'
import {removeRecipeController} from '../controllers/recipeController.js';
import { isAuthenticated } from "../utils/isAuthenticated.mjs";
import {getRecipesByIngredients} from '../controllers/recipeController.js';

router.post('/api/recipe', isAuthenticated, createRecipeController);
router.delete('/api/recipe/:id', isAuthenticated, removeRecipeController);
router.get('/api/recipe', isAuthenticated, getRecipesByIngredients);

export default router