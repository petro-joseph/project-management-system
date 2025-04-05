import { AppDataSource } from '../src/config/data-source';
import { User } from '../src/entities/user.entity';
import { Project } from '../src/entities/project.entity';
import { Task } from '../src/entities/task.entity';
import { InventoryItem } from '../src/entities/inventory-item.entity';
import { FixedAsset } from '../src/entities/fixed-asset.entity';
import { AssetCategory } from '../src/entities/asset-category.entity';

// Import mock data
import * as mockData from '../../frontend/src/lib/mockData';
import * as mockFixedAssets from '../../frontend/src/lib/mockFixedAssets';

async function seed() {
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User);
  const projectRepo = AppDataSource.getRepository(Project);
  const taskRepo = AppDataSource.getRepository(Task);
  const inventoryRepo = AppDataSource.getRepository(InventoryItem);
  const assetRepo = AppDataSource.getRepository(FixedAsset);
  const categoryRepo = AppDataSource.getRepository(AssetCategory);

  // Seed Users
  const userIdMap = new Map<number, string>();

  function transformUser(u: any) {
    const { id, role, ...rest } = u;
    return {
      ...rest,
      role: role === 'admin' ? 'admin' : role === 'manager' ? 'manager' : 'user',
    };
  }

  function transformProject(p: any) {
    const { id, managerId, budget, spent, ...rest } = p;
    return {
      ...rest,
      managerId: userIdMap.get(managerId),
      budget: typeof budget === 'number' ? budget : undefined,
      spent: typeof spent === 'number' ? spent : undefined,
    };
  }

  function transformTask(t: any) {
    const { id, projectId, assignedTo, createdBy, status, ...rest } = t;
    return {
      ...rest,
      projectId: projectIdMap.get(projectId),
      assigneeId: userIdMap.get(assignedTo),
      createdBy: userIdMap.get(createdBy),
      status: typeof status === 'string' ? status : undefined,
    };
  }

  function transformInventory(i: any) {
    const { id, location, supplier, ...rest } = i;
    return {
      ...rest,
      location: undefined,
      supplier: undefined,
    };
  }

  // Seed Users
  for (const u of mockData.users) {
    const user = userRepo.create(transformUser(u));
    const saved = await userRepo.save(user) as any as User;
    userIdMap.set(u.id, saved.id);
  }

  // Seed Projects
  const projectIdMap = new Map<number, string>();
  for (const p of mockData.projects) {
    const project = projectRepo.create(transformProject(p));
    const saved = await projectRepo.save(project) as any as Project;
    projectIdMap.set(p.id, saved.id);
  }

  // Seed Tasks
  for (const t of mockData.tasks) {
    const task = taskRepo.create(transformTask(t));
    await taskRepo.save(task);
  }

  // Seed Inventory Items
  for (const i of mockData.getInventoryItems() || []) {
    const item = inventoryRepo.create(transformInventory(i));
    await inventoryRepo.save(item);
  }

  // Seed Asset Categories
  for (const c of mockFixedAssets.assetCategories || []) {
    await categoryRepo.save(categoryRepo.create(c));
  }

  // Seed Fixed Assets
  for (const a of mockFixedAssets.fixedAssets || []) {
    await assetRepo.save(assetRepo.create(a));
  }

  console.log('Mock data seeded successfully.');
  process.exit(0);
}

seed().catch(err => {
  console.error('Error seeding mock data:', err);
  process.exit(1);
});