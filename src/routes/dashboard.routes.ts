import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../entities/user.entity';

const router = Router();
const dashboardController = new DashboardController();

// Apply authentication middleware
router.use(authenticate);

// Only admin and managers can access dashboard statistics
router.get(
  '/stats',
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  dashboardController.getDashboardStats
);

router.get(
  '/progress',
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  dashboardController.getProjectProgress
);

export default router;