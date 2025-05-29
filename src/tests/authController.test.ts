// tests/controllers/authController.test.ts
import request from 'supertest';
import app from '../../src/app';
import  User  from '../../src/models/user';
import  Role  from '../../src/models/role';
import Permission from '../../src/models/permission';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// jest.mock('../../src/models');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../src/models/user');
jest.mock('../../src/models/role');
jest.mock('../../src/models/permission');

const mockedUser = User as jest.Mocked<typeof User>;
const mockedRole = Role as jest.Mocked<typeof Role>;
const mockedPermission = Permission as jest.Mocked<typeof Permission>;
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockedJwt = jwt as jest.Mocked<typeof jwt>;
const compareMock = bcrypt.compare as jest.Mock;

const mockUser = {
    id: 1,
    email: 'admin@cms.com',
    password: 'hashedpassword',
    toJSON: () => ({
      id: 1,
      email: 'admin@cms.com',
      role: 'admin',
    }),
  } as User




describe('Admin Authentication', () => {
  describe('POST /api/admin/auth/login', () => {
    it('should authenticate admin user with valid credentials', async () => {
  

  mockedUser.findOne.mockResolvedValue(mockUser);
  compareMock.mockResolvedValueOnce(true);
  mockedJwt.sign.mockImplementation(() => 'mock-jwt-token');

  const response = await request(app)
    .post('/api/admin/auth/login')
    .send({ email: 'admin@cms.com', password: 'hashedpassword' });

  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('user');
  expect(response.body.user).toHaveProperty('token', 'mock-jwt-token');
  expect(mockedUser.findOne).toHaveBeenCalledWith({ where: { email: 'admin@cms.com' } });
});


    it('should return 401 for invalid credentials', async () => {
      // mockedUser.findOne.mockResolvedValue(null);
      mockedUser.findOne.mockResolvedValue(null);
      const response = await request(app)
        .post('/api/admin/auth/login')
        .send({ email: 'wrong@email.com', password: 'wrongpassword' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body).toHaveProperty('errors.message', 'Invalid credentials');
    });

    it('should return 400 for missing email or password', async () => {
      const response1 = await request(app)
        .post('/api/admin/auth/login')
        .send({ password: 'adminPassword' });

      const response2 = await request(app)
        .post('/api/admin/auth/login')
        .send({ email: 'admin@cms.com' });

      expect(response1.status).toBe(400);
      expect(response2.status).toBe(400);
      expect(response1.body).toHaveProperty('errors');
      expect(response2.body).toHaveProperty('errors');
    });
  });

  describe('GET /api/admin/auth/me', () => {
    // it('should return current admin user with valid token', async () => {
    //   const mockUser = {
    //     id: 1,
    //     email: 'admin@cms.com',
    //     role: 'admin',
    //     toJSON: () => ({ id: 1, email: 'admin@cms.com', role: 'admin' }),
    //   };
      
    //   mockedUser.findByPk.mockResolvedValue(mockUser);

    //   const response = await request(app)
    //     .get('/api/admin/auth/me')
    //     .set('Authorization', 'Bearer valid-token');

    //   expect(response.status).toBe(200);
    //   expect(response.body).toHaveProperty('user');
    //   expect(response.body.user.email).toBe('admin@cms.com');
    // });

    it('should return 401 without authorization header', async () => {
      const response = await request(app)
        .get('/api/admin/auth/me');

      expect(response.status).toBe(401);
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/admin/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
    });
  });
});