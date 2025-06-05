// // tests/controllers/contentItemController.test.ts
// import request from 'supertest';
// import app from '../../src/app';
// import { ContentType, ContentItem, FieldDefinition } from '../../src/models/associations';
// jest.mock('../../src/models');

// const mockedContentType = ContentType as jest.Mocked<typeof ContentType>;
// const mockedContentItem = ContentItem as jest.Mocked<typeof ContentItem>;
// const mockedFieldDefinition = FieldDefinition as jest.Mocked<typeof FieldDefinition>;

// describe('Content Item Management', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   const mockContentType = jest.fn(() => ({
//   id: 1,
//   identifier: 'article',
//   fields: [
//     { identifier: 'title', dataType: 'string', required: true },
//     { identifier: 'body', dataType: 'longText', required: true },
//   ],
//   // Add any other properties or methods required by your model
// }))();

//   const mockContentItem = {
//     id: 1,
//     contentTypeId: 1,
//     title: 'Sample Article',
//     slug: 'sample-article',
//     data: { title: 'Sample Article', body: 'Content goes here' },
//     status: 'DRAFT',
//     publishedAt: null,
//     save: jest.fn().mockResolvedValue(true),
//     destroy: jest.fn().mockResolvedValue(true),
//     update: jest.fn().mockResolvedValue(true),
//     toJSON: function () {
//       return { ...this };
//     },
//   };

//   describe('GET /api/admin/content-types/:contentTypeIdentifier/content-items', () => {
//     it('should return list of content items', async () => {
//       mockedContentType.findOne.mockResolvedValue(mockContentType);
//       mockedContentItem.findAll.mockResolvedValue([mockContentItem]);
//       mockedContentItem.count.mockResolvedValue(1);

//       const res = await request(app)
//         .get('/api/admin/content-types/article/content-items')
//         .set('Authorization', 'Bearer valid-token');

//       expect(res.status).toBe(200);
//       expect(res.body.contentItems).toHaveLength(1);
//     });

//     it('should return 404 if content type not found', async () => {
//       mockedContentType.findOne.mockResolvedValue(null);

//       const res = await request(app)
//         .get('/api/admin/content-types/unknown/content-items')
//         .set('Authorization', 'Bearer valid-token');

//       expect(res.status).toBe(404);
//     });
//   });

//   describe('POST /api/admin/content-types/:contentTypeIdentifier/content-items', () => {
//     it('should create new content item', async () => {
//       mockedContentType.findOne.mockResolvedValue(mockContentType);
//       mockedContentItem.create.mockResolvedValue(mockContentItem as any);

//       const res = await request(app)
//         .post('/api/admin/content-types/article/content-items')
//         .set('Authorization', 'Bearer valid-token')
//         .send({
//           title: 'Sample Article',
//           slug: 'sample-article',
//           data: { title: 'Sample Article', body: 'Content goes here' },
//         });

//       expect(res.status).toBe(201);
//       expect(mockedContentItem.create).toHaveBeenCalled();
//     });

//     it('should return 400 if required fields missing', async () => {
//       mockedContentType.findOne.mockResolvedValue(mockContentType);

//       const res = await request(app)
//         .post('/api/admin/content-types/article/content-items')
//         .set('Authorization', 'Bearer valid-token')
//         .send({
//           title: 'Sample Article',
//           slug: 'sample-article',
//           data: { title: 'Only title provided' },
//         });

//       expect(res.status).toBe(400);
//     });

//     it('should return 404 if content type not found', async () => {
//       mockedContentType.findOne.mockResolvedValue(null);

//       const res = await request(app)
//         .post('/api/admin/content-types/unknown/content-items')
//         .set('Authorization', 'Bearer valid-token')
//         .send({
//           title: 'Sample Article',
//           slug: 'sample-article',
//           data: { title: 'Sample', body: 'Content' },
//         });

//       expect(res.status).toBe(404);
//     });
//   });

//   describe('GET /api/admin/content-items/:id', () => {
//     it('should return content item by id', async () => {
//       mockedContentItem.findByPk.mockResolvedValue(mockContentItem as any);

//       const res = await request(app)
//         .get('/api/admin/content-items/1')
//         .set('Authorization', 'Bearer valid-token');

//       expect(res.status).toBe(200);
//       expect(res.body.contentItem.id).toBe(1);
//     });

//     it('should return 404 if content item not found', async () => {
//       mockedContentItem.findByPk.mockResolvedValue(null);

//       const res = await request(app)
//         .get('/api/admin/content-items/999')
//         .set('Authorization', 'Bearer valid-token');

//       expect(res.status).toBe(404);
//     });
//   });

//   describe('PUT /api/admin/content-items/:id', () => {
//     it('should update content item', async () => {
//       mockedContentItem.findByPk.mockResolvedValue(mockContentItem as any);

//       const res = await request(app)
//         .put('/api/admin/content-items/1')
//         .set('Authorization', 'Bearer valid-token')
//         .send({
//           title: 'Updated',
//           slug: 'updated',
//           data: { title: 'Updated', body: 'Updated content' },
//         });

//       expect(res.status).toBe(200);
//     });

//     it('should return 404 if content item not found', async () => {
//       mockedContentItem.findByPk.mockResolvedValue(null);

//       const res = await request(app)
//         .put('/api/admin/content-items/999')
//         .set('Authorization', 'Bearer valid-token')
//         .send({ title: 'Updated' });

//       expect(res.status).toBe(404);
//     });
//   });

//   describe('DELETE /api/admin/content-items/:id', () => {
//     it('should delete content item', async () => {
//       mockedContentItem.findByPk.mockResolvedValue(mockContentItem as any);

//       const res = await request(app)
//         .delete('/api/admin/content-items/1')
//         .set('Authorization', 'Bearer valid-token');

//       expect(res.status).toBe(204);
//     });

//     it('should return 404 if content item not found', async () => {
//       mockedContentItem.findByPk.mockResolvedValue(null);

//       const res = await request(app)
//         .delete('/api/admin/content-items/999')
//         .set('Authorization', 'Bearer valid-token');

//       expect(res.status).toBe(404);
//     });
//   });

//   describe('PATCH /api/admin/content-items/:id/publish', () => {
//     it('should publish a content item', async () => {
//       mockedContentItem.findByPk.mockResolvedValue(mockContentItem as any);

//       const res = await request(app)
//         .patch('/api/admin/content-items/1/publish')
//         .set('Authorization', 'Bearer valid-token');

//       expect(res.status).toBe(200);
//       expect(mockContentItem.save).toHaveBeenCalled();
//     });

//     it('should return 404 if content item not found', async () => {
//       mockedContentItem.findByPk.mockResolvedValue(null);

//       const res = await request(app)
//         .patch('/api/admin/content-items/999/publish')
//         .set('Authorization', 'Bearer valid-token');

//       expect(res.status).toBe(404);
//     });
//   });

//   describe('GET /api/admin/content-items/:id/versions', () => {
//     it('should return versions of content item', async () => {
//       jest.spyOn(require('../../src/services/contentItem'), 'getContentVersions')
//         .mockResolvedValue([{ version: 1 }, { version: 2 }]);

//       const res = await request(app)
//         .get('/api/admin/content-items/1/versions')
//         .set('Authorization', 'Bearer valid-token');

//       expect(res.status).toBe(200);
//       expect(res.body).toHaveLength(2);
//     });
//   });

//   describe('POST /api/admin/content-items/:id/versions/:versionId/restore', () => {
//     it('should restore a version', async () => {
//       jest.spyOn(require('../../src/services/contentItem'), 'restoreVersion')
//         .mockResolvedValue({ success: true });

//       const res = await request(app)
//         .post('/api/admin/content-items/1/versions/2/restore')
//         .set('Authorization', 'Bearer valid-token');

//       expect(res.status).toBe(200);
//       expect(res.body).toHaveProperty('success');
//     });

//     it('should return 404 if version not found', async () => {
//       jest.spyOn(require('../../src/services/contentItem'), 'restoreVersion')
//         .mockRejectedValue(new Error('Version not found'));

//       const res = await request(app)
//         .post('/api/admin/content-items/1/versions/999/restore')
//         .set('Authorization', 'Bearer valid-token');

//       expect(res.status).toBe(404);
//     });
//   });
// });
