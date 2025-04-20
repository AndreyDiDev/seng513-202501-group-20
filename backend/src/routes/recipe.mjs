import {Router} from "express";
const router = Router();
import {createRecipeController} from '../controllers/recipeController.js'
import {removeRecipeController} from '../controllers/recipeController.js';
import { isAuthenticated } from "../utils/isAuthenticated.mjs";
import {getRecipesByIngredients} from '../controllers/recipeController.js';
import { requireRole } from "../utils/requireRole.mjs";
import { getAllCommentsController } from "../controllers/commentsController.js";


router.post('/api/recipe', isAuthenticated, requireRole('influencer'), createRecipeController);
router.delete('/api/recipe/:id', isAuthenticated, requireRole('admin'), removeRecipeController);
router.get('/api/recipe', isAuthenticated, getRecipesByIngredients);
router.get('/api/recipe/all', isAuthenticated, getAllCommentsController);

export default router