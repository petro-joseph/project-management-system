import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service';

export class DashboardController {
  private dashboardService = new DashboardService();

  /**
   * Get dashboard statistics
   */
  getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await this.dashboardService.getDashboardStats();

      res.json({
        status: 'success',
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get project progress
   */
  getProjectProgress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.role === 'manager' ? req.user.userId : undefined;
      const progress = await this.dashboardService.getProjectProgress(userId);

      res.json({
        status: 'success',
        data: progress,
      });
    } catch (error) {
      next(error);
    }
  };
}