import { Router } from 'express';
import { InventoryController } from '../controllers/inventory.controller';

const router = Router();
const controller = new InventoryController();

router.post('/inventory', controller.createInventoryItem.bind(controller));
router.get('/inventory', controller.getAllInventoryItems.bind(controller));
router.get('/inventory/:id', controller.getInventoryItemById.bind(controller));
router.put('/inventory/:id', controller.updateInventoryItem.bind(controller));
router.delete('/inventory/:id', controller.deleteInventoryItem.bind(controller));

export default router;