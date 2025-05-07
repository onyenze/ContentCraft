import { Request, Response } from "express";
import * as contentTypeService from "../services/contentType";

// Create
export const createContentType = async (req: Request, res: Response): Promise<void> => {
  try {
    const newContentType = await contentTypeService.createContentType(req.body);
    res.status(201).json(newContentType);
  } catch (error: any) {
    console.error("Error creating content type:", error);
    res.status(400).json({ error: error.message || "Internal Server Error" });
  }
};

// List all
export const getAllContentTypes = async (req: Request, res: Response): Promise<void> => {
  try {
    const contentTypes = await contentTypeService.getAllContentTypes();
    res.status(200).json(contentTypes);
  } catch (error) {
    console.error("Error getting content types:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get by identifier
export const getContentTypeByIdentifier = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier } = req.params;
    const contentType = await contentTypeService.getContentTypeByIdentifier(identifier);
    res.status(200).json(contentType);
  } catch (error: any) {
    res.status(404).json({ error: error.message || "Internal Server Error" });
  }
};

// Update
export const updateContentType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier } = req.params;
    const updated = await contentTypeService.updateContentType(identifier, req.body);
    res.status(200).json(updated);
  } catch (error: any) {
    res.status(404).json({ error: error.message || "Internal Server Error" });
  }
};

// Delete
export const deleteContentType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier } = req.params;
    await contentTypeService.deleteContentType(identifier);
    res.status(200).json({ message: "Content type deleted successfully" });
  } catch (error: any) {
    res.status(404).json({ error: error.message || "Internal Server Error" });
  }
};
