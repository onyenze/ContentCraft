// tests/delivery.test.ts
import request from 'supertest';
import app from '../app'; // Adjusted path to your app
import { ContentItem, ContentType } from '../models/associations'; // Use your models from associations
import sequelize from '../config/database';

describe('Content Delivery API', () => {
  beforeAll(async () => {
    // Sync database and create test data
    await sequelize.sync({ force: true });
    
    await ContentType.create({
      identifier: "article",
      name: "Article",
      description: "Blog articles"
    });

    await ContentItem.bulkCreate([
      {
        contentTypeIdentifier: 'article',
        title: "First Article",
        slug: "first-article",
        status: "PUBLISHED",
        publishedAt: new Date(),
        data: {
          title: "My First Article",
          body: "Hello World!",
          authorName: "Chibueze Onyenze"
        }
      },
      {
        contentTypeIdentifier: 'article',
        title: "Draft Article",
        slug: "draft-article",
        status: "DRAFT",
        data: {
          title: "My Draft Article",
          body: "Coming soon!",
          authorName: "Chibueze Onyenze"
        }
      }
    ]);
  });

  afterAll(async () => {
    // Clean up
    await ContentItem.destroy({ where: {} });
    await ContentType.destroy({ where: {} });
    await sequelize.close();
  });

  describe('GET /api/content/:contentTypeIdentifier/:slug', () => {
    it('should return published content item', async () => {
      const res = await request(app)
        .get('/api/content/article/first-article');
      
      expect(res.status).toBe(200);
      expect(res.body.contentItem).toHaveProperty('title', 'First Article');
      expect(res.body.contentItem.status).toBe('PUBLISHED');
    });

    it('should return 404 for unpublished content', async () => {
      const res = await request(app)
        .get('/api/content/article/draft-article');
      
      expect(res.status).toBe(404);
    });

    it('should return 404 for non-existent content', async () => {
      const res = await request(app)
        .get('/api/content/article/non-existent');
      
      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/content/:contentTypeIdentifier', () => {
    it('should return only published content items', async () => {
      const res = await request(app)
        .get('/api/content/article');
      
      expect(res.status).toBe(200);
      expect(res.body.contentItems.length).toBe(1);
      expect(res.body.contentItems[0].slug).toBe('first-article');
    });

    it('should support pagination', async () => {
      const res = await request(app)
        .get('/api/content/article?page=1&pageSize=10');
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('pagination');
      expect(res.body.pagination.totalItems).toBe(1);
      expect(res.body.pagination.currentPage).toBe(1);
    });
  });
});