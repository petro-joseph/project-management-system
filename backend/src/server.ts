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
  apis: ['./src/routes/*.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.NODE_ENV === 'test' ? 3001 : (process.env.PORT || 3000);

export function setup(): Promise<Server> {
  return new Promise((resolve) => {
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      resolve(server);
    });
  });
}

// Only start the server if this file is run directly
if (require.main === module) {
  setup();
}
