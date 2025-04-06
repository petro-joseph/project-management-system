import { Router, RequestHandler } from 'express';
import { ActivityController } from '../controllers/activity.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../entities/user.entity';

const router = Router();
const controller = new ActivityController();

// Apply authentication to all activity routes
router.use(authenticate);

// Log activity - all roles
router.post(
  '/',
  authorize([UserRole.ADMIN, UserRole.MANAGER, UserRole.USER]),
  controller.logActivity as RequestHandler
);

// Get recent activities - all roles
router.get(
  '/recent',
  authorize([UserRole.ADMIN, UserRole.MANAGER, UserRole.USER]),
  controller.getRecentActivities as RequestHandler
);

// Get activities for a specific user - admin, manager, or the user themselves
router.get(
  '/user/:userId',
  (req, res, next) => {
    if (
      req.user?.role === UserRole.ADMIN ||
      req.user?.role === UserRole.MANAGER ||
      req.user?.userId === req.params.userId
    ) {
      return next();
    }
    next(new Error('Forbidden'));
  },
  controller.getUserActivities as RequestHandler
);

export default router;