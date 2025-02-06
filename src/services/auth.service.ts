import { AppDataSource } from '../config/data-source';
import { User } from '../entities/user.entity';
import { CreateUserDto, LoginDto } from '../dtos/user.dto';
import { AppError } from '../middleware/error.middleware';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { redisService } from './redis.service';

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
      throw new AppError('User already exists', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create new user
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
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
      throw new AppError('Invalid credentials', 401);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }

  /**
   * Logout user by invalidating their token
   */
  async logout(token: string): Promise<void> {
    try {
      // Verify the token first
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        exp: number;
      };

      // Calculate remaining time until token expiration
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const expirationTime = decoded.exp - currentTimestamp;

      if (expirationTime > 0) {
        // Add token to blacklist with the remaining time
        await redisService.addToBlacklist(token, expirationTime);
      }
    } catch (error) {
      throw new AppError('Invalid token', 401);
    }
  }
}