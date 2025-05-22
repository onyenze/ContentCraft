// tests/controllers/contentItemController.test.ts
import request from 'supertest';
import app from '../../src/app';
import { ContentType, ContentItem, FieldDefinition } from '../../src/models';

jest.mock('../../src/models');

const mockedContentType = ContentType as jest.Mocked<typeof ContentType>;
const mockedContentItem = ContentItem as jest.Mocked<typeof ContentItem>;
const mockedFieldDefinition = FieldDefinition as jest.Mocked<typeof FieldDefinition>;

describe('Content Item Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/admin/content-types/:contentTypeIdentifier/content-items', () => {
    it('should list content items for a content type', async () => {
      const mockContentType = {
        id: 1,
        identifier: 'article',
      };
      
      const mockContentItems = [
        { id: 1, contentTypeId: 1, title: 'First Article', slug: 'first-article' },
        { id: 2, contentTypeId: 1, title: 'Second Article', slug: 'second-article' },
      ];
      
      mockedContentType.findOne.mockResolvedValue(mockContentType);
      mockedContentItem.findAll.mockResolvedValue(mockContentItems);
      mockedContentItem.count.mockResolvedValue(2);

      const response = await request(app)
        .get('/api/admin/content-types/article/content-items')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('contentItems');
      expect(response.body.contentItems).toHaveLength(2);
      expect(response.body).toHaveProperty('contentItemsCount', 2);
    });

    it('should return 404 for non-existent content type', async () => {
      mockedContentType.findOne.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/admin/content-types/nonexistent/content-items')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/admin/content-types/:contentTypeIdentifier/content-items', () => {
    it('should create a new content item', async () => {
      const mockContentType = {
        id: 1,
        identifier: 'article',
        fieldDefinitions: [
          { identifier: 'title', dataType: 'string', required: true },
          { identifier: 'body', dataType: 'longText', required: true },
        ],
      };
      
      const mockContentItem = {
        id: 1,
        contentTypeId: 1,
        title: 'New Article',
        slug: 'new-article',
        data: { title: 'New Article', body: 'Content here' },
        toJSON: () => ({
          id: 1,
          contentTypeId: 1,
          title: 'New Article',
          slug: 'new-article',
          data: { title: 'New Article', body: 'Content here' },
        }),
      };
      
      mockedContentType.findOne.mockResolvedValue(mockContentType);
      mockedContentItem.create.mockResolvedValue(mockContentItem);

      const response = await request(app)
        .post('/api/admin/content-types/article/content-items')
        .set('Authorization', 'Bearer valid-token')
        .send({
          title: 'New Article',
          slug: 'new-article',
          data: {
            title: 'New Article',
            body: 'Content here',
          },
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('contentItem');
      expect(response.body.contentItem.title).toBe('New Article');
      expect(mockedContentItem.create).toHaveBeenCalledWith({
        title: 'New Article',
        slug: 'new-article',
        contentTypeId: 1,
        data: { title: 'New Article', body: 'Content here' },
        status: 'DRAFT',
      });
    });

    it('should return 400 when missing required fields', async () => {
      const mockContentType = {
        id: 1,
        identifier: 'article',
        fieldDefinitions: [
          { identifier: 'title', dataType: 'string', required: true },
          { identifier: 'body', dataType: 'longText', required: true },
        ],
      };
      
      mockedContentType.findOne.mockResolvedValue(mockContentType);

      const response = await request(app)
        .post('/api/admin/content-types/article/content-items')
        .set('Authorization', 'Bearer valid-token')
        .send({
          title: 'New Article',
          slug: 'new-article',
          data: {
            // Missing body field
            title: 'New Article',
          },
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });

    it('should return 404 for non-existent content type', async () => {
      mockedContentType.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/admin/content-types/nonexistent/content-items')
        .set('Authorization', 'Bearer valid-token')
        .send({
          title: 'New Article',
          slug: 'new-article',
          data: {
            title: 'New Article',
            body: 'Content here',
          },
        });

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/admin/content-items/:contentItemId', () => {
    it('should get a content item by ID', async () => {
      const mockContentItem = {
        id: 1,
        contentTypeId: 1,
        title: 'Existing Article',
        slug: 'existing-article',
        data: { title: 'Existing Article', body: 'Existing content' },
        toJSON: () => ({
          id: 1,
          contentTypeId: 1,
          title: 'Existing Article',
          slug: 'existing-article',
          data: { title: 'Existing Article', body: 'Existing content' },
        }),
      };
      
      mockedContentItem.findByPk.mockResolvedValue(mockContentItem);

      const response = await request(app)
        .get('/api/admin/content-items/1')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('contentItem');
      expect(response.body.contentItem.id).toBe(1);
    });

    it('should return 404 for non-existent content item', async () => {
      mockedContentItem.findByPk.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/admin/content-items/999')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/admin/content-items/:contentItemId', () => {
    it('should update a content item', async () => {
      const mockContentItem = {
        id: 1,
        contentTypeId: 1,
        title: 'Updated Article',
        slug: 'updated-article',
        data: { title: 'Updated Article', body: 'Updated content' },
        update: jest.fn().mockResolvedValue(true),
        toJSON: () => ({
          id: 1,
          contentTypeId: 1,
          title: 'Updated Article',
          slug: 'updated-article',
          data: { title: 'Updated Article', body: 'Updated content' },
        }),
      };
      
      mockedContentItem.findByPk.mockResolvedValue(mockContentItem);

      const response = await request(app)
        .put('/api/admin/content-items/1')
        .set('Authorization', 'Bearer valid-token')
        .send({
          title: 'Updated Article',
          slug: 'updated-article',
          data: {
            title: 'Updated Article',
            body: 'Updated content',
          },
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('contentItem');
      expect(response.body.contentItem.title).toBe('Updated Article');
    });

    it('should return 404 for non-existent content item', async () => {
      mockedContentItem.findByPk.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/admin/content-items/999')
        .set('Authorization', 'Bearer valid-token')
        .send({
          title: 'Updated Article',
          data: {
            title: 'Updated Article',
          },
        });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/admin/content-items/:contentItemId', () => {
    it('should delete a content item', async () => {
      const mockContentItem = {
        id: 1,
        destroy: jest.fn().mockResolvedValue(true),
      };
      
      mockedContentItem.findByPk.mockResolvedValue(mockContentItem);

      const response = await request(app)
        .delete('/api/admin/content-items/1')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(204);
      expect(mockContentItem.destroy).toHaveBeenCalled();
    });

    it('should return 404 for non-existent content item', async () => {
      mockedContentItem.findByPk.mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/admin/content-items/999')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(404);
    });
  });
});