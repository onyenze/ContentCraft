// tests/controllers/deliveryController.test.ts
import request from 'supertest';
import app from '../../src/app';
import { ContentType, ContentItem } from '../../src/models/associations';

jest.mock('../../src/models');

const mockedContentType = ContentType as jest.Mocked<typeof ContentType>;
const mockedContentItem = ContentItem as jest.Mocked<typeof ContentItem>;

describe('Content Delivery', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/content/:contentTypeIdentifier', () => {
    it('should list published content items for a content type', async () => {
      const mockContentType = {
        id: 1,
        identifier: 'article',
      };
      
      const mockContentItems = [
        { id: 1, contentTypeId: 1, title: 'Published Article', slug: 'published-article', status: 'PUBLISHED' },
        { id: 2, contentTypeId: 1, title: 'Another Article', slug: 'another-article', status: 'PUBLISHED' },
      ];
      
      mockedContentType.findOne.mockResolvedValue(mockContentType);
      mockedContentItem.findAll.mockResolvedValue(mockContentItems);
      mockedContentItem.count.mockResolvedValue(2);

      const response = await request(app)
        .get('/api/content/article');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('contentItems');
      expect(response.body.contentItems).toHaveLength(2);
      expect(response.body).toHaveProperty('contentItemsCount', 2);
      expect(mockedContentItem.findAll).toHaveBeenCalledWith({
        where: { contentTypeId: 1, status: 'PUBLISHED' },
        limit: 20,
        offset: 0,
      });
    });

    it('should return 404 for non-existent content type', async () => {
      mockedContentType.findOne.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/content/nonexistent');

      expect(response.status).toBe(404);
    });

    it('should support pagination', async () => {
      const mockContentType = {
        id: 1,
        identifier: 'article',
      };
      
      mockedContentType.findOne.mockResolvedValue(mockContentType);
      mockedContentItem.findAll.mockResolvedValue([]);
      mockedContentItem.count.mockResolvedValue(0);

      const response = await request(app)
        .get('/api/content/article?limit=10&offset=20');

      expect(response.status).toBe(200);
      expect(mockedContentItem.findAll).toHaveBeenCalledWith({
        where: { contentTypeId: 1, status: 'PUBLISHED' },
        limit: 10,
        offset: 20,
      });
    });
  });

  describe('GET /api/content/:contentTypeIdentifier/:contentItemIdentifier', () => {
    it('should get a published content item by identifier', async () => {
      const mockContentType = {
        id: 1,
        identifier: 'article',
      };
      
      const mockContentItem = {
        id: 1,
        contentTypeId: 1,
        slug: 'published-article',
        status: 'PUBLISHED',
        data: { title: 'Published Article', body: 'Content here' },
        toJSON: () => ({
          id: 1,
          contentTypeId: 1,
          slug: 'published-article',
          status: 'PUBLISHED',
          data: { title: 'Published Article', body: 'Content here' },
        }),
      };
      
      mockedContentType.findOne.mockResolvedValue(mockContentType);
      mockedContentItem.findOne.mockResolvedValue(mockContentItem);

      const response = await request(app)
        .get('/api/content/article/published-article');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('contentItem');
      expect(response.body.contentItem.slug).toBe('published-article');
      expect(mockedContentItem.findOne).toHaveBeenCalledWith({
        where: { contentTypeId: 1, slug: 'published-article', status: 'PUBLISHED' },
      });
    });

    it('should return 404 for non-existent content type', async () => {
      mockedContentType.findOne.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/content/nonexistent/some-slug');

      expect(response.status).toBe(404);
    });

    it('should return 404 for non-existent content item', async () => {
      const mockContentType = {
        id: 1,
        identifier: 'article',
      };
      
      mockedContentType.findOne.mockResolvedValue(mockContentType);
      mockedContentItem.findOne.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/content/article/nonexistent-slug');

      expect(response.status).toBe(404);
    });

    it('should return 404 for non-published content item', async () => {
      const mockContentType = {
        id: 1,
        identifier: 'article',
      };
      
      const mockContentItem = {
        id: 1,
        status: 'DRAFT', // Not published
      };
      
      mockedContentType.findOne.mockResolvedValue(mockContentType);
      mockedContentItem.findOne.mockResolvedValue(mockContentItem);

      const response = await request(app)
        .get('/api/content/article/draft-article');

      expect(response.status).toBe(404);
    });
  });
});