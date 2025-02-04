import { AppDataSource } from '../config/data-source';
import { Task, TaskStatus } from '../entities/task.entity';
import { User } from '../entities/user.entity';

export class TaskAnalyticsService {
  private taskRepository = AppDataSource.getRepository(Task);

  /**
   * Get user performance metrics
   */
  async getUserPerformanceMetrics(userId: string, startDate: Date, endDate: Date) {
    const tasks = await this.taskRepository
      .createQueryBuilder('task')
      .where('task.assigneeId = :userId', { userId })
      .andWhere('task.created_at BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getMany();

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(
      (task) => task.status === TaskStatus.COMPLETED
    ).length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Calculate average completion time
    const completedTasksWithDuration = tasks
      .filter((task) => task.status === TaskStatus.COMPLETED)
      .map((task) => {
        const completionTime =
          new Date(task.updated_at).getTime() -
          new Date(task.created_at).getTime();
        return completionTime / (1000 * 60 * 60); // Convert to hours
      });

    const averageCompletionTime =
      completedTasksWithDuration.length > 0
        ? completedTasksWithDuration.reduce((a, b) => a + b) /
          completedTasksWithDuration.length
        : 0;

    return {
      totalTasks,
      completedTasks,
      completionRate,
      averageCompletionTime,
    };
  }

  /**
   * Get task distribution analytics
   */
  async getTaskDistributionAnalytics() {
    const distribution = await this.taskRepository
      .createQueryBuilder('task')
      .select('assignee.id', 'assigneeId')
      .addSelect('assignee.name', 'assigneeName')
      .addSelect('COUNT(*)', 'totalTasks')
      .addSelect(
        'COUNT(CASE WHEN task.status = :completed THEN 1 END)',
        'completedTasks'
      )
      .leftJoin('task.assignee', 'assignee')
      .setParameter('completed', TaskStatus.COMPLETED)
      .groupBy('assignee.id')
      .addGroupBy('assignee.name')
      .getRawMany();

    return distribution.map((item) => ({
      assigneeId: item.assigneeId,
      assigneeName: item.assigneeName,
      totalTasks: parseInt(item.totalTasks),
      completedTasks: parseInt(item.completedTasks),
      completionRate:
        (parseInt(item.completedTasks) / parseInt(item.totalTasks)) * 100,
    }));
  }
}