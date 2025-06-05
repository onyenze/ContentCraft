// src/routes/contentItemRoutes.ts
import { Router } from 'express';
import {
  createContentItem, 
  getContentItemsByType,
  getContentItemById,
  updateContentItem,
  deleteContentItem,
  getContentVersions,
  restoreVersion,
  publishContentItem
} from '../controllers/contentItemController';
import { adminAuthStub } from "../middleware/authMiddleware";
import { authenticate } from '../middleware/authMiddleware';
import { requirePermission, requireAnyPermission } from '../middleware/permissionMiddleware';
import { PERMISSIONS } from '../constants/permissions';

const router = Router();

router.post( '/content-types/:contentTypeIdentifier/content-items',
  authenticate,
  // adminAuthStub,
  requirePermission(PERMISSIONS.CREATE_CONTENT),
  createContentItem);
router.get('/content-types/:contentTypeIdentifier/content-items', 
  authenticate,
  // adminAuthStub,
  requirePermission(PERMISSIONS.VIEW_CONTENT),
  getContentItemsByType );
router.get( '/content-items/:contentItemId',
  authenticate,
  // adminAuthStub,
  requirePermission(PERMISSIONS.VIEW_CONTENT),
  getContentItemById );
router.put("/content-items/:contentItemId",
  authenticate,
  // adminAuthStub,
  requirePermission(PERMISSIONS.EDIT_CONTENT),
  updateContentItem);

router.delete("/content-items/:contentItemId",
  authenticate,
  // adminAuthStub,
  requirePermission(PERMISSIONS.DELETE_CONTENT),
  deleteContentItem);


router.get('/content-items/:id/versions', 
  authenticate,
  adminAuthStub,
  getContentVersions);


 router.post('/content-items/:id/versions/:versionId/restore', 
  authenticate,
  adminAuthStub,
  restoreVersion);

// Publish content item (additional endpoint)
router.patch(
  '/admin/content-items/:contentItemId/publish',
  authenticate,
  adminAuthStub,
  requirePermission(PERMISSIONS.PUBLISH_CONTENT),
  publishContentItem
);
export default router;
