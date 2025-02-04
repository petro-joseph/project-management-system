import { AppDataSource } from '../config/data-source';
import { User } from '../entities/user.entity';
import { CreateUserDto, LoginDto } from '../dtos/user.dto';
import { AppError } from '../middleware/error.middleware';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  /**
   * Register a new user
   * @param userData User registration data
   * @returns Created user object (without password)
   */
  async register(userData: CreateUserDto): Promise<Partial<User>> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new AppError('User already exists', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create new user
    const user = this.userRepository.create({
      ...userData,
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
  async login(loginData: LoginDto): Promise<{ token: string; user: Partial<User> }> {
    const user = await this.userRepository.findOne({
      where: { email: loginData.email },
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    const { password, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }
}