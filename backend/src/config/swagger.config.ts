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
    },
    schemas: {
      Project: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          description: { type: 'string' },
          managerId: { type: 'string', format: 'uuid' },
          start_date: { type: 'string', format: 'date-time' },
          end_date: { type: 'string', format: 'date-time' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
          status: { type: 'string', nullable: true },
          clientName: { type: 'string', nullable: true },
          budget: { type: 'number', format: 'double', nullable: true },
          spent: { type: 'number', format: 'double', nullable: true },
          manager: { $ref: '#/components/schemas/User' },
          tasks: {
            type: 'array',
            items: { $ref: '#/components/schemas/Task' }
          }
        },
        required: ['id', 'name', 'description', 'managerId', 'start_date', 'end_date', 'created_at', 'updated_at']
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string', enum: ['admin', 'manager', 'user'] },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
          status: { type: 'string', nullable: true },
          lastLogin: { type: 'string', format: 'date-time', nullable: true },
          phoneNumber: { type: 'string', nullable: true },
          department: { type: 'string', nullable: true },
          jobTitle: { type: 'string', nullable: true },
          profilePictureUrl: { type: 'string', nullable: true }, 
          permissions: {
            type: 'array',
            items: { type: 'string' },
            nullable: true
          }
        },
        required: ['id', 'name', 'email', 'role', 'created_at', 'updated_at']
      },
      Task: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          description: { type: 'string' },
          projectId: { type: 'string', format: 'uuid' },
          assigneeId: { type: 'string', format: 'uuid' },
          status: { type: 'string', enum: ['pending', 'in_progress', 'completed'] },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
          project: { $ref: '#/components/schemas/Project' },
          assignee: { $ref: '#/components/schemas/User' }
        },
        required: ['id', 'name', 'description', 'projectId', 'assigneeId', 'status', 'created_at', 'updated_at']
      },
      CreateProjectDto: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          start_date: { type: 'string', format: 'date-time' },
          end_date: { type: 'string', format: 'date-time' }
        },
        required: ['name', 'description', 'start_date', 'end_date']
      },
      CreateTaskDto: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          projectId: { type: 'string', format: 'uuid' },
          assigneeId: { type: 'string', format: 'uuid' },
          status: { type: 'string', enum: ['pending', 'in_progress', 'completed'] }
        },
        required: ['name', 'description', 'projectId', 'assigneeId', 'status']
      },
      UpdateTaskDto: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          projectId: { type: 'string', format: 'uuid' },
          assigneeId: { type: 'string', format: 'uuid' },
          status: { type: 'string', enum: ['pending', 'in_progress', 'completed'] }
        }
      },
      LoginDto: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' }
        },
        required: ['email', 'password']
      },
      CreateUserDto: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 2 },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
          role: { type: 'string', enum: ['admin', 'manager', 'user'], nullable: true }
        },
        required: ['name', 'email', 'password']
      },
      UpdateUserDto: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 2 },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6, nullable: true },
          role: { type: 'string', enum: ['admin', 'manager', 'user'], nullable: true }
        }
      },
      CreateInventoryItemDto: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string', nullable: true },
          quantity: { type: 'number' },
          unitOfMeasure: { type: 'string' },
          locationId: { type: 'number', nullable: true },
          projectId: { type: 'number', nullable: true },
          purchaseDate: { type: 'string', format: 'date-time', nullable: true },
          supplierId: { type: 'number', nullable: true },
          costPerUnit: { type: 'number', nullable: true },
          totalValue: { type: 'number', nullable: true },
          lowStockThreshold: { type: 'number', nullable: true },
          category: { type: 'string', nullable: true },
          status: { type: 'string', nullable: true }
        },
        required: ['name', 'quantity', 'unitOfMeasure']
      },
      CreateAssetCategoryDto: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string', nullable: true },
          defaultUsefulLifeMin: { type: 'number' },
          defaultUsefulLifeMax: { type: 'number' },
          defaultDepreciationMethod: { type: 'string' },
          defaultSalvageValuePercent: { type: 'number' },
          isActive: { type: 'boolean', nullable: true },
          createdBy: { type: 'number', nullable: true }
        },
        required: ['name', 'defaultUsefulLifeMin', 'defaultUsefulLifeMax', 'defaultDepreciationMethod', 'defaultSalvageValuePercent']
      },
      CreateFixedAssetDto: {
        type: 'object',
        properties: {
          assetTag: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string', nullable: true },
          categoryId: { type: 'number' },
          acquisitionDate: { type: 'string', format: 'date-time' },
          originalCost: { type: 'number' },
          usefulLife: { type: 'number' },
          depreciationMethod: { type: 'string' },
          salvageValue: { type: 'number' },
          currentValue: { type: 'number' },
          accumulatedDepreciation: { type: 'number' },
          status: { type: 'string', nullable: true },
          location: { type: 'string', nullable: true },
          custodian: { type: 'number', nullable: true },
          serialNumber: { type: 'string', nullable: true },
          lastDepreciationDate: { type: 'string', format: 'date-time', nullable: true },
          disposalDate: { type: 'string', format: 'date-time', nullable: true },
          disposalProceeds: { type: 'number', nullable: true },
          disposalReason: { type: 'string', nullable: true },
          createdBy: { type: 'number', nullable: true }
        },
        required: ['assetTag', 'name', 'categoryId', 'acquisitionDate', 'originalCost', 'usefulLife', 'depreciationMethod', 'salvageValue', 'currentValue', 'accumulatedDepreciation']
      },
      CreateDepreciationEntryDto: {
        type: 'object',
        properties: {
          assetId: { type: 'number' },
          period: { type: 'string' },
          amount: { type: 'number' },
          bookValueBefore: { type: 'number' },
          bookValueAfter: { type: 'number' },
          postingDate: { type: 'string', format: 'date-time' },
          createdBy: { type: 'number', nullable: true }
        },
        required: ['assetId', 'period', 'amount', 'bookValueBefore', 'bookValueAfter', 'postingDate']
      },
      CreateDisposalEntryDto: {
        type: 'object',
        properties: {
          assetId: { type: 'number' },
          disposalDate: { type: 'string', format: 'date-time' },
          disposalProceeds: { type: 'number' },
          disposalCosts: { type: 'number' },
          netBookValue: { type: 'number' },
          gainLoss: { type: 'number' },
          reason: { type: 'string', nullable: true },
          notes: { type: 'string', nullable: true },
          createdBy: { type: 'number', nullable: true }
        },
        required: ['assetId', 'disposalDate', 'disposalProceeds', 'disposalCosts', 'netBookValue', 'gainLoss']
      },
      CreateAssetRevaluationDto: {
        type: 'object',
        properties: {
          assetId: { type: 'number' },
          revaluationDate: { type: 'string', format: 'date-time' },
          previousValue: { type: 'number' },
          newValue: { type: 'number' },
          reason: { type: 'string', nullable: true },
          type: { type: 'string' },
          notes: { type: 'string', nullable: true },
          createdBy: { type: 'number', nullable: true }
        },
        required: ['assetId', 'revaluationDate', 'previousValue', 'newValue', 'type']
      }
    }
  },
  security: [{
    bearerAuth: []
  }]
};

// Define all paths in one go
// Check if paths exists, if not initialize it
if (!swaggerDefinition.paths) {
  swaggerDefinition.paths = {};
}
Object.assign(swaggerDefinition.paths, {

  // AUTH
  '/register': {
    post: {
      tags: ['Auth'],
      summary: 'Register a new user',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateUserDto' }
          }
        }
      },
      responses: {
        '201': { description: 'User registered successfully' }
      }
    }
  },
  '/login': {
    post: {
      tags: ['Auth'],
      summary: 'Login user',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/LoginDto' }
          }
        }
      },
      responses: {
        '200': { description: 'Login successful' },
        '401': { description: 'Invalid credentials' }
      }
    }
  },
  '/logout': {
    post: {
      tags: ['Auth'],
      summary: 'Logout user',
      responses: {
        '200': { description: 'Logout successful' }
      }
    }
  },

  // SEARCH
  '/search/tasks': {
    get: {
      tags: ['Search'],
      summary: 'Search tasks',
      parameters: [{
        name: 'query',
        in: 'query',
        required: true,
        schema: { type: 'string' }
      }],
      responses: {
        '200': {
          description: 'Search results for tasks',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/Task' }
              }
            }
          }
        }
      }
    }
  },
  '/search/projects': {
    get: {
      tags: ['Search'],
      summary: 'Search projects',
      parameters: [{
        name: 'query',
        in: 'query',
        required: true,
        schema: { type: 'string' }
      }],
      responses: {
        '200': {
          description: 'Search results for projects',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/Project' }
              }
            }
          }
        }
      }
    }
  },
  '/search/users': {
    get: {
      tags: ['Search'],
      summary: 'Search users',
      parameters: [
        {
          name: 'query',
          in: 'query',
          required: true,
          schema: { type: 'string' },
          description: 'Search term for user name, email, or other fields'
        }
      ],
      responses: {
        '200': {
          description: 'Search results for users',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/User' }
              },
              examples: {
                example1: {
                  summary: 'Sample user search response',
                  value: [
                    {
                      id: '123e4567-e89b-12d3-a456-426614174000',
                      name: 'John Doe',
                      email: 'john.doe@example.com',
                      role: 'manager',
                      created_at: '2023-01-01T12:00:00Z',
                      updated_at: '2023-01-02T12:00:00Z',
                      status: 'active',
                      lastLogin: '2023-01-03T12:00:00Z',
                      phoneNumber: '+1234567890',
                      department: 'Engineering',
                      jobTitle: 'Project Manager',
                      profilePictureUrl: 'https://example.com/profile.jpg',
                      permissions: ['read', 'write']
                    }
                  ]
                }
              }
            }
          }
        }
      }
    }
  },

  
  // PROJECTS
  '/projects': {
    get: {
      tags: ['Projects'],
      summary: 'Get all projects',
      responses: {
        '200': {
          description: 'List of projects',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/Project' }
              }
            }
          }
        }
      }
    },
    post: {
      tags: ['Projects'],
      summary: 'Create a new project',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateProjectDto' }
          }
        }
      },
      responses: {
        '201': {
          description: 'Project created successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Project' }
            }
          }
        }
      }
    }
  },
  '/projects/{id}': {
    get: {
      tags: ['Projects'],
      summary: 'Get project by ID',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'uuid' }
        }
      ],
      responses: {
        '200': {
          description: 'Project details',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Project' }
            }
          }
        },
        '404': { description: 'Project not found' }
      }
    },
    put: {
      tags: ['Projects'],
      summary: 'Update project by ID',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'uuid' }
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateProjectDto' }
          }
        }
      },
      responses: {
        '200': {
          description: 'Project updated successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Project' }
            }
          }
        },
        '404': { description: 'Project not found' }
      }
    },
    delete: {
      tags: ['Projects'],
      summary: 'Delete project by ID',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'uuid' }
        }
      ],
      responses: {
        '204': { description: 'Project deleted successfully' },
        '404': { description: 'Project not found' }
      }
    }
  },

  // TASKS
  '/tasks': {
    get: {
      tags: ['Tasks'],
      summary: 'Get all tasks',
      responses: {
        '200': {
          description: 'List of tasks',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/Task' }
              }
            }
          }
        }
      }
    },
    post: {
      tags: ['Tasks'],
      summary: 'Create a new task',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateTaskDto' }
          }
        }
      },
      responses: {
        '201': {
          description: 'Task created successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Task' }
            }
          }
        }
      }
    }
  },
  '/tasks/{id}': {
    get: {
      tags: ['Tasks'],
      summary: 'Get task by ID',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'uuid' }
        }
      ],
      responses: {
        '200': {
          description: 'Task details',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Task' }
            }
          }
        },
        '404': { description: 'Task not found' }
      }
    },
    put: {
      tags: ['Tasks'],
      summary: 'Update task by ID',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'uuid' }
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdateTaskDto' }
          }
        }
      },
      responses: {
        '200': {
          description: 'Task updated successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Task' }
            }
          }
        },
        '404': { description: 'Task not found' }
      }
    },
    delete: {
      tags: ['Tasks'],
      summary: 'Delete task by ID',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'uuid' }
        }
      ],
      responses: {
        '204': { description: 'Task deleted successfully' },
        '404': { description: 'Task not found' }
      }
    }
  },


  // USERS
  '/users': {
    get: {
      tags: ['Users'],
      summary: 'Get all users',
      responses: {
        '200': {
          description: 'List of users',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/User' }
              }
            }
          }
        }
      }
    },
    post: {
      tags: ['Users'],
      summary: 'Create a new user',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateUserDto' }
          }
        }
      },
      responses: {
        '201': {
          description: 'User created successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/User' }
            }
          }
        }
      }
    }
  },
  '/users/{id}': {
    get: {
      tags: ['Users'],
      summary: 'Get user by ID',
      parameters: [{
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string', format: 'uuid' }
      }],
      responses: {
        '200': {
          description: 'User details',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/User' }
            }
          }
        },
        '404': { description: 'User not found' }
      }
    },
    put: {
      tags: ['Users'],
      summary: 'Update user by ID',
      parameters: [{
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string', format: 'uuid' }
        }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateUserDto' }
            }
          }
        },
        responses: {
          '200': {
            description: 'User updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' }
              }
            }
          },
        '404': { description: 'User not found' }
      }
    },
    delete: {
      tags: ['Users'],
      summary: 'Delete user by ID',
      parameters: [{
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string', format: 'uuid' }
      }],
      responses: {
        '204': { description: 'User deleted successfully' },
        '404': { description: 'User not found' }
      }
    }
  },
  '/users/{id}/role': {
    post: {
      tags: ['Users'],
      summary: 'Assign role to user',
      parameters: [{
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string', format: 'uuid' }
      }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                role: { type: 'string', enum: ['admin', 'manager', 'user'] }
              },
              required: ['role']
            }
          }
        }
      },
      responses: {
        '200': { description: 'Role assigned successfully' },
        '404': { description: 'User not found' }
      }
    }
  },

  // INVENTORY
  '/inventory': {
    get: {
      tags: ['Inventory'],
      summary: 'Get all inventory items',
      responses: {
        '200': {
          description: 'List of inventory items',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/CreateInventoryItemDto' }
              }
            }
          }
        }
      }
    },
    post: {
      tags: ['Inventory'],
      summary: 'Create inventory item',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateInventoryItemDto' }
          }
        }
      },
      responses: {
        '201': { description: 'Inventory item created successfully' }
      }
    }
  },
  '/inventory/{id}': {
    get: {
      tags: ['Inventory'],
      summary: 'Get inventory item by ID',
      parameters: [{
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string' }
      }],
      responses: {
        '200': {
          description: 'Inventory item details',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateInventoryItemDto' }
            }
          }
        },
        '404': { description: 'Inventory item not found' }
      }
    },
    put: {
      tags: ['Inventory'],
      summary: 'Update inventory item by ID',
      parameters: [{
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string' }
      }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateInventoryItemDto' }
          }
        }
      },
      responses: {
        '200': { description: 'Inventory item updated successfully' },
        '404': { description: 'Inventory item not found' }
      }
    },
    delete: {
      tags: ['Inventory'],
      summary: 'Delete inventory item by ID',
      parameters: [{
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string' }
      }],
      responses: {
        '204': { description: 'Inventory item deleted successfully' },
        '404': { description: 'Inventory item not found' }
      }
    }
  },

  // FIXED ASSETS
  '/asset-categories': {
    get: {
      tags: ['Fixed Assets'],
      summary: 'Get all asset categories',
      responses: {
        '200': {
          description: 'List of asset categories',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/CreateAssetCategoryDto' }
              }
            }
          }
        }
      }
    },
    post: {
      tags: ['Fixed Assets'],
      summary: 'Create asset category',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateAssetCategoryDto' }
          }
        }
      },
      responses: {
        '201': { description: 'Asset category created successfully' }
      }
    }
  },
  '/asset-categories/{id}': {
    put: {
      tags: ['Fixed Assets'],
      summary: 'Update asset category',
      parameters: [{
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string' }
      }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateAssetCategoryDto' }
          }
        }
      },
      responses: {
        '200': { description: 'Asset category updated successfully' },
        '404': { description: 'Asset category not found' }
      }
    },
    delete: {
      tags: ['Fixed Assets'],
      summary: 'Delete asset category',
      parameters: [{
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string' }
      }],
      responses: {
        '204': { description: 'Asset category deleted successfully' },
        '404': { description: 'Asset category not found' }
      }
    }
  },
  '/fixed-assets': {
    get: {
      tags: ['Fixed Assets'],
      summary: 'Get all fixed assets',
      responses: {
        '200': {
          description: 'List of fixed assets',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/CreateFixedAssetDto' }
              }
            }
          }
        }
      }
    },
    post: {
      tags: ['Fixed Assets'],
      summary: 'Create fixed asset',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateFixedAssetDto' }
          }
        }
      },
      responses: {
        '201': { description: 'Fixed asset created successfully' }
      }
    }
  },
  '/fixed-assets/{id}': {
    get: {
      tags: ['Fixed Assets'],
      summary: 'Get fixed asset by ID',
      parameters: [{
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string' }
      }],
      responses: {
        '200': {
          description: 'Fixed asset details',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateFixedAssetDto' }
            }
          }
        },
        '404': { description: 'Fixed asset not found' }
      }
    },
    put: {
      tags: ['Fixed Assets'],
      summary: 'Update fixed asset',
      parameters: [{
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string' }
      }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateFixedAssetDto' }
          }
        }
      },
      responses: {
        '200': { description: 'Fixed asset updated successfully' },
        '404': { description: 'Fixed asset not found' }
      }
    },
    delete: {
      tags: ['Fixed Assets'],
      summary: 'Delete fixed asset',
      parameters: [{
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string' }
      }],
      responses: {
        '204': { description: 'Fixed asset deleted successfully' },
        '404': { description: 'Fixed asset not found' }
      }
    }
  },

  // Depreciation Entries
  '/depreciation-entries': {
    post: {
      tags: ['Fixed Assets'],
      summary: 'Create depreciation entry',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateDepreciationEntryDto' }
          }
        }
      },
      responses: {
        '201': { description: 'Depreciation entry created successfully' }
      }
    }
  },
  '/fixed-assets/{assetId}/depreciation-entries': {
    get: {
      tags: ['Fixed Assets'],
      summary: 'Get depreciation entries for asset',
      parameters: [{
        name: 'assetId',
        in: 'path',
        required: true,
        schema: { type: 'string' }
      }],
      responses: {
        '200': {
          description: 'List of depreciation entries',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/CreateDepreciationEntryDto' }
              }
            }
          }
        }
      }
    }
  },

  // Disposal Entries
  '/disposal-entries': {
    post: {
      tags: ['Fixed Assets'],
      summary: 'Create disposal entry',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateDisposalEntryDto' }
          }
        }
      },
      responses: {
        '201': { description: 'Disposal entry created successfully' }
      }
    }
  },
  '/fixed-assets/{assetId}/disposal-entries': {
    get: {
      tags: ['Fixed Assets'],
      summary: 'Get disposal entries for asset',
      parameters: [{
        name: 'assetId',
        in: 'path',
        required: true,
        schema: { type: 'string' }
      }],
      responses: {
        '200': {
          description: 'List of disposal entries',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/CreateDisposalEntryDto' }
              }
            }
          }
        }
      }
    }
  },

  // Asset Revaluations
  '/asset-revaluations': {
    post: {
      tags: ['Fixed Assets'],
      summary: 'Create asset revaluation',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateAssetRevaluationDto' }
          }
        }
      },
      responses: {
        '201': { description: 'Asset revaluation created successfully' }
      }
    }
  },
  '/fixed-assets/{assetId}/asset-revaluations': {
    get: {
      tags: ['Fixed Assets'],
      summary: 'Get asset revaluations for asset',
      parameters: [{
        name: 'assetId',
        in: 'path',
        required: true,
        schema: { type: 'string' }
      }],
      responses: {
        '200': {
          description: 'List of asset revaluations',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/CreateAssetRevaluationDto' }
              }
            }
          }
        }
      }
    }
  },

  // ACTIVITIES
  '/activities': {
    post: {
      tags: ['Activities'],
      summary: 'Log activity',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                userId: { type: 'string' },
                action: { type: 'string' },
                details: { type: 'string' }
              },
              required: ['userId', 'action']
            }
          }
        }
      },
      responses: {
        '201': { description: 'Activity logged successfully' }
      }
    }
  },
  '/activities/recent': {
    get: {
      tags: ['Activities'],
      summary: 'Get recent activities',
      responses: {
        '200': {
          description: 'List of recent activities',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    userId: { type: 'string' },
                    action: { type: 'string' },
                    details: { type: 'string' },
                    timestamp: { type: 'string', format: 'date-time' }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  '/users/{userId}/activities': {
    get: {
      tags: ['Activities'],
      summary: 'Get activities for user',
      parameters: [{
        name: 'userId',
        in: 'path',
        required: true,
        schema: { type: 'string' }
      }],
      responses: {
        '200': {
          description: 'List of user activities',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    userId: { type: 'string' },
                    action: { type: 'string' },
                    details: { type: 'string' },
                    timestamp: { type: 'string', format: 'date-time' }
                  }
                }
              }
            }
          }
        }
      }
    }
  },

});

export default swaggerDefinition;
