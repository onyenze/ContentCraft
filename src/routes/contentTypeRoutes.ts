import express from "express";
import {
  createContentType,
  getAllContentTypes,
  getContentTypeByIdentifier,
  updateContentType,
  deleteContentType
} from "../controllers/contentTypeController";
import { adminAuthStub } from "../middleware/authMiddleware";
import { validateSchema } from '../middleware/validateSchema';
import { contentTypeUpdateSchema } from '../validators/contentTypeSchema';
import { authenticate } from '../middleware/authMiddleware';
import { requirePermission, requireAnyPermission } from '../middleware/permissionMiddleware';
import { PERMISSIONS } from '../constants/permissions';

const router = express.Router();

router.post("/content-types", authenticate,adminAuthStub,validateSchema(contentTypeUpdateSchema), requirePermission(PERMISSIONS.CREATE_CONTENT_TYPE),createContentType);
router.get("/content-types", authenticate,adminAuthStub, requirePermission(PERMISSIONS.VIEW_CONTENT_TYPE),getAllContentTypes);
router.get("/content-types/:identifier",authenticate, adminAuthStub, requirePermission(PERMISSIONS.VIEW_CONTENT_TYPE),getContentTypeByIdentifier);
router.put('/content-types/:identifier', authenticate,adminAuthStub, requirePermission(PERMISSIONS.MANAGE_CONTENT_TYPE),validateSchema(contentTypeUpdateSchema), updateContentType);
router.delete('/content-types/:identifier',authenticate, adminAuthStub, requirePermission(PERMISSIONS.MANAGE_CONTENT_TYPE),deleteContentType);

export default router;
