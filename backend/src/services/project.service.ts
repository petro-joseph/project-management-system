import { AppDataSource } from '../config/data-source';
import { Project } from '../entities/project.entity';
import { User } from '../entities/user.entity';
import { CreateProjectDto, UpdateProjectDto } from '../dtos/project.dto';
import { BadRequestError, UnauthorizedError, NotFoundError } from '../middleware/error.middleware';
import { UserRole } from '../entities/user.entity';

export class ProjectService {
  private projectRepository = AppDataSource.getRepository(Project);
  private userRepository = AppDataSource.getRepository(User);

  /**
   * Create a new project
   */
  async createProject(
    managerId: string,
    projectData: CreateProjectDto
  ): Promise<Project> {
    const manager = await this.userRepository.findOne({
      where: { id: managerId },
    });

    if (!manager) {
      throw new NotFoundError('Manager not found');
    }

    if (manager.role !== UserRole.MANAGER && manager.role !== UserRole.ADMIN) {
      throw new UnauthorizedError('User must be a manager to create projects');
    }

    const project = this.projectRepository.create({
      ...projectData,
      managerId,
    });

    return await this.projectRepository.save(project);
  }

  /**
   * Get all projects with pagination
   */
  async getAllProjects(page: number = 1, limit: number = 10): Promise<{
    projects: any[];
    total: number;
  }> {
    const [projects, total] = await this.projectRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['manager', 'tasks'],
    });

    //return only the necessary fields
    const sanitizedProjects = projects.map(project => ({
      ...project,
      manager: project.manager ? {
        name: project.manager.name,
        email: project.manager.email,
        role: project.manager.role
      } : null
    }));

    return { projects: sanitizedProjects, total };
  }

  /**
   * Get project by ID
   */
  async getProjectById(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['manager', 'tasks'],
    });

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    return project;
  }

  /**
   * Update project
   */
  async updateProject(
    id: string,
    userId: string,
    updateData: UpdateProjectDto
  ): Promise<Project> {
    const project = await this.getProjectById(id);

    if (project.managerId !== userId) {
      throw new UnauthorizedError('Unauthorized to update this project');
    }

    Object.assign(project, updateData);

    
    return await this.projectRepository.save(project);
  }

  /**
   * Delete project
   */
  async deleteProject(id: string, userId: string): Promise<void> {
    const project = await this.getProjectById(id);

    if (project.managerId !== userId) {
      throw new UnauthorizedError('Unauthorized to delete this project');
    }

    await this.projectRepository.remove(project);
  }
}