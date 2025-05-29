import { Request, Response } from 'express';
import * as contentService from "../services/contentItem";

export const createContentItem = async (req: Request, res: Response) => {
  try {
    const contentItem = await contentService.createContentItem(
      req.params.contentTypeIdentifier,
      req.body
    );
     res.status(201).json({ contentItem });
     return;
  } catch (error: any) {
    console.error(error);
    res.status(404).json({ error: error.message });
    return;
  }
};

export const getContentItemsByType = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const result = await contentService.getContentItemsByType(
      req.params.contentTypeIdentifier,
      offset,
      limit
    );

     res.status(200).json(result);
     return;
  } catch (error: any) {
    console.error(error);
    res.status(404).json({ error: error.message });
    return;
  }
};


export const getContentItemById = async (req: Request, res: Response) => {
  try {
    const contentItem = await contentService.getContentItemById(req.params.contentItemId);
    if (!contentItem)  {res.status(404).json({ error: "ContentItem not found" }); return;}

     res.status(200).json({ contentItem });
     return;
  } catch (error) {
    console.error(error);
     res.status(500).json({ error: "Internal server error" });
     return;
  }
};

export const updateContentItem = async (req: Request, res: Response) => {
  try {
    const contentItemId = Number(req.params.contentItemId);
    const updated = await contentService.updateContentItem(contentItemId, req.body);
    if (!updated)  {res.status(404).json({ error: "Content Item not found" });
    return;}

    res.status(200).json({ contentItem: updated });
    return;
  } catch (error) {
    console.error(error);
     res.status(500).json({ error: "Internal server error" });
     return;
  }
};

export const deleteContentItem = async (req: Request, res: Response) => {
  try {
    const deleted = await contentService.deleteContentItem(req.params.contentItemId);
    if (!deleted)  {res.status(404).json({ error: "Content Item not found" }); return;}
    res.status(200).json({ message: "Deleted Successfully" });
     return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
     return;
  }
};

export const getContentVersions = async (req: Request, res: Response)=> {
  try {
    const result = await contentService.getContentVersions(Number(req.params.id));
    res.json(result);
  } catch (error:any) {
    if (error.message === 'Version not found') {
      res.status(404).json({ error: error.message });
    } else {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const restoreVersion = async(req: Request, res: Response) =>{
  try {
    const result = await contentService.restoreVersion(
      Number(req.params.id),
      Number(req.params.versionId)
    );
    res.json(result);
  } catch (error:any) {
    if (error.message === 'Version not found') {
      res.status(404).json({ error: error.message });
    } else {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}


// src/controllers/contentItemController.ts
export const publishContentItem =async (req: Request, res: Response)=> {
  try {
    const contentItem = await contentService.getContentItemById(req.params.contentItemId);
    if (!contentItem) {
       res.status(404).json({ errors: { message: 'Content item not found' } });
       return
    }

    contentItem.status = 'PUBLISHED';
    contentItem.publishedAt = new Date();
    await contentItem.save();

     res.json({ contentItem });
     return
  } catch (error) {
    console.error(error);
     res.status(500).json({ errors: { message: 'Internal server error' } });
     return
  }
}
