import request from 'supertest';
import app from '../../app';
import { createTestUser, generateTestToken } from '../helpers';
import { UserRole } from '../../entities/user.entity';

describe('User Management Endpoints', () => {
  let adminToken: string;
  let managerToken: string;
  let userToken: string;

  beforeEach(async () => {
    const admin = await createTestUser({
      email: 'admin@example.com',
      role: UserRole.ADMIN,
    });
    const manager = await createTestUser({
      email: 'manager@example.com',
      role: UserRole.MANAGER,
    });
    const user = await createTestUser({
      email: 'user@example.com',
      role: UserRole.USER,
    });

    adminToken = generateTestToken(admin);
    managerToken = generateTestToken(manager);
    userToken = generateTestToken(user);
  });

  describe('POST /api/users', () => {
    it('should allow admin to create user', async () => {
      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123',
          role: UserRole.USER,
        });

      expect(response.status).toBe(201);
      expect(response.body.data.user.email).toBe('newuser@example.com');
    });

    it('should not allow non-admin to create user', async () => {
      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${managerToken}`)
        .send({
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123',
          role: UserRole.USER,
        });

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/users', () => {
    it('should allow admin to get all users', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data.users)).toBe(true);
    });

    it('should allow manager to get all users', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${managerToken}`);

      expect(response.status).toBe(200);
    });

    it('should not allow regular user to get all users', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should allow admin to update user', async () => {
      const user = await createTestUser();

      const response = await request(app)
        .put(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated Name',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.user.name).toBe('Updated Name');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should allow admin to delete user', async () => {
      const user = await createTestUser();

      const response = await request(app)
        .delete(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(204);
    });
  });

  describe('POST /api/users/:id/role', () => {
    it('should allow admin to assign role', async () => {
      const user = await createTestUser();

      const response = await request(app)
        .post(`/api/users/${user.id}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          role: UserRole.MANAGER,
        });

      expect(response.status).toBe(200);
      expect(response.body.data.user.role).toBe(UserRole.MANAGER);
    });
  });
});