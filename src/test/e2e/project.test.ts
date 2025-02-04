// src/test/e2e/project.test.ts
import request from 'supertest';
import app from '../../app';
import {
  createTestUser,
  generateTestToken,
  createTestProject,
} from '../helpers';
import { UserRole } from '../../entities/user.entity';

describe('Project Management E2E', () => {
  let managerToken: string;
  let manager: any;

  beforeEach(async () => {
    manager = await createTestUser({
      role: UserRole.MANAGER,
      email: 'manager@example.com',
    });
    managerToken = generateTestToken(manager);
  });

  describe('Project CRUD Operations', () => {
    it('should create a new project', async () => {
      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${managerToken}`)
        .send({
          name: 'New Project',
          description: 'Project Description',
          start_date: new Date(),
          end_date: new Date(Date.now() + 86400000),
        });

      expect(response.status).toBe(201);
      expect(response.body.data.project).toHaveProperty('id');
      expect(response.body.data.project.name).toBe('New Project');
    });

    it('should get all projects', async () => {
      const project = await createTestProject(manager);

      const response = await request(app)
        .get('/api/projects')
        .set('Authorization', `Bearer ${managerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.projects).toHaveLength(1);
      expect(response.body.data.projects[0].id).toBe(project.id);
    });

    it('should update a project', async () => {
      const project = await createTestProject(manager);

      const response = await request(app)
        .put(`/api/projects/${project.id}`)
        .set('Authorization', `Bearer ${managerToken}`)
        .send({
          name: 'Updated Project',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.project.name).toBe('Updated Project');
    });

    it('should delete a project', async () => {
      const project = await createTestProject(manager);

      const response = await request(app)
        .delete(`/api/projects/${project.id}`)
        .set('Authorization', `Bearer ${managerToken}`);

      expect(response.status).toBe(204);
    });
  });
});