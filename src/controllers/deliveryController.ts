// src/controllers/deliveryController.ts
import { Request, Response } from 'express';
import DeliveryService from '../services/delivery';

class DeliveryController {
  async getContentItem(req: Request, res: Response) {
    try {
      const { contentTypeIdentifier, slug } = req.params;
      const result = await DeliveryService.getContentItem(
        contentTypeIdentifier, 
        slug
      );
      res.json(result);
    } catch (error:any) {
      if (error.message === 'Content not found or not published') {
        res.status(404).json({ error: error.message });
      } else {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async listContentItems(req: Request, res: Response) {
    try {
      const { contentTypeIdentifier } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      
      const result = await DeliveryService.listContentItems(
        contentTypeIdentifier,
        page,
        pageSize
      );
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new DeliveryController();