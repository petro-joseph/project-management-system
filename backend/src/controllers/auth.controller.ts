import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { AuthService } from '../services/auth.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { LoginDto } from '../dtos/login.dto';
import { validate } from 'class-validator';
import { ValidationError } from '../utils/errors';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Handle user registration
   */
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createUserDto = new CreateUserDto();
      Object.assign(createUserDto, req.body);

      const errors = await validate(createUserDto);
      if (errors.length > 0) {
        res.status(400).json({ 
          message: 'Validation failed', 
          errors: errors.map(error => Object.values(error.constraints || {})).flat() 
        });
        return;
      }

      const user = await this.authService.register(createUserDto);

      res.status(201).json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ message: error.message });
        return;
      }
      next(error);
    }
  };

  /**
   * Handle user login
   */
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password }: LoginDto = req.body;
      const result = await this.authService.login(email, password);

      res.json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handle user logout
   */
  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        throw new Error('No token provided');
      }

      await this.authService.logout(token);

      res.json({
        status: 'success',
        message: 'Successfully logged out'
      });
    } catch (error) {
      next(error);
    }
  };
}