// // tests/controllers/fieldDefinitionController.test.ts
// import request from 'supertest';
// import app from '../../src/app';
// import ContentType from '../../src/models/contentType';
// import FieldDefinition from '../../src/models/fieldDefinition';

// jest.mock('../../src/models');

// const mockedContentType = ContentType as jest.Mocked<typeof ContentType>;
// const mockedFieldDefinition = FieldDefinition as jest.Mocked<typeof FieldDefinition>;

// describe('Field Definition Management', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('POST /api/admin/content-types/:contentTypeIdentifier/field-definitions', () => {
//     it('should create a new field definition', async () => {
//       const mockContentType = {
//         id: 1,
//         identifier: 'article',
//         addFieldDefinition: jest.fn(),
//       };
      
//       const mockFieldDefinition = {
//         id: 1,
//         name: 'Title',
//         identifier: 'title',
//         dataType: 'string',
//         contentTypeId: 1,
//         toJSON: () => ({
//           id: 1,
//           name: 'Title',
//           identifier: 'title',
//           dataType: 'string',
//           contentTypeId: 1,
//         }),
//       };
      
//       mockedContentType.findOne.mockResolvedValue(mockContentType);
//       mockedFieldDefinition.create.mockResolvedValue(mockFieldDefinition);

//       const response = await request(app)
//         .post('/api/admin/content-types/article/field-definitions')
//         .set('Authorization', 'Bearer valid-token')
//         .send({
//           name: 'Title',
//           identifier: 'title',
//           dataType: 'string',
//         });

//       expect(response.status).toBe(201);
//       expect(response.body).toHaveProperty('fieldDefinition');
//       expect(response.body.fieldDefinition.name).toBe('Title');
//       expect(mockedFieldDefinition.create).toHaveBeenCalledWith({
//         name: 'Title',
//         identifier: 'title',
//         dataType: 'string',
//         contentTypeId: 1,
//       });
//     });

//     it('should return 404 for non-existent content type', async () => {
//       mockedContentType.findOne.mockResolvedValue(null);

//       const response = await request(app)
//         .post('/api/admin/content-types/nonexistent/field-definitions')
//         .set('Authorization', 'Bearer valid-token')
//         .send({
//           name: 'Title',
//           identifier: 'title',
//           dataType: 'string',
//         });

//       expect(response.status).toBe(404);
//     });

//     it('should return 400 for invalid input', async () => {
//       const mockContentType = {
//         id: 1,
//         identifier: 'article',
//       };
      
//       mockedContentType.findOne.mockResolvedValue(mockContentType);

//       const response = await request(app)
//         .post('/api/admin/content-types/article/field-definitions')
//         .set('Authorization', 'Bearer valid-token')
//         .send({
//           identifier: 'title',
//           // Missing name and dataType
//         });

//       expect(response.status).toBe(400);
//       expect(response.body).toHaveProperty('errors');
//     });
//   });

//   describe('PUT /api/admin/field-definitions/:identifier', () => {
//     it('should update a field definition', async () => {
//       const mockFieldDefinition = {
//         id: 1,
//         identifier: 'title',
//         name: 'Updated Title',
//         dataType: 'string',
//         update: jest.fn().mockResolvedValue(true),
//         toJSON: () => ({
//           id: 1,
//           identifier: 'title',
//           name: 'Updated Title',
//           dataType: 'string',
//         }),
//       };
      
//       mockedFieldDefinition.findOne.mockResolvedValue(mockFieldDefinition);

//       const response = await request(app)
//         .put('/api/admin/field-definitions/title')
//         .set('Authorization', 'Bearer valid-token')
//         .send({
//           name: 'Updated Title',
//         });

//       expect(response.status).toBe(200);
//       expect(response.body).toHaveProperty('fieldDefinition');
//       expect(response.body.fieldDefinition.name).toBe('Updated Title');
//       expect(mockFieldDefinition.update).toHaveBeenCalledWith({
//         name: 'Updated Title',
//       });
//     });

//     it('should return 404 for non-existent field definition', async () => {
//       mockedFieldDefinition.findOne.mockResolvedValue(null);

//       const response = await request(app)
//         .put('/api/admin/field-definitions/nonexistent')
//         .set('Authorization', 'Bearer valid-token')
//         .send({
//           name: 'Updated Name',
//         });

//       expect(response.status).toBe(404);
//     });
//   });

//   describe('DELETE /api/admin/field-definitions/:identifier', () => {
//     it('should delete a field definition', async () => {
//       const mockFieldDefinition = {
//         id: 1,
//         identifier: 'title',
//         destroy: jest.fn().mockResolvedValue(true),
//       };
      
//       mockedFieldDefinition.findOne.mockResolvedValue(mockFieldDefinition);

//       const response = await request(app)
//         .delete('/api/admin/field-definitions/title')
//         .set('Authorization', 'Bearer valid-token');

//       expect(response.status).toBe(204);
//       expect(mockFieldDefinition.destroy).toHaveBeenCalled();
//     });

//     it('should return 404 for non-existent field definition', async () => {
//       mockedFieldDefinition.findOne.mockResolvedValue(null);

//       const response = await request(app)
//         .delete('/api/admin/field-definitions/nonexistent')
//         .set('Authorization', 'Bearer valid-token');

//       expect(response.status).toBe(404);
//     });
//   });
// });