import { Router, RequestHandler } from 'express';
import { ProjectController } from '../controllers/project.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../entities/user.entity';
import taskRoutes from './task.routes';

const router = Router();
const projectController = new ProjectController();

// Apply authentication middleware to all routes
router.use(authenticate);

// Nest task routes under projects
router.use('/:projectId/tasks', taskRoutes);

// Route definitions
/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new project
 *     description: Create a new project (Admin and Manager only)
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Projects
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  '/',
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  projectController.createProject as RequestHandler
);

router.get('/', projectController.getAllProjects as RequestHandler);
router.get('/:id', projectController.getProjectById as RequestHandler);

/**
 * @swagger
 * /projects/{id}:
 *   put:
 *     summary: Update a project
 *     description: Update an existing project (Admin and Manager only)
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Projects
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       200:
 *         description: Project updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Project not found
 */
router.put(
  '/:id',
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  projectController.updateProject as RequestHandler
);


router.delete(
  '/:id',
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  projectController.deleteProject as RequestHandler
);

export default router;
