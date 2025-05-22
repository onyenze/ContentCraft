// src/routes/deliveryRoutes.ts
import express from 'express';
import DeliveryController from '../controllers/deliveryController';

const router = express.Router();

// Get single published content item by slug
router.get('/content/:contentTypeIdentifier/:slug', 
  DeliveryController.getContentItem
);

// List published content items for a content type
router.get('/content/:contentTypeIdentifier', 
  DeliveryController.listContentItems
);

export default router;