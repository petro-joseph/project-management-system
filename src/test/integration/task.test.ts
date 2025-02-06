import request from 'supertest';
import app from '../../app';
import {
  createTestUser,
  createTestProject,
  createTestTask,
  generateTestToken,
} from '../helpers';
import { UserRole } from '../../entities/user.entity';
import { TaskStatus } from '../../entities/task.entity';

describe('Task Endpoints', () => {
  let managerToken: string;
  let manager: any;
  let project: any;
  let user: any;

  beforeEach(async () => {
    manager = await createTestUser({
      role: UserRole.MANAGER,
      email: 'manager@example.com',
    });
    user = await createTestUser({
      role: UserRole.USER,
      email: 'user@example.com',
    });
    managerToken = generateTestToken(manager);
    project = await createTestProject(manager);
  });

  describe('POST /api/projects/:projectId/tasks', () => {
    it('should create a new task', async () => {
      const response = await request(app)
        .post(`/api/projects/${project.id}/tasks`)
        .set('Authorization', `Bearer ${managerToken}`)
        .send({
          name: 'New Task',
          description: 'Task Description',
          assigneeId: user.id,
        });

      expect(response.status).toBe(201);
      expect(response.body.data.task.name).toBe('New Task');
    });
  });

  // Add more task tests...
});