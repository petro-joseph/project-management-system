import request from 'supertest';
import app from '../../app';
import { createTestUser, createTestProject, createTestTask, generateTestToken } from '../helpers';
import { UserRole } from '../../entities/user.entity';
import { TaskStatus } from '../../entities/task.entity';

describe('Dashboard Integration Tests', () => {
  let adminToken: string;
  let manager: any;
  let user: any;
  let project: any;

  beforeEach(async () => {
    const admin = await createTestUser({
      role: UserRole.ADMIN,
      email: 'admin@example.com'
    });
    
    manager = await createTestUser({
      role: UserRole.MANAGER,
      email: 'manager@example.com'
    });
    
    user = await createTestUser({
      role: UserRole.USER,
      email: 'user@example.com'
    });
    
    adminToken = generateTestToken(admin);
    project = await createTestProject(manager);
    
    // Create tasks with different statuses
    await createTestTask(project, user, {
      status: TaskStatus.COMPLETED
    });
    
    await createTestTask(project, user, {
      status: TaskStatus.IN_PROGRESS
    });
    
    await createTestTask(project, user, {
      status: TaskStatus.PENDING
    });
  });

  describe('GET /api/dashboard/stats', () => {
    it('should get dashboard statistics', async () => {
      const response = await request(app)
        .get('/api/dashboard/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('projects');
      expect(response.body.data).toHaveProperty('tasks');
      expect(response.body.data).toHaveProperty('users');
      expect(response.body.data.tasks).toHaveProperty('total');
      expect(response.body.data.tasks).toHaveProperty('byStatus');
    });

    it('should require admin access', async () => {
      const userToken = generateTestToken(user);
      const response = await request(app)
        .get('/api/dashboard/stats')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/dashboard/progress', () => {
    it('should get project progress', async () => {
      const response = await request(app)
        .get('/api/dashboard/progress')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data[0]).toHaveProperty('totalTasks');
      expect(response.body.data[0]).toHaveProperty('completedTasks');
      expect(response.body.data[0]).toHaveProperty('progress');
    });
  });
});