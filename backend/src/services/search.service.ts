import { Like } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { Task } from '../entities/task.entity';
import { Project } from '../entities/project.entity';
import { User } from '../entities/user.entity';

export class SearchService {
  private taskRepository = AppDataSource.getRepository(Task);
  private projectRepository = AppDataSource.getRepository(Project);
  private userRepository = AppDataSource.getRepository(User);

  /**
   * Search tasks by query string
   */
  async searchTasks(query: string, page: number = 1, limit: number = 10) {
    const [tasks, total] = await this.taskRepository.findAndCount({
      where: [
        { name: Like(`%${query}%`) },
        { description: Like(`%${query}%`) }
      ],
      relations: ['assignee', 'project'],
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' }
    });

    return { tasks, total };
  }

  /**
   * Search projects by query string
   */
  async searchProjects(query: string, page: number = 1, limit: number = 10) {
    const [projects, total] = await this.projectRepository.findAndCount({
      where: [
        { name: Like(`%${query}%`) },
        { description: Like(`%${query}%`) }
      ],
      relations: ['manager'],
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' }
    });

    return { projects, total };
  }

  /**
   * Search users by query string
   */
  async searchUsers(query: string, page: number = 1, limit: number = 10) {
    const [users, total] = await this.userRepository.findAndCount({
      where: [
        { name: Like(`%${query}%`) },
        { email: Like(`%${query}%`) }
      ],
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' }
    });

    return { users, total };
  }
}