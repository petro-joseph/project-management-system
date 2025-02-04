import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../entities/user.entity';

const router = Router({ mergeParams: true }); // Enable access to parent route parameters
const taskController = new TaskController();

// Apply authentication middleware to all routes
router.use(authenticate);

// Route definitions
router.post(
  '/',
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  taskController.createTask
);

router.get('/', taskController.getProjectTasks);

router.put(
  '/:id',
  authorize([UserRole.ADMIN, UserRole.MANAGER, UserRole.USER]),
  taskController.updateTask
);

router.patch(
  '/:id/status',
  authorize([UserRole.ADMIN, UserRole.MANAGER, UserRole.USER]),
  taskController.updateTaskStatus
);

router.delete(
  '/:id',
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  taskController.deleteTask
);

export default router;