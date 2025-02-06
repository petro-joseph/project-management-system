import { ProjectService } from '../../../services/project.service';
import { createMockRepositories, mockProject, mockUser } from '../mock-helper';
import { AppError } from '../../../middleware/error.middleware';

describe('ProjectService', () => {
  let projectService: ProjectService;
  const { projectRepository, userRepository } = createMockRepositories();

  beforeEach(() => {
    projectService = new ProjectService();
    (projectService as any).projectRepository = projectRepository;
    (projectService as any).userRepository = userRepository;
  });

  describe('createProject', () => {
    it('should create a project', async () => {
      const projectData = {
        name: 'New Project',
        description: 'Description',
        start_date: new Date(),
        end_date: new Date()
      };

      projectRepository.create.mockReturnValue({ ...mockProject, ...projectData });
      projectRepository.save.mockResolvedValue({ ...mockProject, ...projectData });

      const result = await projectService.createProject(mockUser.id, projectData);

      expect(result.name).toBe(projectData.name);
      expect(projectRepository.save).toHaveBeenCalled();
    });
  });

  describe('getAllProjects', () => {
    it('should return projects with pagination', async () => {
      const projects = [mockProject];
      const total = 1;

      projectRepository.findAndCount.mockResolvedValue([projects, total]);

      const result = await projectService.getAllProjects(1, 10);

      expect(result.projects).toHaveLength(1);
      expect(result.total).toBe(total);
    });
  });

  describe('getProjectById', () => {
    it('should return project by id', async () => {
      projectRepository.findOne.mockResolvedValue(mockProject);

      const result = await projectService.getProjectById(mockProject.id);

      expect(result.id).toBe(mockProject.id);
    });

    it('should throw error if project not found', async () => {
      projectRepository.findOne.mockResolvedValue(null);

      await expect(projectService.getProjectById('nonexistent'))
        .rejects.toThrow(AppError);
    });
  });
});