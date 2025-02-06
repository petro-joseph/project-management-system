import { SearchService } from '../../../services/search.service';
import { createMockRepositories, mockTask, mockProject } from '../mock-helper';
import { Like } from 'typeorm';

describe('SearchService', () => {
  let searchService: SearchService;
  const { taskRepository, projectRepository } = createMockRepositories();

  beforeEach(() => {
    searchService = new SearchService();
    (searchService as any).taskRepository = taskRepository;
    (searchService as any).projectRepository = projectRepository;
  });

  describe('searchTasks', () => {
    it('should search tasks', async () => {
      const tasks = [mockTask];
      const total = 1;

      taskRepository.findAndCount.mockResolvedValue([tasks, total]);

      const result = await searchService.searchTasks('test', 1, 10);

      expect(result.tasks).toHaveLength(1);
      expect(result.total).toBe(total);
    });
  });

  describe('searchProjects', () => {
    it('should search projects', async () => {
      const projects = [mockProject];
      const total = 1;

      projectRepository.findAndCount.mockResolvedValue([projects, total]);

      const result = await searchService.searchProjects('test', 1, 10);

      expect(result.projects).toHaveLength(1);
      expect(result.total).toBe(total);
    });
  });
});