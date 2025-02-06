import { AuthService } from '../../../services/auth.service';
import { createMockRepositories, mockUser } from '../mock-helper';
import { AppError } from '../../../middleware/error.middleware';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../../../entities/user.entity';

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  const { userRepository } = createMockRepositories();

  beforeEach(() => {
    authService = new AuthService();
    (authService as any).userRepository = userRepository;
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const userData = {
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
        role: UserRole.USER
      };

      userRepository.findOne.mockResolvedValue(null);
      userRepository.create.mockReturnValue({ ...mockUser, ...userData });
      userRepository.save.mockResolvedValue({ ...mockUser, ...userData });
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      const result = await authService.register(userData);

      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe(userData.email);
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('should throw error if user exists', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);

      await expect(authService.register({
        name: 'Test',
        email: mockUser.email,
        password: 'password',
        role: UserRole.USER
      })).rejects.toThrow(AppError);
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.login(
        mockUser.email,
        'password123'
      );

      expect(result).toHaveProperty('token');
      expect(result.user).not.toHaveProperty('password');
    });

    it('should throw error for invalid credentials', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(
        mockUser.email,
        'wrongpassword'
      )).rejects.toThrow(AppError);
    });
  });
});