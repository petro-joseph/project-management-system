import { DataSource } from 'typeorm';
import { AppDataSource } from '../config/data-source';

export async function setupTestDb() {
  let connection: DataSource | undefined;

  try {
    // Initialize connection
    connection = await AppDataSource.initialize();
    
    // Drop and recreate schema
    await connection.query('DROP SCHEMA IF EXISTS public CASCADE');
    await connection.query('CREATE SCHEMA public');
    await connection.query('GRANT ALL ON SCHEMA public TO public');
    
    // Enable uuid-ossp extension
    await connection.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    
    // Synchronize database schema
    await connection.synchronize(true);
    
    // Seed test data if needed
    // await seedTestData();
  } catch (error) {
    console.error('Test database connection error:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.destroy();
    }
  }
}

// Execute setup if this file is run directly
if (require.main === module) {
  setupTestDb().catch(console.error);
}