import { DashboardService } from '../../../services/dashboard.service';
import { AppDataSource } from '../../../config/data-source';
import { Task } from '../../../entities/task.entity';
import { Project } from '../../../entities/project.entity';
import { User } from '../../../entities/user.entity';
import { TaskStatus } from '../../../entities/task.entity';
import { UserRole } from '../../../entities/user.entity';

jest.mock('../../../config/data-source', () => ({
  AppDataSource: {
    getRepository: jest.fn()
  }
}));

describe('DashboardService', () => {
  let dashboardService: DashboardService;
  let mockTaskRepository: any;
  let mockProjectRepository: any;
  let mockUserRepository: any;

  beforeEach(() => {
    mockTaskRepository = {
      count: jest.fn(),
      createQueryBuilder: jest.fn()
    };
    mockProjectRepository = {
      count: jest.fn(),
      createQueryBuilder: jest.fn(),
      findOne: jest.fn()
    };
    mockUserRepository = {
      count: jest.fn(),
      createQueryBuilder: jest.fn()
    };

    (AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
      if (entity === Task) return mockTaskRepository;
      if (entity === Project) return mockProjectRepository;
      if (entity === User) return mockUserRepository;
    });

    dashboardService = new DashboardService();
  });

  describe('getDashboardStats', () => {
    it('should return dashboard statistics', async () => {
      mockTaskRepository.count.mockResolvedValue(10);
      mockProjectRepository.count.mockResolvedValue(5);
      mockUserRepository.count.mockResolvedValue(3);

      mockTaskRepository.createQueryBuilder.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          { status: TaskStatus.PENDING, count: '5' },
          { status: TaskStatus.IN_PROGRESS, count: '3' },
          { status: TaskStatus.COMPLETED, count: '2' }
        ])
      });

      mockUserRepository.createQueryBuilder.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          { role: UserRole.USER, count: '2' },
          { role: UserRole.MANAGER, count: '1' }
        ])
      });

      const result = await dashboardService.getDashboardStats();

      expect(result).toEqual({
        tasks: {
          total: 10,
          byStatus: {
            pending: 5,
            inProgress: 3,
            completed: 2
          }
        },
        projects: {
          total: 5,
          active: 5,
          completed: 0
        },
        users: {
          total: 3,
          byRole: {
            user: 2,
            manager: 1,
            admin: 0
          }
        }
      });
    });
  });

  describe('getProjectProgress', () => {
    it('should return project progress', async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        setParameter: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        addGroupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([{
          project_id: '1',
          project_name: 'Test Project',
          total_tasks: '3',
          completed_tasks: '1'
        }])
      };

      mockProjectRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await dashboardService.getProjectProgress('1');

      expect(result).toEqual([{
        id: '1',
        name: 'Test Project',
        totalTasks: 3,
        completedTasks: 1,
        progress: 33.33
      }]);

      expect(mockQueryBuilder.setParameter).toHaveBeenCalledWith('completed', TaskStatus.COMPLETED);
      expect(mockQueryBuilder.groupBy).toHaveBeenCalledWith('project.id');
      expect(mockQueryBuilder.addGroupBy).toHaveBeenCalledWith('project.name');
    });
  });
});