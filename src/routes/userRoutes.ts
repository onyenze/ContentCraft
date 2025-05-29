// src/routes/userRoutes.ts
import express from 'express';
import userController from '../controllers/userController';
import { authenticate, adminAuthStub } from '../middleware/authMiddleware';
import { requirePermission } from '../middleware/permissionMiddleware';
import { PERMISSIONS } from '../constants/permissions';

const router = express.Router();

// Admin-only user management
router.get('/admin/users', 
    authenticate, 
    adminAuthStub, 
    requirePermission(PERMISSIONS.MANAGE_USERS),
    userController.listUsers);
router.get('/admin/users/:id', 
    authenticate, 
    adminAuthStub, 
    requirePermission(PERMISSIONS.MANAGE_USERS),
    userController.getUser);
router.post('/admin/users', 
    // authenticate, 
    // adminAuthStub, 
    // requirePermission(PERMISSIONS.MANAGE_USERS),
    userController.createUser);
router.put('/admin/users/:id', 
    authenticate, 
    adminAuthStub, 
    requirePermission(PERMISSIONS.MANAGE_USERS),
    userController.updateUser);
router.delete('/admin/users/:id', 
    authenticate, 
    adminAuthStub, 
    requirePermission(PERMISSIONS.MANAGE_USERS),
    userController.deleteUser);

export default router;