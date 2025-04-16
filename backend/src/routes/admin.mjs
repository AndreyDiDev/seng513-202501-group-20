import { Router } from "express";
import {
    adminDeleteCommentController, adminDeleteUserController, adminGetAllUsersController, 
    adminMakeUserNormalController, adminMakeUserPremiumController, createAdminController, 
    getAdminCommentsController, getAdminDashboardController } from "../controllers/adminController.js";
import { isAuthenticated } from "../utils/isAuthenticated.mjs";
import { requireRole } from "../utils/requireRole.mjs";

const router = Router()

router.post('/api/admin', createAdminController)
router.get('/api/admin/dashboard', isAuthenticated, requireRole('admin'), getAdminDashboardController)

router.get('/api/admin/comments', isAuthenticated, requireRole('admin'), getAdminCommentsController)
// requires id as commentID in json body and deletes that comment
router.post('/api/admin/comments', isAuthenticated, requireRole('admin'), adminDeleteCommentController)


//user routes for admin to manage users 
router.get('/api/admin/users', isAuthenticated, requireRole('admin'), adminGetAllUsersController)
//requires id as userID in json body to delete the user 
router.post('/api/admin/users', isAuthenticated, requireRole('admin'), adminDeleteUserController)


//premium and normal role change routes 
//routes expect userID in json body
router.post('/api/admin/premium', isAuthenticated, requireRole('admin'), adminMakeUserPremiumController)
router.post('/api/admin/normal', isAuthenticated, requireRole('admin'), adminMakeUserNormalController)
export default router;