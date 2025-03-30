import request from 'supertest';
import app from '../../app';
import { createTestUser, createTestProject, createTestTask, generateTestToken } from '../helpers';
import { UserRole } from '../../entities/user.entity';

describe('Search Integration Tests', () => {
  let userToken: string;
  let manager: any;
  let user: any;
  let project: any;

  beforeEach(async () => {
    manager = await createTestUser({
      role: UserRole.MANAGER,
      email: 'manager@example.com'
    });
    
    user = await createTestUser({
      role: UserRole.USER,
      email: 'user@example.com'
    });
    
    userToken = generateTestToken(user);
    project = await createTestProject(manager);
    
    // Create some test tasks
    await createTestTask(project, user, {
      name: 'Important task',
      description: 'High priority task'
    });
    
    await createTestTask(project, user, {
      name: 'Regular task',
      description: 'Normal priority task'
    });
  });

  describe('GET /api/search/tasks', () => {
    it('should search tasks by query', async () => {
      const response = await request(app)
        .get('/api/search/tasks?q=Important')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.tasks).toHaveLength(1);
      expect(response.body.data.tasks[0].name).toContain('Important');
    });

    it('should handle pagination', async () => {
      const response = await request(app)
        .get('/api/search/tasks?q=task&page=1&limit=1')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.tasks).toHaveLength(1);
      expect(response.body.data).toHaveProperty('total');
      expect(response.body.data).toHaveProperty('page');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/search/tasks?q=Important');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/search/projects', () => {
    it('should search projects by query', async () => {
      const response = await request(app)
        .get('/api/search/projects?q=Test')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.projects).toHaveLength(1);
      expect(response.body.data.projects[0].name).toContain('Test');
    });

    it('should handle pagination', async () => {
      const response = await request(app)
        .get('/api/search/projects?q=Test&page=1&limit=1')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.projects).toHaveLength(1);
      expect(response.body.data).toHaveProperty('total');
    });
  });
});