// src/repositories/content.repository.ts
import { ContentItem, ContentType } from '../models/associations';
import { Op } from 'sequelize';

class ContentRepository {
  async getPublishedContentItem(contentTypeIdentifier: string, slug: string) {
    return ContentItem.findOne({
      where: {
        contentTypeIdentifier,
        slug,
        status: 'PUBLISHED'
      },
      include: [{
        model: ContentType,
        as: 'contentType',
        where: { identifier: contentTypeIdentifier }
      }]
    });
  }

  async listPublishedContentItems(contentTypeIdentifier: string, limit: number, offset: number) {
    return ContentItem.findAndCountAll({
      where: {
        contentTypeIdentifier,
        status: 'PUBLISHED',
        // publishedAt: { [Op.not]: null } // Only items with publishedAt date
      },
      limit,
      offset,
      order: [['publishedAt', 'DESC']],
      include: [{
        model: ContentType,
        as: 'contentType',
        where: { identifier: contentTypeIdentifier }
      }]
    });
  }
}

export default new ContentRepository();