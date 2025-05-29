// src/routes/roleRoutes.ts
import express from 'express';
import roleController from '../controllers/roleController';
import { authenticate, adminAuthStub } from '../middleware/authMiddleware';
import { requirePermission } from '../middleware/permissionMiddleware';
import { PERMISSIONS } from '../constants/permissions';

const router = express.Router();

// Admin-only role management
router.get('/admin/roles', 
    authenticate, 
    adminAuthStub, 
    requirePermission(PERMISSIONS.MANAGE_ROLES),
    roleController.listRoles);
router.get('/admin/roles/:id', 
    authenticate, 
    adminAuthStub, 
    requirePermission(PERMISSIONS.MANAGE_ROLES),
    roleController.getRole);
router.post('/admin/roles', 
    // authenticate, 
    // adminAuthStub, 
    // requirePermission(PERMISSIONS.MANAGE_ROLES),
    roleController.createRole);
router.put('/admin/roles/:id', 
    authenticate, 
    adminAuthStub, 
    requirePermission(PERMISSIONS.MANAGE_ROLES),
    roleController.updateRole);
router.delete('/admin/roles/:id', 
    authenticate, 
    adminAuthStub, 
    requirePermission(PERMISSIONS.MANAGE_ROLES),
    roleController.deleteRole);

export default router;