import { DashboardService } from '../../../services/dashboard.service';
import { createMockRepositories, mockProject } from '../mock-helper';
import { TaskStatus } from '../../../entities/task.entity';
import { SelectQueryBuilder } from 'typeorm';
import { mock } from 'jest-mock-extended';

describe('DashboardService', () => {
  let dashboardService: DashboardService;
  const { projectRepository, taskRepository, userRepository } = createMockRepositories();

  beforeEach(() => {
    dashboardService = new DashboardService();
    (dashboardService as any).projectRepository = projectRepository;
    (dashboardService as any).taskRepository = taskRepository;
    (dashboardService as any).userRepository = userRepository;
  });

  describe('getDashboardStats', () => {
    it('should return dashboard statistics', async () => {
      projectRepository.count.mockResolvedValue(1);
      taskRepository.count.mockResolvedValue(3);
      const mockQueryBuilder = mock<SelectQueryBuilder<any>>();
      mockQueryBuilder.select.mockReturnThis();
      mockQueryBuilder.addSelect.mockReturnThis();
      mockQueryBuilder.groupBy.mockReturnThis();
      mockQueryBuilder.getRawMany.mockResolvedValue([
        { status: TaskStatus.PENDING, count: '1' },
        { status: TaskStatus.IN_PROGRESS, count: '1' },
        { status: TaskStatus.COMPLETED, count: '1' }
      ]);
      taskRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await dashboardService.getDashboardStats();

      expect(result).toHaveProperty('projects');
      expect(result).toHaveProperty('tasks');
      expect(result.tasks.total).toBe(3);
    });
  });

  describe('getProjectProgress', () => {
    it('should return project progress', async () => {
      const mockQueryBuilder = mock<SelectQueryBuilder<any>>();
      mockQueryBuilder.select.mockReturnThis();
      mockQueryBuilder.addSelect.mockReturnThis();
      mockQueryBuilder.leftJoin.mockReturnThis();
      mockQueryBuilder.groupBy.mockReturnThis();
      mockQueryBuilder.getRawMany.mockResolvedValue([{
        project_id: mockProject.id,
        project_name: mockProject.name,
        totalTasks: '3',
        completedTasks: '1'
      }]);
      projectRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await dashboardService.getProjectProgress();

      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toHaveProperty('progress');
    });
  });
});