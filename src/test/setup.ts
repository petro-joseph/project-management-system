import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../config/data-source';

let connection: DataSource;

beforeAll(async () => {
  try {
    // Set test environment
    process.env.NODE_ENV = 'test';
    process.env.PORT = '3001';

    // Initialize connection
    connection = await AppDataSource.initialize();

    // Drop and recreate schema
    await connection.query('DROP SCHEMA IF EXISTS public CASCADE');
    await connection.query('CREATE SCHEMA public');
    await connection.query('GRANT ALL ON SCHEMA public TO public');
    
    // Enable uuid-ossp extension
    await connection.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    
    // Create tables
    await connection.synchronize(true);
  } catch (error) {
    console.error('Test setup error:', error);
    throw error;
  }
});

beforeEach(async () => {
  if (connection && connection.isInitialized) {
    const entities = connection.entityMetadatas;
    // Clear tables in reverse order to handle foreign key constraints
    for (const entity of entities.reverse()) {
      const repository = connection.getRepository(entity.name);
      await repository.query(`TRUNCATE TABLE "${entity.tableName}" CASCADE`);
    }
  }
});

afterAll(async () => {
  if (connection && connection.isInitialized) {
    await connection.destroy();
  }
});