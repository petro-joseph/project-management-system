import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/task.service';
import { CreateTaskDto, UpdateTaskDto } from '../dtos/task.dto';
import { validate } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class TaskController {
  private taskService = new TaskService();

  /**
   * Create new task
   */
  createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createTaskDto = new CreateTaskDto();
      Object.assign(createTaskDto, req.body);

      const errors = await validate(createTaskDto);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const task = await this.taskService.createTask(
        req.params.projectId,
        req.user!.userId,
        createTaskDto
      );

      res.status(201).json({
        status: 'success',
        data: { task },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get project tasks
   */
  getProjectTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.taskService.getProjectTasks(
        req.params.projectId,
        page,
        limit
      );

      res.json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update task
   */
  updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updateTaskDto = new UpdateTaskDto();
      Object.assign(updateTaskDto, req.body);

      const errors = await validate(updateTaskDto);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const task = await this.taskService.updateTask(
        req.params.id,
        req.user!.userId,
        updateTaskDto
      );

      res.json({
        status: 'success',
        data: { task },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update task status
   */
  updateTaskStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status } = req.body;

      if (!Object.values(TaskStatus).includes(status)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid status value',
        });
      }

      const task = await this.taskService.updateTaskStatus(
        req.params.id,
        req.user!.userId,
        status
      );

      res.json({
        status: 'success',
        data: { task },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete task
   */
  deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.taskService.deleteTask(req.params.id, req.user!.userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}