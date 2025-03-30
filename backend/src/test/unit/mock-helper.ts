import { Repository } from 'typeorm';
import { mock } from 'jest-mock-extended';
import { User, UserRole } from '../../entities/user.entity';
import { Project } from '../../entities/project.entity';
import { Task, TaskStatus } from '../../entities/task.entity';

export const mockUser: User = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashedPassword',
  role: UserRole.USER,
  created_at: new Date(),
  updated_at: new Date(),
  managedProjects: [],
  assignedTasks: []
};

export const mockProject: Project = {
  id: '1',
  name: 'Test Project',
  description: 'Test Description',
  managerId: mockUser.id,
  manager: mockUser,
  tasks: [],
  start_date: new Date(),
  end_date: new Date(),
  created_at: new Date(),
  updated_at: new Date()
};

export const mockTask: Task = {
  id: '1',
  name: 'Test Task',
  description: 'Test Description',
  projectId: mockProject.id,
  project: mockProject,
  assigneeId: mockUser.id,
  assignee: mockUser,
  status: TaskStatus.PENDING,
  created_at: new Date(),
  updated_at: new Date()
};

export const createMockRepositories = () => ({
  userRepository: mock<Repository<User>>(),
  projectRepository: mock<Repository<Project>>(),
  taskRepository: mock<Repository<Task>>()
});