import { TaskService } from '../../../services/task.service';
import { createMockRepositories, mockTask, mockProject, mockUser } from '../mock-helper';
import { AppError } from '../../../middleware/error.middleware';
import { TaskStatus } from '../../../entities/task.entity';

describe('TaskService', () => {
  let taskService: TaskService;
  const { taskRepository, projectRepository, userRepository } = createMockRepositories();

  beforeEach(() => {
    taskService = new TaskService();
    (taskService as any).taskRepository = taskRepository;
    (taskService as any).projectRepository = projectRepository;
    (taskService as any).userRepository = userRepository;
  });

  describe('createTask', () => {
    it('should create a task', async () => {
      const taskData = {
        name: 'New Task',
        description: 'Description',
        assigneeId: mockUser.id
      };

      projectRepository.findOne.mockResolvedValue(mockProject);
      userRepository.findOne.mockResolvedValue(mockUser);
      taskRepository.create.mockReturnValue({ ...mockTask, ...taskData });
      taskRepository.save.mockResolvedValue({ ...mockTask, ...taskData });

      const result = await taskService.createTask(
        mockProject.id,
        mockProject.managerId,
        taskData
      );

      expect(result.name).toBe(taskData.name);
      expect(taskRepository.save).toHaveBeenCalled();
    });
  });

  describe('updateTaskStatus', () => {
    it('should update task status', async () => {
      const updatedTask = { ...mockTask, status: TaskStatus.IN_PROGRESS };
      taskRepository.findOne.mockResolvedValue(mockTask);
      taskRepository.save.mockResolvedValue(updatedTask);

      const result = await taskService.updateTaskStatus(
        mockTask.id,
        mockTask.assigneeId,
        TaskStatus.IN_PROGRESS
      );

      expect(result.status).toBe(TaskStatus.IN_PROGRESS);
    });

    it('should throw error if task not found', async () => {
      taskRepository.findOne.mockResolvedValue(null);

      await expect(taskService.updateTaskStatus(
        'nonexistent',
        mockUser.id,
        TaskStatus.IN_PROGRESS
      )).rejects.toThrow(AppError);
    });
  });
});