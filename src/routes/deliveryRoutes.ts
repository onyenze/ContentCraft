// src/routes/deliveryRoutes.ts
import express from 'express';
import DeliveryController from '../controllers/deliveryController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

// Get single published content item by slug
router.get('/content/:contentTypeIdentifier/:slug', 
  authenticate,
  DeliveryController.getContentItem
);

// List published content items for a content type
router.get('/content/:contentTypeIdentifier', 
  authenticate,
  DeliveryController.listContentItems,
);

router.get('/content-items',
  authenticate,
  DeliveryController. getContentItems
);

export default router;