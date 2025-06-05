// tests/controllers/authController.test.ts
import request from 'supertest';
import app from '../../src/app';
import User from '../../src/models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock all dependencies before any imports
jest.mock('../../src/config/database', () => {
  const mockSequelize = {
    authenticate: jest.fn().mockResolvedValue(undefined),
    define: jest.fn().mockReturnValue({}),
    sync: jest.fn().mockResolvedValue(undefined),
    close: jest.fn().mockResolvedValue(undefined),
    transaction: jest.fn(),
  };
  return mockSequelize;
});

jest.mock('../../src/models/user');
jest.mock('../../src/models/role');
jest.mock('../../src/models/permission');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

// Type the mocked modules
const mockedUser = User as jest.Mocked<typeof User>;
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

// Create mock user data
const mockUserData = {
  id: 1,
  email: 'admin@cms.com',
  username: 'admin',
  password: '$2a$10$hashedPassword',
  roleId: 1,
  role: { id: 1, name: 'admin' },
  toJSON: jest.fn().mockReturnValue({
    id: 1,
    email: 'admin@cms.com',
    username: 'admin',
    role: { id: 1, name: 'admin' }
  })
};

describe('Admin Authentication', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mocks
    mockedUser.findOne = jest.fn();
    mockedUser.findByPk = jest.fn();
    mockedBcrypt.compare = jest.fn();
    mockedJwt.sign = jest.fn();
    mockedJwt.verify = jest.fn();
  });

  describe('POST /api/admin/auth/login', () => {
    it('should authenticate admin user with valid credentials', async () => {
      // Setup mocks for successful login
      mockedUser.findOne.mockResolvedValue(mockUserData as any);
      mockedBcrypt.compare.mockResolvedValue(true as never);
      mockedJwt.sign.mockReturnValue('mock-jwt-token' as never);

      const response = await request(app)
        .post('/api/admin/auth/login')
        .send({ 
          email: 'admin@cms.com', 
          password: 'adminPassword' 
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('token');
      expect(mockedUser.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { email: 'admin@cms.com' }
        })
      );
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        'adminPassword', 
        mockUserData.password
      );
    });

    it('should return 400 for invalid email', async () => {
      mockedUser.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/admin/auth/login')
        .send({ 
          email: 'wrong@email.com', 
          password: 'wrongpassword' 
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toHaveProperty('message', 'Invalid credentials');
    });

    it('should return 400 for invalid password', async () => {
      mockedUser.findOne.mockResolvedValue(mockUserData as any);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      const response = await request(app)
        .post('/api/admin/auth/login')
        .send({ 
          email: 'admin@cms.com', 
          password: 'wrongpassword' 
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toHaveProperty('message', 'Invalid credentials');
    });

    it('should return 400 for missing email', async () => {
      const response = await request(app)
        .post('/api/admin/auth/login')
        .send({ password: 'adminPassword' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });

    it('should return 400 for missing password', async () => {
      const response = await request(app)
        .post('/api/admin/auth/login')
        .send({ email: 'admin@cms.com' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });

    it('should return 400 for missing both email and password', async () => {
      const response = await request(app)
        .post('/api/admin/auth/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('GET /api/admin/auth/me', () => {
    it('should return current user with valid token', async () => {
      // Mock JWT verification to return user data
      mockedJwt.verify.mockReturnValue({ 
        id: 1, 
        email: 'admin@cms.com' 
      } as never);
      
      mockedUser.findByPk.mockResolvedValue(mockUserData as any);

      const response = await request(app)
        .get('/api/admin/auth/me')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
    });

    it('should return 401 without authorization header', async () => {
      const response = await request(app)
        .get('/api/admin/auth/me');

      expect(response.status).toBe(401);
    });

    it('should return 401 with invalid token format', async () => {
      const response = await request(app)
        .get('/api/admin/auth/me')
        .set('Authorization', 'InvalidFormat');

      expect(response.status).toBe(401);
    });

    it('should return 401 with invalid token', async () => {
      mockedJwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const response = await request(app)
        .get('/api/admin/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
    });

    it('should return 404 when user not found', async () => {
      mockedJwt.verify.mockReturnValue({ 
        id: 999, 
        email: 'nonexistent@cms.com' 
      } as never);
      
      mockedUser.findByPk.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/admin/auth/me')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toHaveProperty('message', 'User not found');
    });
  });
});






// // tests/controllers/authController.test.ts
// import request from 'supertest';
// import app from '../../src/app';
// import { User,Role ,Permission} from '../../src/models/associations';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import sequelize from '../config/database';

// jest.mock('../../src/models');
// jest.mock('bcryptjs');
// jest.mock('jsonwebtoken');
// jest.mock('../../src/models/user');
// jest.mock('../../src/models/role');
// jest.mock('../../src/models/permission');

// const mockedUser = User as jest.Mocked<typeof User>;
// mockedUser.findOne = jest.fn();
// mockedUser.findByPk = jest.fn();
// const mockedRole = Role as jest.Mocked<typeof Role>;
// const mockedPermission = Permission as jest.Mocked<typeof Permission>;
// const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
// const mockedJwt = jwt as jest.Mocked<typeof jwt>;
// const compareMock = bcrypt.compare as jest.Mock;

// const mockUser = {
//   id: 1,
//   email: 'admin@cms.com',
//   password: 'adminPassword',
//   toJSON: () => ({
//     id: 1,
//     email: 'admin@cms.com',
//     role: 'admin',
//   }),
// } as User;

// describe('Auth Controller', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('POST /api/admin/auth/login', () => {
//     it('should authenticate admin user with valid credentials', async () => {
//       mockedUser.findOne.mockResolvedValue(mockUser);
//       compareMock.mockResolvedValueOnce(true);
//       mockedJwt.sign.mockImplementation(() => 'mock-jwt-token');

//       const response = await request(app)
//         .post('/api/admin/auth/login')
//         .send({ email: 'admin@cms.com', password: 'adminPassword' });

//       expect(response.status).toBe(200);
//       expect(response.body).toHaveProperty('user');
//       expect(response.body.user).toHaveProperty('token', 'mock-jwt-token');
//       expect(mockedUser.findOne).toHaveBeenCalledWith({ where: { email: 'admin@cms.com' } });
//     });

//     it('should return 401 for invalid credentials', async () => {
//       mockedUser.findOne.mockResolvedValue(null);

//       const response = await request(app)
//         .post('/api/admin/auth/login')
//         .send({ email: 'invalid@cms.com', password: 'invalidPassword' });

//       expect(response.status).toBe(401);
//       expect(response.body).toHaveProperty('errors');
//     });

//     it('should return 401 for invalid password', async () => {
//       mockedUser.findOne.mockResolvedValue(mockUser);
//       compareMock.mockResolvedValueOnce(false);

//       const response = await request(app)
//         .post('/api/admin/auth/login')
//         .send({ email: 'admin@cms.com', password: 'invalidPassword' });

//       expect(response.status).toBe(401);
//       expect(response.body).toHaveProperty('errors');
//     });
//   });

//   describe('POST /api/admin/auth/logout', () => {
//     it('should logout admin user', async () => {
//       const response = await request(app)
//         .post('/api/admin/auth/logout')
//         .set('Authorization', 'Bearer mock-jwt-token');

//       expect(response.status).toBe(200);
//     });
//   });
// });