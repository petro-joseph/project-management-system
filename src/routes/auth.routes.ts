import { Router, RequestHandler } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const authController = new AuthController();

// Route definitions 

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', authController.register as RequestHandler);

/**
 * @route POST /api/auth/login
 * @desc Authenticate user & get token
 * @access Public
 */
router.post('/login', authController.login as RequestHandler);

export default router;