import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ActivityService } from '../services/activity.service';
import { CreateActivityDto } from '../dtos/activity.dto';
import { validate } from 'class-validator';
export class ActivityController {
  private service = new ActivityService();

  logActivity: RequestHandler = async (req, res, next) => {
    try {
      const dto = Object.assign(new CreateActivityDto(), req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: errors.map(e => e.constraints)
        });
        return;
      }

      const activity = await this.service.logActivity(dto);
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