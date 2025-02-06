import { AuthService } from '../../../services/auth.service';
import { AppDataSource } from '../../../config/data-source';
import { User } from '../../../entities/user.entity';
import { hashPassword } from '../../../utils/password';
import { BadRequestError } from '../../../errors/bad-request-error';
import { UnauthorizedError } from '../../../errors/unauthorized-error';
import { UserRole } from '../../../entities/user.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserRepository: any;

  beforeEach(() => {
    mockUserRepository = AppDataSource.getRepository(User);
    authService = new AuthService();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        role: UserRole.USER
      };

      const hashedPassword = await hashPassword(userData.password);
      const savedUser = { ...userData, id: 1, password: hashedPassword };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(userData);
      mockUserRepository.save.mockResolvedValue(savedUser);

      const result = await authService.register(userData);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: userData.email },
      });
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining({
        id: expect.any(Number),
        email: userData.email,
        name: userData.name,
      }));
    });

    it('should throw error if user exists', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        role: UserRole.USER
      };

      mockUserRepository.findOne.mockResolvedValue({ id: 1, ...userData });

      await expect(authService.register(userData)).rejects.toThrow(BadRequestError);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: userData.email },
      });
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      const hashedPassword = await hashPassword(password);
      const user = {
        id: 1,
        email,
        password: hashedPassword,
        name: 'Test User',
        role: UserRole.USER
      };

      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await authService.login(email, password);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toEqual(expect.objectContaining({
        token: expect.any(String),
        user: expect.objectContaining({
          id: user.id,
          email: user.email,
          name: user.name,
        }),
      }));
    });

    it('should throw error for invalid credentials', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(authService.login(email, password)).rejects.toThrow(UnauthorizedError);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
    });
  });
});