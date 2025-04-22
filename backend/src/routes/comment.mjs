import { Router } from "express";
import { isAuthenticated } from "../utils/isAuthenticated.mjs";
import { createCommentController, getAllCommentsController } from "../controllers/commentsController.js";
import { deleteCommentController } from "../controllers/commentsController.js";
import { requireRole } from "../utils/requireRole.mjs";
import { getCommentsByRecipeIdController } from "../controllers/commentsController.js";

const router = Router();

router.post('/api/comment', isAuthenticated, createCommentController);
router.delete('/api/comment/:id', isAuthenticated, requireRole('admin'), deleteCommentController);
router.get('/api/comment/:recipeId', isAuthenticated, getCommentsByRecipeIdController);
router.get('/api/comment', isAuthenticated, getAllCommentsController);

export default router;