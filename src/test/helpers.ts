import { AppDataSource } from '../config/data-source';
import { User, UserRole } from '../entities/user.entity';
import { Project } from '../entities/project.entity';
import { Task, TaskStatus } from '../entities/task.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export const createTestUser = async (
  overrides: Partial<User> = {}
): Promise<User> => {
  const userRepository = AppDataSource.getRepository(User);
  const password = await bcrypt.hash('password123', 10);

  const user = userRepository.create({
    name: 'Test User',
    email: 'test@example.com',
    password,
    role: UserRole.USER,
    ...overrides,
  });

  return await userRepository.save(user);
};

export const generateTestToken = (user: User): string => {
  return jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );
};

export const createTestProject = async (
  manager: User,
  overrides: Partial<Project> = {}
): Promise<Project> => {
  const projectRepository = AppDataSource.getRepository(Project);

  const project = projectRepository.create({
    name: 'Test Project',
    description: 'Test Description',
    managerId: manager.id,
    start_date: new Date(),
    end_date: new Date(Date.now() + 86400000), // Tomorrow
    ...overrides,
  });

  return await projectRepository.save(project);
};

export const createTestTask = async (
  project: Project,
  assignee: User,
  overrides: Partial<Task> = {}
): Promise<Task> => {
  const taskRepository = AppDataSource.getRepository(Task);

  const task = taskRepository.create({
    name: 'Test Task',
    description: 'Test Description',
    projectId: project.id,
    assigneeId: assignee.id,
    status: TaskStatus.PENDING,
    ...overrides,
  });

  return await taskRepository.save(task);
};