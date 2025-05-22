// src/services/delivery.service.ts
import ContentRepository from '../repositories/delivery';
import { Op } from 'sequelize';

class DeliveryService {
  async getContentItem(contentTypeIdentifier: string, slug: string) {
    const item = await ContentRepository.getPublishedContentItem(
      contentTypeIdentifier, 
      slug
    );
    
    if (!item) {
      throw new Error('Content not found or not published');
    }

    return { contentItem: item };
  }

  async listContentItems(contentTypeIdentifier: string, page = 1, pageSize = 10) {
    const offset = (page - 1) * pageSize;
    const { rows: items, count: totalItems } = await ContentRepository.listPublishedContentItems(
      contentTypeIdentifier,
      pageSize,
      offset
    );

    return {
      contentItems: items,
      pagination: {
        currentPage: page,
        pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize)
      }
    };
  }
}

export default new DeliveryService();