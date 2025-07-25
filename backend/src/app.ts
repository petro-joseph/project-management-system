import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerDefinition from './config/swagger.config';
import { AppDataSource } from './config/data-source';
import { errorHandler } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';
import dashboardRoutes from './routes/dashboard.routes';
import searchRoutes from './routes/search.routes';
import taskRoutes from './routes/task.routes';
import userRoutes from './routes/user.routes';
import inventoryRoutes from './routes/inventory.routes';
import activityRoutes from './routes/activity.routes';
import fixedAssetRoutes from './routes/fixed-asset.routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger setup
const options = {
  swaggerDefinition,
  // Path is relative to the root directory where the script is run
  apis: ['./src/routes/*.ts'],
};
const swaggerSpec = swaggerJsdoc(options);

// Routes will be added here
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api', fixedAssetRoutes);

// Error handling middleware should be last
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  errorHandler(err, req, res, next);
});

// Database connection
AppDataSource.initialize()
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((error: Error) => console.log('TypeORM connection error: ', error));

export default app;
