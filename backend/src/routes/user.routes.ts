import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../entities/user.entity';

const router = Router();
const userController = new UserController();

// Apply authentication middleware to all routes
router.use(authenticate);

// Routes that require admin role
router.post('/', authorize([UserRole.ADMIN]), userController.createUser);
router.put('/:id', authorize([UserRole.ADMIN]), userController.updateUser);
router.delete('/:id', authorize([UserRole.ADMIN]), userController.deleteUser);
router.post('/:id/role', authorize([UserRole.ADMIN]), userController.assignRole);

// Routes that require admin or manager role
router.get('/', authorize([UserRole.ADMIN, UserRole.MANAGER]), userController.getAllUsers);

// Routes accessible to all authenticated users
router.get('/:id', userController.getUserById);

export default router;