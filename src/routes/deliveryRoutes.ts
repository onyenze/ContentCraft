// src/routes/deliveryRoutes.ts
import express from 'express';
import DeliveryController from '../controllers/deliveryController';
import { authenticate,adminAuthStub } from '../middleware/authMiddleware';

const router = express.Router();

// Get single published content item by slug
router.get('/content/:contentTypeIdentifier/:slug', 
  authenticate,
  adminAuthStub,
  DeliveryController.getContentItem
);

// List published content items for a content type
router.get('/content/:contentTypeIdentifier', 
  authenticate,
  adminAuthStub,
  DeliveryController.listContentItems,
);

router.get('/content-items',
  authenticate,
  adminAuthStub,
  DeliveryController.getContentItems
);

export default router;