// tests/setup.ts
import dotenv from "dotenv";

// Load test environment variables
dotenv.config({ path: ".env.test" });

// Set test environment
process.env.NODE_ENV = "test";

// Mock Sequelize and database connection before any model imports
jest.mock("sequelize", () => {
  const actualSequelize = jest.requireActual("sequelize");
  
  
  // Create a proper mock sequelize instance
  const mockSequelizeInstance = {
    authenticate: jest.fn().mockResolvedValue(undefined),
    define: jest.fn().mockReturnValue({
      hasMany: jest.fn(),
      belongsTo: jest.fn(),
      belongsToMany: jest.fn(),
      addHook: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
      sync: jest.fn().mockResolvedValue(undefined),
    }),
    sync: jest.fn().mockResolvedValue(undefined),
    close: jest.fn().mockResolvedValue(undefined),
    transaction: jest.fn().mockImplementation((callback) => {
      const mockTransaction = { commit: jest.fn(), rollback: jest.fn() };
      return callback ? callback(mockTransaction) : Promise.resolve(mockTransaction);
    }),
    query: jest.fn().mockResolvedValue([]),
    QueryTypes: actualSequelize.QueryTypes,
  };

  return {
    Sequelize: jest.fn().mockImplementation(() => mockSequelizeInstance),
    DataTypes: actualSequelize.DataTypes,
    Model: actualSequelize.Model,
    Op: actualSequelize.Op,
  };
});

// Mock the database configuration
jest.mock("../../src/config/database", () => {
  const { Sequelize } = require("sequelize");
  const mockSequelize = new Sequelize();
  return mockSequelize;
});

// Global test timeout
jest.setTimeout(10000);

// Console log to confirm setup is loaded
console.log('✅ Test setup loaded successfully');

// Export common test utilities if needed
export const createMockUser = (overrides = {}) => ({
  id: 1,
  email: 'test@example.com',
  username: 'testuser',
  password: '$2a$10$hashedPassword',
  roleId: 1,
  toJSON: jest.fn().mockReturnValue({
    id: 1,
    email: 'test@example.com',
    username: 'testuser',
    role: { id: 1, name: 'user' }
  }),
  ...overrides
});

export const createMockRole = (overrides = {}) => ({
  id: 1,
  name: 'admin',
  permissions: [],
  ...overrides
});

// Clean up function for after each test
export const cleanupMocks = () => {
  jest.clearAllMocks();
};