import { Router } from 'express';
import { SearchController } from '../controllers/search.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../entities/user.entity';

const router = Router();
const searchController = new SearchController();

// Apply authentication middleware to all search routes
router.use(authenticate);

/**
 * @route GET /api/search/tasks
 * @desc Search tasks
 * @access Private
 */
router.get('/tasks', searchController.searchTasks);

/**
 * @route GET /api/search/projects
 * @desc Search projects
 * @access Private
 */
router.get('/projects', searchController.searchProjects);

/**
 * @route GET /api/search/users
 * @desc Search users
 * @access Private (Admin and Manager only)
 */
router.get(
  '/users',
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  searchController.searchUsers
);

export default router;