import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { CreateUserDto, LoginDto } from '../dtos/user.dto';
import { validate } from 'class-validator';

export class AuthController {
  private authService = new AuthService();

  /**
   * Handle user registration
   */
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body
      const createUserDto = new CreateUserDto();
      Object.assign(createUserDto, req.body);
      
      const errors = await validate(createUserDto);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const user = await this.authService.register(createUserDto);
      res.status(201).json({
        status: 'success',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handle user login
   */
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body
      const loginDto = new LoginDto();
      Object.assign(loginDto, req.body);
      
      const errors = await validate(loginDto);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const result = await this.authService.login(loginDto);
      res.json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}