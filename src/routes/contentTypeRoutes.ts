import express from "express";
import {
  createContentType,
  getAllContentTypes,
  getContentTypeByIdentifier,
  updateContentType,
  deleteContentType
} from "../controllers/contentTypeController";
import { adminAuthStub } from "../middleware/authMiddleware";
import { validateContentTypeUpdate } from "../middleware/validation";

const router = express.Router();

router.post("/content-types", adminAuthStub,validateContentTypeUpdate, createContentType);
router.get("/content-types", adminAuthStub, getAllContentTypes);
router.get("/content-types/:identifier", adminAuthStub, getContentTypeByIdentifier);
router.put('/content-types/:identifier', adminAuthStub, validateContentTypeUpdate, updateContentType);
router.delete('/content-types/:identifier', adminAuthStub, deleteContentType);

export default router;
