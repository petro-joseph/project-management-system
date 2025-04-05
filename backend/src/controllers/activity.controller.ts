import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ActivityService } from '../services/activity.service';

export class ActivityController {
  private service = new ActivityService();

  logActivity: RequestHandler = async (req, res, next) => {
    try {
      const activity = await this.service.logActivity(req.body);
      res.status(201).json(activity);
    } catch (err) { next(err); }
  };

  getRecentActivities: RequestHandler = async (req, res, next) => {
    try {
      const activities = await this.service.getRecentActivities();
      res.json(activities);
    } catch (err) { next(err); }
  };

  getUserActivities: RequestHandler = async (req, res, next) => {
    try {
      const activities = await this.service.getUserActivities(req.params.userId);
      res.json(activities);
    } catch (err) { next(err); }
  };
}