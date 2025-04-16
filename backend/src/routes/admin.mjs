import { Router } from "express";
import { adminDeleteCommentController, createAdminController, getAdminCommentsController, getAdminDashboardController } from "../controllers/adminController.js";
import { isAuthenticated } from "../utils/isAuthenticated.mjs";
import { requireRole } from "../utils/requireRole.mjs";

const router = Router()

router.post('/api/admin', createAdminController)
router.get('/api/admin/dashboard', isAuthenticated, requireRole('admin'), getAdminDashboardController)

router.get('/api/admin/comments', isAuthenticated, requireRole('admin'), getAdminCommentsController)
// requires id as commentID in json body and deletes that comment
router.post('/api/admin/comments', isAuthenticated, requireRole('admin'), adminDeleteCommentController)

export default router;