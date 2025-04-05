import { SwaggerDefinition } from 'swagger-jsdoc';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Project Management System API',
    version: '1.0.0',
    description: 'API documentation for the Project Management System',
    contact: {
      name: 'API Support',
      email: 'support@projectmanagement.com'
    }
  },
  servers: [
    {
      url: '/api',
      description: 'Development server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [{
    bearerAuth: []
  }]
};

export default swaggerDefinition;
