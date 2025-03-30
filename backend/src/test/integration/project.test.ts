import request from 'supertest';
import app from '../../app';
import { createTestUser, createTestProject, generateTestToken } from '../helpers';
import { UserRole } from '../../entities/user.entity';

describe('Project Endpoints', () => {
  let managerToken: string;
  let manager: any;

  beforeEach(async () => {
    manager = await createTestUser({
      role: UserRole.MANAGER,
      email: 'manager@example.com',
    });
    managerToken = generateTestToken(manager);
  });

  describe('POST /api/projects', () => {
    it('should create a new project', async () => {
      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${managerToken}`)
        .send({
          name: 'New Project',
          description: 'Project Description',
          start_date: '2023-01-01T00:00:00.000Z',
          end_date: '2023-12-31T00:00:00.000Z',
        });

      expect(response.status).toBe(201);
      expect(response.body.data.project.name).toBe('New Project');
    });
  });

  describe('GET /api/projects', () => {
    it('should get all projects', async () => {
      await createTestProject(manager);

      const response = await request(app)
        .get('/api/projects')
        .set('Authorization', `Bearer ${managerToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data.projects)).toBe(true);
    });
  });

  // Add more project tests...
});