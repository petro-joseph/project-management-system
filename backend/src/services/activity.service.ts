import { AppDataSource } from '../config/data-source';
import { Repository } from 'typeorm';
import { Activity } from '../entities/activity.entity';

export class ActivityService {
  private repo: Repository<Activity>;

  constructor() {
    this.repo = AppDataSource.getRepository(Activity);
  }

  async logActivity(data: Partial<Activity>): Promise<Activity> {
    const activity = this.repo.create(data);
    return this.repo.save(activity);
  }

  async getRecentActivities(limit = 20): Promise<Activity[]> {
    return this.repo.find({
      order: { timestamp: 'DESC' },
      take: limit,
    });
  }

  async getUserActivities(userId: string, limit = 20): Promise<Activity[]> {
    return this.repo.find({
      where: { userId },
      order: { timestamp: 'DESC' },
      take: limit,
    });
  }
}