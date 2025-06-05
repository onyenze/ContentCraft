import { Request, Response } from 'express';
import * as service from '../services/fieldDefinitions';

export const createFieldDefinition = async (req: Request, res: Response) => {
  try {
    const { name, identifier, dataType, contentTypeId } = req.body;
    const field = await service.createFieldDefinition({ name, identifier, dataType, contentTypeId });
    res.status(201).json({ fieldDefinition: field });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create field definition' });
  }
};

export const getFieldDefinitions = async (req: Request, res: Response) => {
  try {
    const fields = await service.getFieldDefinitions();
    res.status(200).json({ fieldDefinitions: fields });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch field definitions' });
  }
};

export const updateFieldDefinition = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updates = req.body;
    const updated = await service.updateFieldDefinition(id, updates);

    if (!updated) {
       res.status(404).json({ error: 'Field definition not found' });
       return
    }

    res.status(200).json({ fieldDefinition: updated });
    return
  } catch (error) {
    res.status(500).json({ error: 'Failed to update field definition' });
    return
  }
};

export const deleteFieldDefinition = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const deleted = await service.deleteFieldDefinition(id);

    if (!deleted) {
       res.status(404).json({ error: 'Field definition not found' });
       return
    }

    res.status(200).json({ message: 'Field definition deleted successfully' });
    return
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete field definition' });
    return
  }
};
