import { Request, Response, NextFunction } from 'express';
import { SearchService } from '../services/search.service';
import { AppError } from '../middleware/error.middleware';

export class SearchController {
  private searchService = new SearchService();

  /**
   * Search tasks
   */
  searchTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query.q as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!query) {
        throw new AppError('Search query is required', 400);
      }

      const result = await this.searchService.searchTasks(query, page, limit);

      res.json({
        status: 'success',
        data: {
          tasks: result.tasks,
          total: result.total,
          page,
          totalPages: Math.ceil(result.total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Search projects
   */
  searchProjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query.q as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!query) {
        throw new AppError('Search query is required', 400);
      }

      const result = await this.searchService.searchProjects(query, page, limit);

      res.json({
        status: 'success',
        data: {
          projects: result.projects,
          total: result.total,
          page,
          totalPages: Math.ceil(result.total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Search users
   */
  searchUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query.q as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!query) {
        throw new AppError('Search query is required', 400);
      }

      const result = await this.searchService.searchUsers(query, page, limit);

      res.json({
        status: 'success',
        data: {
          users: result.users.map(user => {
            // Remove sensitive information
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
          }),
          total: result.total,
          page,
          totalPages: Math.ceil(result.total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  };
}