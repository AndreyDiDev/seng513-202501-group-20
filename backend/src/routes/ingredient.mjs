import { isAuthenticated } from "../utils/isAuthenticated.mjs";
import { Router } from "express";
import { createIngredientController } from "../controllers/ingredientController.js";
import { getAllIngredientsController } from "../controllers/ingredientController.js";

const router = Router()

router.post('/api/ingredient', isAuthenticated, createIngredientController)
router.get('/api/ingredient', isAuthenticated, getAllIngredientsController)

export default router