import { Router, RequestHandler } from 'express';
import { ProjectController } from '../controllers/project.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../entities/user.entity';
import taskRoutes from './task.routes';

const router = Router();
const projectController = new ProjectController();

// Apply authentication middleware to all routes
router.use(authenticate);

// Nest task routes under projects
router.use('/:projectId/tasks', taskRoutes);

// Route definitions
router.post(
  '/',
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  projectController.createProject as RequestHandler
);

router.get('/', projectController.getAllProjects as RequestHandler);
router.get('/:id', projectController.getProjectById as RequestHandler);

router.put(
  '/:id',
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  projectController.updateProject as RequestHandler
);


router.delete(
  '/:id',
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  projectController.deleteProject as RequestHandler
);

export default router;
