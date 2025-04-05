import app from './app';
import dotenv from 'dotenv';
import { Server } from 'http';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerDefinition from './config/swagger.config';

dotenv.config();

// Swagger setup
const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/docs/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));  // Handle trailing slash

const PORT = process.env.NODE_ENV === 'test' ? 3001 : (process.env.PORT || 3001);

export function setup(): Promise<Server> {
  return new Promise((resolve, reject) => {
    try {
      const server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        resolve(server);
      });
      server.on('error', (err) => {
        console.error('Server startup error:', err);
        reject(err);
      });
    } catch (err) {
      console.error('Setup failed:', err);
      reject(err);
    }
  });
}

if (require.main === module) {
  setup().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}