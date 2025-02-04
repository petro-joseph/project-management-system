import { Request, Response } from 'express';
import { SearchService } from '../services/search.service';

export class SearchController {
  private searchService = new SearchService();

  /**
   * Search tasks
   */
  async searchTasks(req: Request, res: Response) {
    const { query } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const results = await this.searchService.searchTasks(query as string, page, limit);
    res.json(results);
  }

  /**
   * Search projects
   */
  async searchProjects(req: Request, res: Response) {
    const { query } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const results = await this.searchService.searchProjects(query as string, page, limit);
    res.json(results);
  }

  /**
   * Search users
   */
  async searchUsers(req: Request, res: Response) {
    const { query } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const results = await this.searchService.searchUsers(query as string, page, limit);
    res.json(results);
  }
}
