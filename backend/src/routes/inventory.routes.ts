import { Router, RequestHandler } from 'express';
import { InventoryController } from '../controllers/inventory.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../entities/user.entity';

const router = Router();
const controller = new InventoryController();

// Apply authentication to all inventory routes
router.use(authenticate);

// Create inventory item - Admin and Manager only
router.post(
  '/',
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  controller.createInventoryItem.bind(controller) as RequestHandler
);

// Get all inventory items - All roles
router.get(
  '/',
  authorize([UserRole.ADMIN, UserRole.MANAGER, UserRole.USER]),
  controller.getAllInventoryItems.bind(controller) as RequestHandler
);

// Get inventory item by ID - All roles
router.get(
  '/:id',
  authorize([UserRole.ADMIN, UserRole.MANAGER, UserRole.USER]),
  controller.getInventoryItemById.bind(controller) as RequestHandler
);

// Update inventory item - Admin and Manager only
router.put(
  '/:id',
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  controller.updateInventoryItem.bind(controller) as RequestHandler
);

// Delete inventory item - Admin and Manager only
router.delete(
  '/:id',
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  controller.deleteInventoryItem.bind(controller) as RequestHandler
);

export default router;