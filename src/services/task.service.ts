import { AppDataSource } from '../config/data-source';
import { Task, TaskStatus } from '../entities/task.entity';
import { Project } from '../entities/project.entity';
import { User } from '../entities/user.entity';
import { CreateTaskDto, UpdateTaskDto } from '../dtos/task.dto';
import { AppError } from '../middleware/error.middleware';
import { NotificationService } from './notification.service';

export class TaskService {
  private taskRepository = AppDataSource.getRepository(Task);
  private projectRepository = AppDataSource.getRepository(Project);
  private userRepository = AppDataSource.getRepository(User);
  private notificationService = new NotificationService();



   /**
   * Create a new task  
   */
  async createTask(
    projectId: string,
    creatorId: string,
    taskData: CreateTaskDto
  ): Promise<Task> {
    // Verify project exists and user has permission
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['manager'],
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    // Only project manager can create tasks
    if (project.managerId !== creatorId) {
      throw new AppError('Only project manager can create tasks', 403);
    }

    // Verify assignee exists
    const assignee = await this.userRepository.findOne({
      where: { id: taskData.assigneeId },
    });

    if (!assignee) {
      throw new AppError('Assignee not found', 404);
    }

    const task = this.taskRepository.create({
      ...taskData,
      projectId,
      status: TaskStatus.PENDING,
    });

    const savedTask = await this.taskRepository.save(task);
    
    // Send notification to assignee
    if (assignee) {
      await this.notificationService.sendTaskAssignmentNotification(savedTask, assignee);
    }

    return savedTask;
  }


  /**
   * Get all tasks for a project
   */
  async getProjectTasks(
    projectId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ tasks: Task[]; total: number }> {
    const [tasks, total] = await this.taskRepository.findAndCount({
      where: { projectId },
      relations: ['assignee'],
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return { tasks, total };
  }

  /**
   * Get task by ID
   */
  async getTaskById(taskId: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['assignee', 'project'],
    });

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    return task;
  }

  /**
   * Update task
   */
  async updateTask(
    taskId: string,
    userId: string,
    updateData: UpdateTaskDto
  ): Promise<Task> {
    const task = await this.getTaskById(taskId);

    // Verify user has permission (either assignee or project manager)
    const project = await this.projectRepository.findOne({
      where: { id: task.projectId },
    });

    if (task.assigneeId !== userId && project?.managerId !== userId) {
      throw new AppError('Unauthorized to update this task', 403);
    }

    // If status is being updated, verify it's a valid transition
    if (updateData.status) {
      this.validateStatusTransition(task.status, updateData.status);
    }

    Object.assign(task, updateData);
    return await this.taskRepository.save(task);
  }

  /**
   * Update task status with notification
   */
  async updateTaskStatus(
    taskId: string,
    userId: string,
    status: TaskStatus
  ): Promise<Task> {
    const task = await this.getTaskById(taskId);

    // Only assignee can update status
    if (task.assigneeId !== userId) {
      throw new AppError('Only task assignee can update status', 403);
    }

    const previousStatus = task.status;
    this.validateStatusTransition(task.status, status);
    task.status = status;

    const updatedTask = await this.taskRepository.save(task);
    
    // Send notification for status update
    await this.notificationService.sendTaskStatusUpdateNotification(
      updatedTask,
      previousStatus
    );

    return updatedTask;
  }

  /**
   * Delete task
   */
  async deleteTask(taskId: string, userId: string): Promise<void> {
    const task = await this.getTaskById(taskId);
    const project = await this.projectRepository.findOne({
      where: { id: task.projectId },
    });

    // Only project manager can delete tasks
    if (project?.managerId !== userId) {
      throw new AppError('Only project manager can delete tasks', 403);
    }

    await this.taskRepository.remove(task);
  }

  /**
   * Validate task status transition
   */
  private validateStatusTransition(
    currentStatus: TaskStatus,
    newStatus: TaskStatus
  ): void {
    const validTransitions = {
      [TaskStatus.PENDING]: [TaskStatus.IN_PROGRESS],
      [TaskStatus.IN_PROGRESS]: [TaskStatus.COMPLETED, TaskStatus.PENDING],
      [TaskStatus.COMPLETED]: [TaskStatus.IN_PROGRESS],
    };

    if (
      !validTransitions[currentStatus].includes(newStatus) &&
      currentStatus !== newStatus
    ) {
      throw new AppError(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
        400
      );
    }
  }
}