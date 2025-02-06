// Jest setup file for e2e tests
import { Server } from 'http';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../config/data-source';
import { setup } from '../../server';

let connection: DataSource;
let server: Server;

beforeAll(async () => {
  try {
    // Set test environment
    process.env.NODE_ENV = 'test';
    process.env.PORT = '3002'; // Use a different port for e2e tests

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

    // Start server
    server = await setup();
  } catch (error) {
    console.error('E2E test setup error:', error);
    throw error;
  }
}, 30000); // Increase timeout for database setup

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
  if (server) {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  }
  if (connection && connection.isInitialized) {
    await connection.destroy();
  }
});
