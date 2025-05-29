// src/controllers/deliveryController.ts
import { Request, Response } from 'express';
import DeliveryService from '../services/delivery';

import { Op, where, fn, col, cast, literal } from 'sequelize';
import ContentItem from '../models/contentItem';

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




 async getContentItems  (req: Request, res: Response) {
  const { search } = req.query;

  try {
    const whereClause: any = {
      status: 'PUBLISHED',
    };

    if (search && typeof search === 'string') {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { slug: { [Op.iLike]: `%${search}%` } },
        where(cast(col("data->>'body'"), 'TEXT'), {
          [Op.iLike]: `%${search}%`
        }),
        where(cast(col("data->>'title'"), 'TEXT'), {
          [Op.iLike]: `%${search}%`
        }),
        where(cast(col("data->>'authorName'"), 'TEXT'), {
          [Op.iLike]: `%${search}%`
        })
      ];
    }

    const items = await ContentItem.findAll({ where: whereClause });

    res.status(200).json(items);
    return
  } catch (error) {
    console.error('Error fetching content items:', error);
    res.status(500).json({ error: 'Failed to fetch content items' });
    return
  }
};

}

export default new DeliveryController();