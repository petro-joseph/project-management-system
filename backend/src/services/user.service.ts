import { AppDataSource } from '../config/data-source';
import { User, UserRole } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { AppError } from '../middleware/error.middleware';
import * as bcrypt from 'bcrypt';

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  /**
   * Create new user (Admin only)
   */
  async createUser(userData: CreateUserDto): Promise<Partial<User>> {
    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new AppError('User already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    await this.userRepository.save(user);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Get all users (Admin/Manager only)
   */
  async getAllUsers(page: number = 1, limit: number = 10): Promise<{
    users: Partial<User>[];
    total: number;
  }> {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
    });

    const usersWithoutPassword = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return { users: usersWithoutPassword, total };
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Update user (Admin only)
   */
  async updateUser(id: string, updateData: UpdateUserDto): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateData.email },
      });

      if (existingUser) {
        throw new AppError('Email already in use', 400);
      }
    }

    Object.assign(user, updateData);
    await this.userRepository.save(user);

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Delete user (Admin only)
   */
  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.role === UserRole.ADMIN) {
      throw new AppError('Cannot delete admin user', 403);
    }

    await this.userRepository.remove(user);
  }

  /**
   * Assign role to user (Admin only)
   */
  async assignRole(id: string, role: UserRole): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    user.role = role;
    await this.userRepository.save(user);

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}