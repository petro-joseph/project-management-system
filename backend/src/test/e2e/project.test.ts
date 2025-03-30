import request from 'supertest';
import app from '../../app';
import { createTestUser, generateTestToken } from '../helpers';
import { UserRole } from '../../entities/user.entity';
import { TaskStatus } from '../../entities/task.entity';

describe('Project Management E2E Tests', () => {
  let managerToken: string;
  let userToken: string;
  let manager: any;
  let user: any;
  let projectId: string;
  let taskId: string;

  beforeAll(async () => {
    // Create test users
    manager = await createTestUser({
      role: UserRole.MANAGER,
      email: 'manager@example.com'
    });
    
    user = await createTestUser({
      role: UserRole.USER,
      email: 'user@example.com'
    });
    
    managerToken = generateTestToken(manager);
    userToken = generateTestToken(user);
  });

  describe('Complete Project Lifecycle', () => {
    it('should create a new project', async () => {
      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${managerToken}`)
        .send({
          name: 'E2E Test Project',
          description: 'Project for E2E testing',
          start_date: new Date(),
          end_date: new Date(Date.now() + 86400000)
        });

      expect(response.status).toBe(201);
      projectId = response.body.data.project.id;
    });

    it('should create a task in the project', async () => {
      const response = await request(app)
        .post(`/api/projects/${projectId}/tasks`)
        .set('Authorization', `Bearer ${managerToken}`)
        .send({
          name: 'E2E Test Task',
          description: 'Task for E2E testing',
          assigneeId: user.id
        });

      expect(response.status).toBe(201);
      taskId = response.body.data.task.id;
    });

    it('should update task status', async () => {
      const response = await request(app)
        .patch(`/api/tasks/${taskId}/status`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          status: TaskStatus.IN_PROGRESS
        });

      expect(response.status).toBe(200);
      expect(response.body.data.task.status).toBe(TaskStatus.IN_PROGRESS);
    });

    it('should complete the task', async () => {
      const response = await request(app)
        .patch(`/api/tasks/${taskId}/status`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          status: TaskStatus.COMPLETED
        });

      expect(response.status).toBe(200);
      expect(response.body.data.task.status).toBe(TaskStatus.COMPLETED);
    });

    it('should verify project progress', async () => {
      const response = await request(app)
        .get('/api/dashboard/progress')
        .set('Authorization', `Bearer ${managerToken}`);

      expect(response.status).toBe(200);
      const project = response.body.data.find((p: any) => p.id === projectId);
      expect(project.completedTasks).toBe(1);
    });

    it('should delete the project', async () => {
      const response = await request(app)
        .delete(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${managerToken}`);

      expect(response.status).toBe(204);
    });
  });
});