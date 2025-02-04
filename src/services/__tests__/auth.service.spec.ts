// src/services/__tests__/auth.service.spec.ts
import { AuthService } from '../auth.service';
import { AppDataSource } from '../../config/data-source';
import { User, UserRole } from '../../entities/user.entity';
import { AppError } from '../../middleware/error.middleware';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  describe('register', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: UserRole.USER,
      };

      const result = await authService.register(userData);

      expect(result).toHaveProperty('id');
      expect(result.email).toBe(userData.email);
      expect(result).not.toHaveProperty('password');
    });

    it('should throw error if user already exists', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: UserRole.USER,
      };

      await authService.register(userData);

      await expect(authService.register(userData)).rejects.toThrow(AppError);
    });
  });

  describe('login', () => {
    it('should return token and user data for valid credentials', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: UserRole.USER,
      };

      await authService.register(userData);

      const result = await authService.login({
        email: userData.email,
        password: userData.password,
      });

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe(userData.email);
    });

    it('should throw error for invalid credentials', async () => {
      await expect(
        authService.login({
          email: 'wrong@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow(AppError);
    });
  });
});