import { ProjectService } from '../../../services/project.service';
import { createMockRepositories, mockProject, mockUser } from '../mock-helper';
import { AppError } from '../../../middleware/error.middleware';
import { CreateProjectDto } from '../../../dtos/project.dto';

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
      // Create project data using the DTO
      const projectData: CreateProjectDto = {
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

  describe('updateProject', () => {
    it('should update a project', async () => {
      const updateData: Partial<CreateProjectDto> = {
        name: 'Updated Project',
        description: 'Updated Description'
      };

      projectRepository.findOne.mockResolvedValue(mockProject);
      projectRepository.save.mockResolvedValue({ ...mockProject, ...updateData });

      const result = await projectService.updateProject(
        mockProject.id,
        mockUser.id,
        updateData
      );

      expect(result.name).toBe(updateData.name);
      expect(projectRepository.save).toHaveBeenCalled();
    });
  });

  describe('deleteProject', () => {
    it('should delete a project', async () => {
      projectRepository.findOne.mockResolvedValue(mockProject);
      projectRepository.remove.mockResolvedValue(mockProject);

      await projectService.deleteProject(mockProject.id, mockUser.id);

      expect(projectRepository.remove).toHaveBeenCalled();
    });

    it('should throw error if project not found', async () => {
      projectRepository.findOne.mockResolvedValue(null);

      await expect(
        projectService.deleteProject('nonexistent', mockUser.id)
      ).rejects.toThrow(AppError);
    });
  });

});