// src/routes/contentItemRoutes.ts
import { Router } from 'express';
import {
  createContentItem, 
  getContentItemsByType,
  getContentItemById,
  updateContentItem,
  deleteContentItem
} from '../controllers/contentItemController';
import { adminAuthStub } from "../middleware/authMiddleware";

const router = Router();

router.post( '/content-types/:contentTypeIdentifier/content-items',adminAuthStub,createContentItem);
router.get('/content-types/:contentTypeIdentifier/content-items', adminAuthStub,getContentItemsByType );
router.get( '/content-items/:contentItemId',adminAuthStub,getContentItemById );
router.put("/content-items/:contentItemId",adminAuthStub,updateContentItem);

router.delete("/content-items/:contentItemId",adminAuthStub,deleteContentItem);
export default router;
