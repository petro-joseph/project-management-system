import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from '../src/config/data-source';
import { errorHandler } from '../src/middleware/error.middleware';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes will be added here

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