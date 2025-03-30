import { AppDataSource } from '../config/data-source';
import { User } from '../entities/user.entity';
import { CreateUserDto, LoginDto } from '../dtos/user.dto';
import { BadRequestError, UnauthorizedError } from '../middleware/error.middleware';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken, verifyToken } from '../utils/token';
import { cacheService } from '../config/redis.config';

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  /**
   * Register a new user
   * @param userData User registration data
   * @returns Created user object (without password)
   */
  async register(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestError('User already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(createUserDto.password);

    // Create new user
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    // Remove password from response
    const { password, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  /**
   * Authenticate user and generate JWT token
   * @param loginData User login credentials
   * @returns JWT token and user data
   */
  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Generate JWT token
    const token = generateToken(user);

    const { password: _, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }

  /**
   * Logs out a user by invalidating their token.
   * @param token - The JWT token to be invalidated.
   * @returns A Promise that resolves when the token has been added to the blacklist.
   */
  async logout(token: string): Promise<void> {
    try {
      // Verify the token first
      const decoded = verifyToken(token);
      const expirationTime = decoded.exp! - Math.floor(Date.now() / 1000);

      if (expirationTime > 0) {
        // Add token to blacklist with the remaining time
        await cacheService.addToBlacklist(token, expirationTime);
      }
    } catch (error) {
      throw new UnauthorizedError('Invalid token');
    }
  }
}