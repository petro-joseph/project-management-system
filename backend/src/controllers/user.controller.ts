import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { CreateUserDto, UpdateUserDto, AssignRoleDto } from '../dtos/user.dto';
import { validate } from 'class-validator';
import { AppError } from '../middleware/error.middleware';

export class UserController {
  private userService = new UserService();

  /**
   * Create new user (Admin only)
   */
  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createUserDto = new CreateUserDto();
      Object.assign(createUserDto, req.body);

      const errors = await validate(createUserDto);
      if (errors.length > 0) {
        throw new AppError('Validation error'+errors, 400);
      }

      const user = await this.userService.createUser(createUserDto);
      res.status(201).json({
        status: 'success',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all users (Admin/Manager only)
   */
  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.userService.getAllUsers(page, limit);
      res.json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get user by ID
   */
  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.getUserById(req.params.id);
      res.json({
        status: 'success',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update user (Admin only)
   */
  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updateUserDto = new UpdateUserDto();
      Object.assign(updateUserDto, req.body);

      const errors = await validate(updateUserDto);
      if (errors.length > 0) {
            throw new AppError('Validation error'+errors, 400);
      }

      const user = await this.userService.updateUser(req.params.id, updateUserDto);
      res.json({
        status: 'success',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete user (Admin only)
   */
  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.userService.deleteUser(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  /**
   * Assign role to user (Admin only)
   */
  assignRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const assignRoleDto = new AssignRoleDto();
      Object.assign(assignRoleDto, req.body);

      const errors = await validate(assignRoleDto);
      if (errors.length > 0) {
          throw new AppError('Validation error'+errors, 400);
      }

      const user = await this.userService.assignRole(
        req.params.id,
        assignRoleDto.role
      );
      res.json({
        status: 'success',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  };
}