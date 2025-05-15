// src/routes/authRoutes.ts
import express from 'express';
import authController from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

// Admin login
router.post('/admin/auth/login', authController.login);

// Get current admin user
router.get('/admin/auth/me', authenticate, authController.getCurrentUser);

export default router;