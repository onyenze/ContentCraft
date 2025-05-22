// tests/setup.ts
import { config } from 'dotenv';
import { Sequelize } from 'sequelize';
import { mocked } from 'jest-mock';

config({ path: '.env.test' });

jest.mock('../src/config/database', () => ({
  sequelize: new Sequelize('sqlite::memory:', { logging: false }),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mock-jwt-token'),
  verify: jest.fn((token, secret, callback) => {
    if (token === 'valid-token') {
      callback(null, { id: 1, role: 'admin' });
    } else {
      callback(new Error('Invalid token'), null);
    }
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();
});