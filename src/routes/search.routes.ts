import { Router } from 'express';
import { SearchController } from '../controllers/search.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const searchController = new SearchController();

// Search routes
router.get('/tasks', authenticate, (req, res) => searchController.searchTasks(req, res));
router.get('/projects', authenticate, (req, res) => searchController.searchProjects(req, res));
router.get('/users', authenticate, (req, res) => searchController.searchUsers(req, res));

export default router;