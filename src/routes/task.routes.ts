import { Router, RequestHandler } from 'express';
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
  taskController.createTask as RequestHandler
);

router.get('/', taskController.getProjectTasks as RequestHandler);

router.put(
  '/:id',
  authorize([UserRole.ADMIN, UserRole.MANAGER, UserRole.USER]),
  taskController.updateTask as RequestHandler
);

/**
 * Updates the status of a task.
 * @param {string} id - The ID of the task to update.
 * @param {UserRole[]} - The user roles that are authorized to perform this action.
 * @param {RequestHandler} - The controller function that handles the task status update.
 */
router.patch(
  '/:id/status',
  authorize([UserRole.ADMIN, UserRole.MANAGER, UserRole.USER]),
  taskController.updateTaskStatus as RequestHandler
);

router.delete(
  '/:id',
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  taskController.deleteTask as RequestHandler
);

export default router;