import { AppDataSource } from '../config/data-source';
import { Project } from '../entities/project.entity';
import { Task, TaskStatus } from '../entities/task.entity';
import { User, UserRole } from '../entities/user.entity';
import { cacheService } from '../config/redis.config';
import { MoreThan } from 'typeorm';

interface DashboardStats {
  projects: {
    total: number;
    active: number;
    completed: number;
  };
  tasks: {
    total: number;
    byStatus: {
      pending: number;
      inProgress: number;
      completed: number;
    };
  };
  users: {
    total: number;
    byRole: {
      admin: number;
      manager: number;
      user: number;
    };
  };
}

interface ProjectProgress {
  id: string;
  name: string;
  totalTasks: number;
  completedTasks: number;
  progress: number;
}

export class DashboardService {
  private projectRepository = AppDataSource.getRepository(Project);
  private taskRepository = AppDataSource.getRepository(Task);
  private userRepository = AppDataSource.getRepository(User);

  private readonly CACHE_TTL = 300; // 5 minutes cache

  /**
   * Get overall dashboard statistics
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const cacheKey = 'dashboard_stats';
    const cachedStats = await cacheService.get(cacheKey);

    if (cachedStats) {
      return JSON.parse(cachedStats);
    }

    const stats: DashboardStats = {
      projects: await this.getProjectStats(),
      tasks: await this.getTaskStats(),
      users: await this.getUserStats(),
    };

    // Cache the results
    await cacheService.set(cacheKey, JSON.stringify(stats), this.CACHE_TTL);

    return stats;
  }

  /**
   * Get project statistics
   */
  private async getProjectStats() {
    const totalProjects = await this.projectRepository.count();
    const now = new Date();

    const activeProjects = await this.projectRepository.count({
      where: {
        end_date: MoreThan(now),
      },
    });

    return {
      total: totalProjects,
      active: activeProjects,
      completed: totalProjects - activeProjects,
    };
  }

  /**
   * Get task statistics
   */
  private async getTaskStats() {
    const totalTasks = await this.taskRepository.count();

    const tasksByStatus = await this.taskRepository
      .createQueryBuilder('task')
      .select('task.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('task.status')
      .getRawMany();

    const byStatus = {
      pending: 0,
      inProgress: 0,
      completed: 0,
    };

    tasksByStatus.forEach((stat) => {
      switch (stat.status) {
        case TaskStatus.PENDING:
          byStatus.pending = parseInt(stat.count);
          break;
        case TaskStatus.IN_PROGRESS:
          byStatus.inProgress = parseInt(stat.count);
          break;
        case TaskStatus.COMPLETED:
          byStatus.completed = parseInt(stat.count);
          break;
      }
    });

    return {
      total: totalTasks,
      byStatus,
    };
  }

  /**
   * Retrieves user statistics, including the total number of users and the count of users by role (admin, manager, user).
   * @returns An object containing the total number of users and the count of users by role.
   */
  private async getUserStats() {
    const totalUsers = await this.userRepository.count();

    const usersByRole = await this.userRepository
      .createQueryBuilder('user')
      .select('user.role', 'role')
      .addSelect('COUNT(*)', 'count')
      .groupBy('user.role')
      .getRawMany();

    const byRole = {
      admin: 0,
      manager: 0,
      user: 0,
    };

    usersByRole.forEach((stat) => {
      switch (stat.role) {
        case UserRole.ADMIN:
          byRole.admin = parseInt(stat.count);
          break;
        case UserRole.MANAGER:
          byRole.manager = parseInt(stat.count);
          break;
        case UserRole.USER:
          byRole.user = parseInt(stat.count);
          break;
      }
    });

    return {
      total: totalUsers,
      byRole,
    };
  }

  /**
   * Get project progress statistics
   */
  async getProjectProgress(userId?: string): Promise<ProjectProgress[]> {
    const cacheKey = `project_progress_${userId || 'all'}`;
    const cachedProgress = await cacheService.get(cacheKey);

    if (cachedProgress) {
      return JSON.parse(cachedProgress);
    }

    const queryBuilder = this.projectRepository
  .createQueryBuilder('project')
  .leftJoinAndSelect('project.tasks', 'task')
  .select([
    'project.id as project_id',
    'project.name as project_name',
    'COUNT(task.id) as totalTasks',
    'COUNT(CASE WHEN task.status = :completed THEN 1 END) as completedTasks'
  ])
  .setParameter('completed', TaskStatus.COMPLETED)
  .groupBy('project.id')
  .addGroupBy('project.name');

    if (userId) {
      queryBuilder.where('project.managerId = :userId', { userId });
    }

    const projects = await queryBuilder.getRawMany();

    const progress = projects.map((project) => ({
      id: project.project_id,
      name: project.project_name,
      totalTasks: parseInt(project.totalTasks) || 0,
      completedTasks: parseInt(project.completedTasks) || 0,
      progress: project.totalTasks > 0
        ? (project.completedTasks / project.totalTasks) * 100
        : 0,
    }));

    // Cache the results
    await cacheService.set(cacheKey, JSON.stringify(progress), this.CACHE_TTL);

    return progress;
  }
}