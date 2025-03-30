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


/**
 * @route POST /api/auth/logout
 * @desc Logout user and invalidate token
 * @access Private
 */
router.post('/logout', authController.logout as RequestHandler);

export default router;