import { ProjectService } from '../../../services/project.service';
import { AppDataSource } from '../../../config/data-source';
import { Project } from '../../../entities/project.entity';
import { User } from '../../../entities/user.entity';
import { UserRole } from '../../../entities/user.entity';
import { BadRequestError } from '../../../errors/bad-request-error';
import { UnauthorizedError } from '../../../errors/unauthorized-error';
import { NotFoundError } from '../../../errors/not-found-error';
import { CreateProjectDto } from '../../../dtos/project.dto';

jest.mock('../../../config/data-source', () => ({
  AppDataSource: {
    getRepository: jest.fn()
  }
}));

describe('ProjectService', () => {
  let projectService: ProjectService;
  let mockProjectRepository: any;
  let mockUserRepository: any;

  beforeEach(() => {
    mockProjectRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      count: jest.fn()
    };
    mockUserRepository = {
      findOne: jest.fn()
    };

    (AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
      if (entity === Project) return mockProjectRepository;
      if (entity === User) return mockUserRepository;
    });

    projectService = new ProjectService();
  });

  describe('createProject', () => {
    it('should create a project', async () => {
      const userId = '1';
      const projectDto: CreateProjectDto = {
        name: 'Test Project',
        description: 'Test Description',
        start_date: new Date(),
        end_date: new Date(Date.now() + 86400000) // tomorrow
      };

      const manager = {
        id: 1,
        name: 'Test Manager',
        email: 'manager@test.com',
        role: UserRole.MANAGER
      };

      const savedProject = {
        id: 1,
        ...projectDto,
        manager
      };

      mockUserRepository.findOne.mockResolvedValue(manager);
      mockProjectRepository.create.mockReturnValue(projectDto);
      mockProjectRepository.save.mockResolvedValue(savedProject);

      const result = await projectService.createProject(projectDto, userId);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId }
      });
      expect(mockProjectRepository.create).toHaveBeenCalled();
      expect(mockProjectRepository.save).toHaveBeenCalled();
      expect(result).toEqual(savedProject);
    });

    it('should throw error if manager not found', async () => {
      const userId = '1';
      const projectDto: CreateProjectDto = {
        name: 'Test Project',
        description: 'Test Description',
        start_date: new Date(),
        end_date: new Date(Date.now() + 86400000)
      };

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(projectService.createProject(projectDto, userId))
        .rejects.toThrow(NotFoundError);
    });

    it('should throw error if user is not a manager', async () => {
      const userId = '1';
      const projectDto: CreateProjectDto = {
        name: 'Test Project',
        description: 'Test Description',
        start_date: new Date(),
        end_date: new Date(Date.now() + 86400000)
      };

      const user = {
        id: 1,
        name: 'Test User',
        email: 'user@test.com',
        role: UserRole.USER
      };

      mockUserRepository.findOne.mockResolvedValue(user);

      await expect(projectService.createProject(projectDto, userId))
        .rejects.toThrow(UnauthorizedError);
    });
  });

  describe('getAllProjects', () => {
    it('should return projects with pagination', async () => {
      const page = 1;
      const limit = 10;
      const projects = [
        { id: 1, name: 'Project 1' },
        { id: 2, name: 'Project 2' }
      ];

      mockProjectRepository.find.mockResolvedValue(projects);
      mockProjectRepository.count.mockResolvedValue(2);

      const result = await projectService.getAllProjects(page, limit);

      expect(mockProjectRepository.find).toHaveBeenCalledWith({
        skip: 0,
        take: limit,
        relations: ['manager']
      });
      expect(result).toEqual({
        data: projects,
        total: 2,
        page,
        limit
      });
    });
  });

  describe('getProjectById', () => {
    it('should return project by id', async () => {
      const projectId = '1';
      const project = {
        id: 1,
        name: 'Test Project',
        description: 'Test Description'
      };

      mockProjectRepository.findOne.mockResolvedValue(project);

      const result = await projectService.getProjectById(projectId);

      expect(mockProjectRepository.findOne).toHaveBeenCalledWith({
        where: { id: projectId },
        relations: ['manager', 'tasks']
      });
      expect(result).toEqual(project);
    });

    it('should throw error if project not found', async () => {
      const projectId = '1';

      mockProjectRepository.findOne.mockResolvedValue(null);

      await expect(projectService.getProjectById(projectId))
        .rejects.toThrow(NotFoundError);
    });
  });
});