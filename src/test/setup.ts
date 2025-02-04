import { AppDataSource } from '../config/data-source';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

beforeAll(async () => {
  await AppDataSource.initialize();
  // Drop and recreate database schema
  await AppDataSource.synchronize(true);
});

afterAll(async () => {
  await AppDataSource.destroy();
});

afterEach(async () => {
  // Disable foreign key checks
  await AppDataSource.query('SET CONSTRAINTS ALL DEFERRED');
  
  const entities = AppDataSource.entityMetadatas;
  for (const entity of entities) {
    const repository = AppDataSource.getRepository(entity.name);
    await repository.clear();
  }
  
  // Re-enable foreign key checks
  await AppDataSource.query('SET CONSTRAINTS ALL IMMEDIATE');
});