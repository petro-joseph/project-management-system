import request from 'supertest';
import app from '../../app';
import { createTestUser, generateTestToken, createTestProject, createTestTask } from '../helpers';
import { UserRole } from '../../entities/user.entity';

describe('Search Routes', () => {
  let userToken: string;
  let adminToken: string;
  let user: any;
  let admin: any;

  beforeEach(async () => {
    user = await createTestUser({
      role: UserRole.USER,
      email: 'user@example.com',
    });
    admin = await createTestUser({
      role: UserRole.ADMIN,
      email: 'admin@example.com',
    });
    userToken = generateTestToken(user);
    adminToken = generateTestToken(admin);
  });

  describe('GET /api/search/tasks', () => {
    it('should search tasks', async () => {
      const project = await createTestProject(admin);
      await createTestTask(project, user, { name: 'Important task' });

      const response = await request(app)
        .get('/api/search/tasks?q=important')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.tasks).toHaveLength(1);
      expect(response.body.data.tasks[0].name).toContain('Important');
    });

    it('should return error without search query', async () => {
      const response = await request(app)
        .get('/api/search/tasks')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/search/projects', () => {
    it('should search projects', async () => {
      await createTestProject(admin, { name: 'Website Project' });

      const response = await request(app)
        .get('/api/search/projects?q=website')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.projects).toHaveLength(1);
      expect(response.body.data.projects[0].name).toContain('Website');
    });
  });

  describe('GET /api/search/users', () => {
    it('should allow admin to search users', async () => {
      const response = await request(app)
        .get('/api/search/users?q=user')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.users).toHaveLength(1);
    });

    it('should not allow regular users to search users', async () => {
      const response = await request(app)
        .get('/api/search/users?q=user')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });
  });
});