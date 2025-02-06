// Jest setup file for integration tests
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../config/data-source';

let connection: DataSource;

beforeAll(async () => {
  try {
    // Initialize connection
    connection = await AppDataSource.initialize();
    
    // Drop and recreate schema
    await connection.query('DROP SCHEMA public CASCADE');
    await connection.query('CREATE SCHEMA public');
    await connection.query('GRANT ALL ON SCHEMA public TO public');
    
    // Enable uuid-ossp extension
    await connection.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    
    // Create tables
    await connection.synchronize(true);
  } catch (error) {
    console.error('Test database connection error:', error);
    throw error;
  }
});

beforeEach(async () => {
  // Clear all tables before each test
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
  // Close database connection
  if (connection && connection.isInitialized) {
    await connection.destroy();
  }
});
