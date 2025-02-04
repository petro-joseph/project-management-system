import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../services/project.service';
import { CreateProjectDto, UpdateProjectDto } from '../dtos/project.dto';
import { validate } from 'class-validator';

export class ProjectController {
  private projectService = new ProjectService();

  /**
   * Create new project
   */
  createProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createProjectDto = new CreateProjectDto();
      Object.assign(createProjectDto, req.body);

      const errors = await validate(createProjectDto);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const project = await this.projectService.createProject(
        req.user!.userId,
        createProjectDto
      );

      res.status(201).json({
        status: 'success',
        data: { project },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all projects
   */
  getAllProjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.projectService.getAllProjects(page, limit);

      res.json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get project by ID
   */
  getProjectById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const project = await this.projectService.getProjectById(req.params.id);

      res.json({
        status: 'success',
        data: { project },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update project
   */
  updateProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updateProjectDto = new UpdateProjectDto();
      Object.assign(updateProjectDto, req.body);

      const errors = await validate(updateProjectDto);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const project = await this.projectService.updateProject(
        req.params.id,
        req.user!.userId,
        updateProjectDto
      );

      res.json({
        status: 'success',
        data: { project },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete project
   */
  deleteProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.projectService.deleteProject(req.params.id, req.user!.userId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}