// Jest setup file for unit tests
import 'reflect-metadata';

// Mock TypeORM
const mockRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  count: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    addGroupBy: jest.fn().mockReturnThis(),
    setParameter: jest.fn().mockReturnThis(),
    setParameters: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
    getMany: jest.fn(),
    getRawOne: jest.fn(),
    getRawMany: jest.fn(),
  })),
};

jest.mock('typeorm', () => {
  const originalModule = jest.requireActual('typeorm');
  return {
    ...originalModule,
    getRepository: jest.fn(() => mockRepository),
    createConnection: jest.fn(),
    getConnection: jest.fn(),
    DataSource: jest.fn().mockImplementation(() => ({
      initialize: jest.fn().mockResolvedValue({}),
      destroy: jest.fn().mockResolvedValue({}),
      getRepository: jest.fn(() => mockRepository),
      manager: {
        transaction: jest.fn(),
      },
      query: jest.fn(),
    })),
  };
});

// Mock AppDataSource
jest.mock('../../config/data-source', () => ({
  AppDataSource: {
    getRepository: jest.fn(() => mockRepository),
    initialize: jest.fn().mockResolvedValue({}),
    destroy: jest.fn().mockResolvedValue({}),
    manager: {
      transaction: jest.fn(),
    },
    query: jest.fn(),
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

beforeAll(() => {
  // Add any unit test setup here
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-secret';
});

afterAll(() => {
  // Add any unit test cleanup here
});
