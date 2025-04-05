import { Router } from 'express';
import { ActivityController } from '../controllers/activity.controller';

const router = Router();
const controller = new ActivityController();

router.post('/activities', controller.logActivity);
router.get('/activities/recent', controller.getRecentActivities);
router.get('/activities/user/:userId', controller.getUserActivities);

export default router;