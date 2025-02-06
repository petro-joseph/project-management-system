import { AppDataSource } from '../config/data-source';

async function setupTestDatabase() {
  try {
    await AppDataSource.initialize();
    await AppDataSource.synchronize(true); // Drop and recreate schema
    await AppDataSource.destroy();
    console.log('Test database setup completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up test database:', error);
    process.exit(1);
  }
}

setupTestDatabase();