import { Request, Response } from "express";
import   FieldDefinition  from "../models/fieldDefinition"; 
import   ContentType  from "../content-types/contentTypes"; 

// Create a new content type
export const createContentType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, name, description } = req.body;

    if (!identifier || !name) {
       res.status(400).json({ error: "Identifier and name are required" });
    }

    const newContentType = await ContentType.create({ identifier, name, description });


    // field definitions to be created in respeect to the content type, that it will be within the particular content type
    // if (fieldDefinitions && fieldDefinitions.length > 0) {
    //   const fieldDefs = fieldDefinitions.map((field: any) => ({
    //     ...field,
    //     contentTypeId: newContentType.id,
    //   }));
    //   await FieldDefinition.bulkCreate(fieldDefs);
    // }

    res.status(201).json(newContentType);
  } catch (error) {
    console.error("Error creating content type:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// List all content types
export const getAllContentTypes = async (req: Request, res: Response) : Promise<void> => {
  try {
    const contentTypes = await ContentType.findAll({
      include: [{ model: FieldDefinition, as: "fields" }],
    });

     res.status(200).json(contentTypes);
  } catch (error) {
     console.error("Error creating content type:", error);
     res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a content type by identifier
export const getContentTypeByIdentifier = async (req: Request, res: Response): Promise<void>  => {
  try {
    const { identifier } = req.params;

    const contentType = await ContentType.findOne({
      where: { identifier },
      include: [{ model: FieldDefinition, as: "fields" }],
    });

    if (!contentType) {
       res.status(404).json({ error: "Content Type not found" });
    }

     res.status(200).json(contentType);
  } catch (error) {
     res.status(500).json({ error: "Internal Server Error" });
  }
};


export const updateContentType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier } = req.params;
    const { name, description } = req.body;

    const contentType = await ContentType.findOne({ where: { identifier } });

    if (!contentType) {
      res.status(404).json({ error: "Content type not found" });
      return;
    }

    await contentType.update({ name, description });

    res.status(200).json(contentType);
  } catch (error) {
    console.error("Error updating content type:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const deleteContentType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier } = req.params;

    const contentType = await ContentType.findOne({ where: { identifier } });

    if (!contentType) {
      res.status(404).json({ error: "Content type not found" });
      return;
    }

    await contentType.destroy(); // If cascade is set in associations, fieldDefinitions will be deleted too.

    res.status(200).json({ message: "Content type deleted successfully" });
  } catch (error) {
    console.error("Error deleting content type:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


