import { 
  User, 
  Project, 
  Task, 
  Activity, 
  DashboardData,
  TaskStatus,
  ProjectMilestone,
  ProjectBudget,
  ProjectTimeline,
  ProjectPhase,
  ProjectExpense,
  TaskTimeTracking,
  TaskTimeLog,
  InventoryItem
} from './types';

// Mock Users
export const users: User[] = [
  {
    id: 1,
    name: 'John Admin',
    email: 'admin@example.com',
    role: 'admin',
    createdAt: '2023-01-01T00:00:00Z',
    avatar: 'https://ui-avatars.com/api/?name=John+Admin&background=0D8ABC&color=fff'
  },
  {
    id: 2,
    name: 'Sarah Manager',
    email: 'manager@example.com',
    role: 'manager',
    createdAt: '2023-01-02T00:00:00Z',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Manager&background=0DBC8A&color=fff',
    managedProjects: [1, 2]
  },
  {
    id: 3,
    name: 'Tom User',
    email: 'user@example.com',
    role: 'user',
    createdAt: '2023-01-03T00:00:00Z',
    avatar: 'https://ui-avatars.com/api/?name=Tom+User&background=BC0D8A&color=fff'
  },
  {
    id: 4,
    name: 'Emma Manager',
    email: 'emma@example.com',
    role: 'manager',
    createdAt: '2023-01-04T00:00:00Z',
    avatar: 'https://ui-avatars.com/api/?name=Emma+Manager&background=8ABC0D&color=fff',
    managedProjects: [4, 5]
  },
  {
    id: 5,
    name: 'David User',
    email: 'david@example.com',
    role: 'user',
    createdAt: '2023-01-05T00:00:00Z',
    avatar: 'https://ui-avatars.com/api/?name=David+User&background=BC0D0D&color=fff'
  }
];

// Mock Projects with enhanced data
export const projects: Project[] = [
  {
    id: 1,
    name: 'ERP Development',
    description: 'Develop a modern ERP system with React and TypeScript',
    tasksCompleted: 8,
    tasksTotal: 12,
    createdAt: '2023-02-01T00:00:00Z',
    dueDate: '2023-06-01T00:00:00Z',
    status: 'in-progress',
    assignedUsers: [1, 2, 3, 4],
    managerId: 2, // Primary manager (Sarah)
    managers: [2], // All managers assigned to this project
    milestones: [
      {
        id: 1,
        name: 'Requirements Gathering',
        description: 'Gather all business requirements and user stories',
        dueDate: '2023-02-15T00:00:00Z',
        completed: true,
        completedDate: '2023-02-14T00:00:00Z'
      },
      {
        id: 2,
        name: 'Design Phase',
        description: 'Complete UI/UX design and system architecture',
        dueDate: '2023-03-15T00:00:00Z',
        completed: true,
        completedDate: '2023-03-20T00:00:00Z'
      },
      {
        id: 3,
        name: 'MVP Development',
        description: 'Develop minimal viable product with core features',
        dueDate: '2023-04-30T00:00:00Z',
        completed: false
      },
      {
        id: 4,
        name: 'Testing & Deployment',
        description: 'Complete testing and deploy to production',
        dueDate: '2023-05-30T00:00:00Z',
        completed: false
      }
    ],
    timeline: {
      startDate: '2023-02-01T00:00:00Z',
      endDate: '2023-06-01T00:00:00Z',
      phases: [
        {
          id: 1,
          name: 'Planning',
          startDate: '2023-02-01T00:00:00Z',
          endDate: '2023-02-15T00:00:00Z',
          color: '#9333ea'
        },
        {
          id: 2,
          name: 'Design',
          startDate: '2023-02-15T00:00:00Z',
          endDate: '2023-03-15T00:00:00Z',
          color: '#3b82f6'
        },
        {
          id: 3,
          name: 'Development',
          startDate: '2023-03-15T00:00:00Z',
          endDate: '2023-05-15T00:00:00Z',
          color: '#22c55e'
        },
        {
          id: 4,
          name: 'Testing',
          startDate: '2023-05-15T00:00:00Z',
          endDate: '2023-06-01T00:00:00Z',
          color: '#eab308'
        }
      ]
    },
    budget: {
      total: 50000,
      spent: 30000,
      currency: 'USD',
      expenses: [
        {
          id: 1,
          description: 'UI/UX Design Services',
          amount: 10000,
          date: '2023-02-20T00:00:00Z',
          category: 'Design'
        },
        {
          id: 2,
          description: 'Frontend Development',
          amount: 12000,
          date: '2023-03-25T00:00:00Z',
          category: 'Development'
        },
        {
          id: 3,
          description: 'Backend Development',
          amount: 8000,
          date: '2023-04-15T00:00:00Z',
          category: 'Development'
        }
      ]
    }
  },
  {
    id: 2,
    name: 'Mobile App Integration',
    description: 'Integrate our ERP with mobile applications',
    tasksCompleted: 3,
    tasksTotal: 8,
    createdAt: '2023-02-15T00:00:00Z',
    dueDate: '2023-07-01T00:00:00Z',
    status: 'in-progress',
    assignedUsers: [2, 5],
    managerId: 2, // Primary manager (Sarah)
    managers: [2], // All managers assigned to this project
    timeline: {
      startDate: '2023-02-15T00:00:00Z',
      endDate: '2023-07-01T00:00:00Z',
      phases: [
        {
          id: 1,
          name: 'Planning',
          startDate: '2023-02-15T00:00:00Z',
          endDate: '2023-03-15T00:00:00Z',
          color: '#9333ea'
        },
        {
          id: 2,
          name: 'Development',
          startDate: '2023-03-15T00:00:00Z',
          endDate: '2023-06-15T00:00:00Z',
          color: '#22c55e'
        },
        {
          id: 3,
          name: 'Testing',
          startDate: '2023-06-15T00:00:00Z',
          endDate: '2023-07-01T00:00:00Z',
          color: '#eab308'
        }
      ]
    },
    budget: {
      total: 30000,
      spent: 12000,
      currency: 'USD',
      expenses: [
        {
          id: 1,
          description: 'API Development',
          amount: 7000,
          date: '2023-03-10T00:00:00Z',
          category: 'Development'
        },
        {
          id: 2,
          description: 'Mobile UI Design',
          amount: 5000,
          date: '2023-04-05T00:00:00Z',
          category: 'Design'
        }
      ]
    }
  },
  {
    id: 3,
    name: 'Data Migration',
    description: 'Migrate legacy data to new ERP system',
    tasksCompleted: 5,
    tasksTotal: 5,
    createdAt: '2023-01-10T00:00:00Z',
    dueDate: '2023-03-01T00:00:00Z',
    status: 'completed',
    assignedUsers: [1, 3],
    managerId: 1, // Admin as manager
    managers: [1]
  },
  {
    id: 4,
    name: 'User Training',
    description: 'Train staff on using the new ERP system',
    tasksCompleted: 0,
    tasksTotal: 5,
    createdAt: '2023-03-01T00:00:00Z',
    dueDate: '2023-07-15T00:00:00Z',
    status: 'planned',
    assignedUsers: [4, 5],
    managerId: 4, // Emma as manager
    managers: [4]
  },
  {
    id: 5,
    name: 'System Testing',
    description: 'Perform extensive testing on the ERP system',
    tasksCompleted: 2,
    tasksTotal: 10,
    createdAt: '2023-02-20T00:00:00Z',
    dueDate: '2023-05-15T00:00:00Z',
    status: 'in-progress',
    assignedUsers: [1, 2, 3, 4, 5],
    managerId: 4, // Emma as manager
    managers: [2, 4] // Both Sarah and Emma manage this project
  }
];

// Mock Tasks with enhanced data for task management
export const tasks: Task[] = [
  {
    id: 1,
    title: 'Design database schema',
    description: 'Create an efficient database schema for the ERP system',
    status: 'completed',
    priority: 'high',
    projectId: 1,
    assignedTo: 1,
    createdBy: 1,
    createdAt: '2023-02-01T00:00:00Z',
    dueDate: '2023-02-15T00:00:00Z',
    dependencies: [],
    timeTracking: {
      estimatedHours: 20,
      loggedTime: [
        {
          id: 1,
          startTime: '2023-02-01T09:00:00Z',
          endTime: '2023-02-01T13:00:00Z',
          duration: 240,
          userId: 1
        },
        {
          id: 2,
          startTime: '2023-02-02T09:00:00Z',
          endTime: '2023-02-02T17:00:00Z',
          duration: 480,
          userId: 1
        },
        {
          id: 3,
          startTime: '2023-02-03T10:00:00Z',
          endTime: '2023-02-03T15:00:00Z',
          duration: 300,
          userId: 1
        }
      ],
      totalTimeSpent: 1020 // 17 hours
    },
    notificationSettings: {
      reminderDays: 2,
      reminderHours: 24,
      notifyAssignee: true,
      notifyCreator: true
    }
  },
  {
    id: 2,
    title: 'Implement user authentication',
    description: 'Create secure user authentication and authorization',
    status: 'completed',
    priority: 'high',
    projectId: 1,
    assignedTo: 1,
    createdBy: 1,
    createdAt: '2023-02-01T00:00:00Z',
    dueDate: '2023-02-20T00:00:00Z',
    dependencies: [1],
    timeTracking: {
      estimatedHours: 30,
      loggedTime: [
        {
          id: 1,
          startTime: '2023-02-06T09:00:00Z',
          endTime: '2023-02-06T17:00:00Z',
          duration: 480,
          userId: 1
        },
        {
          id: 2,
          startTime: '2023-02-07T09:00:00Z',
          endTime: '2023-02-07T17:00:00Z',
          duration: 480,
          userId: 1
        },
        {
          id: 3,
          startTime: '2023-02-08T09:00:00Z',
          endTime: '2023-02-08T17:00:00Z',
          duration: 480,
          userId: 1
        }
      ],
      totalTimeSpent: 1440 // 24 hours
    }
  },
  {
    id: 3,
    title: 'Create dashboard UI',
    description: 'Design and implement the main dashboard UI',
    status: 'in-progress',
    priority: 'medium',
    projectId: 1,
    assignedTo: 3,
    createdBy: 2,
    createdAt: '2023-02-05T00:00:00Z',
    dueDate: '2023-03-01T00:00:00Z',
    dependencies: [2],
    timeTracking: {
      estimatedHours: 40,
      loggedTime: [
        {
          id: 1,
          startTime: '2023-02-15T09:00:00Z',
          endTime: '2023-02-15T17:00:00Z',
          duration: 480,
          userId: 3
        },
        {
          id: 2,
          startTime: '2023-02-16T09:00:00Z',
          endTime: '2023-02-16T17:00:00Z',
          duration: 480,
          userId: 3
        }
      ],
      totalTimeSpent: 960 // 16 hours
    }
  },
  {
    id: 4,
    title: 'Implement project management module',
    description: 'Develop the project management functionality',
    status: 'in-progress',
    priority: 'medium',
    projectId: 1,
    assignedTo: 2,
    createdBy: 1,
    createdAt: '2023-02-10T00:00:00Z',
    dueDate: '2023-03-15T00:00:00Z'
  },
  {
    id: 5,
    title: 'Add task management features',
    description: 'Implement task creation, assignment, and tracking',
    status: 'pending',
    priority: 'medium',
    projectId: 1,
    assignedTo: 4,
    createdBy: 2,
    createdAt: '2023-02-15T00:00:00Z',
    dueDate: '2023-03-30T00:00:00Z'
  },
  {
    id: 6,
    title: 'Develop API for mobile app',
    description: 'Create RESTful APIs for mobile application integration',
    status: 'in-progress',
    priority: 'high',
    projectId: 2,
    assignedTo: 5,
    createdBy: 2,
    createdAt: '2023-02-15T00:00:00Z',
    dueDate: '2023-04-01T00:00:00Z'
  },
  {
    id: 7,
    title: 'Export legacy data',
    description: 'Export data from legacy systems for migration',
    status: 'completed',
    priority: 'high',
    projectId: 3,
    assignedTo: 1,
    createdBy: 1,
    createdAt: '2023-01-10T00:00:00Z',
    dueDate: '2023-01-30T00:00:00Z'
  },
  {
    id: 8,
    title: 'Import data to new system',
    description: 'Import legacy data into the new ERP system',
    status: 'completed',
    priority: 'high',
    projectId: 3,
    assignedTo: 3,
    createdBy: 1,
    createdAt: '2023-01-31T00:00:00Z',
    dueDate: '2023-02-15T00:00:00Z'
  },
  {
    id: 9,
    title: 'Verify data integrity',
    description: 'Ensure all migrated data is accurate and complete',
    status: 'completed',
    priority: 'high',
    projectId: 3,
    assignedTo: 1,
    createdBy: 1,
    createdAt: '2023-02-16T00:00:00Z',
    dueDate: '2023-02-28T00:00:00Z'
  },
  {
    id: 10,
    title: 'Create user training materials',
    description: 'Develop documentation and training materials for users',
    status: 'pending',
    priority: 'medium',
    projectId: 4,
    assignedTo: 4,
    createdBy: 4,
    createdAt: '2023-03-01T00:00:00Z',
    dueDate: '2023-04-15T00:00:00Z'
  }
];

// Mock Activities
export const activities: Activity[] = [
  {
    id: 1,
    type: 'task',
    action: 'completed',
    entityId: 1,
    entityName: 'Design database schema',
    userId: 1,
    userName: 'John Admin',
    timestamp: '2023-02-15T10:30:00Z'
  },
  {
    id: 2,
    type: 'task',
    action: 'completed',
    entityId: 2,
    entityName: 'Implement user authentication',
    userId: 1,
    userName: 'John Admin',
    timestamp: '2023-02-20T14:45:00Z'
  },
  {
    id: 3,
    type: 'project',
    action: 'created',
    entityId: 4,
    entityName: 'User Training',
    userId: 4,
    userName: 'Emma Manager',
    timestamp: '2023-03-01T09:15:00Z'
  },
  {
    id: 4,
    type: 'task',
    action: 'created',
    entityId: 10,
    entityName: 'Create user training materials',
    userId: 4,
    userName: 'Emma Manager',
    timestamp: '2023-03-01T09:30:00Z'
  },
  {
    id: 5,
    type: 'project',
    action: 'updated',
    entityId: 1,
    entityName: 'ERP Development',
    userId: 2,
    userName: 'Sarah Manager',
    timestamp: '2023-03-05T11:20:00Z'
  },
  {
    id: 6,
    type: 'task',
    action: 'completed',
    entityId: 9,
    entityName: 'Verify data integrity',
    userId: 1,
    userName: 'John Admin',
    timestamp: '2023-02-27T16:30:00Z'
  },
  {
    id: 7,
    type: 'project',
    action: 'completed',
    entityId: 3,
    entityName: 'Data Migration',
    userId: 1,
    userName: 'John Admin',
    timestamp: '2023-02-28T17:00:00Z'
  }
];

// Calculate task status counts
const calculateTaskStatusCounts = () => {
  const counts: Record<TaskStatus, number> = {
    'pending': 0,
    'in-progress': 0,
    'completed': 0,
    'cancelled': 0
  };
  
  tasks.forEach(task => {
    counts[task.status]++;
  });
  
  return counts;
};

// Dashboard Data
export const dashboardData: DashboardData = {
  totalProjects: projects.length,
  totalUsers: users.length,
  totalTasks: tasks.length,
  tasksByStatus: {
    pending: tasks.filter(task => task.status === 'pending').length,
    'in-progress': tasks.filter(task => task.status === 'in-progress').length,
    completed: tasks.filter(task => task.status === 'completed').length,
    cancelled: tasks.filter(task => task.status === 'cancelled').length
  },
  usersByRole: {
    admins: users.filter(user => user.role === 'admin').length,
    managers: users.filter(user => user.role === 'manager').length,
    users: users.filter(user => user.role === 'user').length
  },
  projects: projects.map(project => ({
    id: project.id,
    name: project.name,
    tasksCompleted: project.tasksCompleted,
    tasksTotal: project.tasksTotal
  })),
  recentActivity: activities.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ).slice(0, 5)
};

// Inventory Items
const inventoryItems: InventoryItem[] = [
  {
    id: 1,
    name: "Laptops",
    description: "Dell XPS 15 Developer Laptops",
    quantity: 10,
    unitOfMeasure: "units",
    location: "Main Office",
    projectId: 1,
    purchaseDate: "2023-01-15T00:00:00Z",
    supplier: "Dell",
    costPerUnit: 1500,
    totalValue: 15000,
    lowStockThreshold: 2,
    category: "Equipment",
    status: "available"
  },
  {
    id: 2,
    name: "Monitors",
    description: "27-inch 4K displays",
    quantity: 15,
    unitOfMeasure: "units",
    location: "Main Office",
    projectId: 1,
    purchaseDate: "2023-01-20T00:00:00Z",
    supplier: "LG",
    costPerUnit: 350,
    totalValue: 5250,
    lowStockThreshold: 3,
    category: "Equipment",
    status: "available"
  },
  {
    id: 3,
    name: "Office Chairs",
    description: "Ergonomic office chairs",
    quantity: 20,
    unitOfMeasure: "units",
    location: "Storage Room",
    projectId: null,
    purchaseDate: "2023-02-10T00:00:00Z",
    supplier: "Office Depot",
    costPerUnit: 250,
    totalValue: 5000,
    lowStockThreshold: 5,
    category: "Office Supplies",
    status: "available"
  },
  {
    id: 4,
    name: "Software Licenses",
    description: "Design software licenses",
    quantity: 5,
    unitOfMeasure: "licenses",
    location: "Digital Assets",
    projectId: 2,
    purchaseDate: "2023-02-15T00:00:00Z",
    supplier: "Adobe",
    costPerUnit: 600,
    totalValue: 3000,
    lowStockThreshold: 1,
    category: "Software",
    status: "assigned"
  },
  {
    id: 5,
    name: "Server Hardware",
    description: "Development server equipment",
    quantity: 2,
    unitOfMeasure: "units",
    location: "Server Room",
    projectId: 1,
    purchaseDate: "2023-03-01T00:00:00Z",
    supplier: "HP",
    costPerUnit: 3000,
    totalValue: 6000,
    lowStockThreshold: 1,
    category: "Equipment",
    status: "available"
  }
];

// Locations data for inventory
export const locations = [
  { id: 1, name: 'Main Office', description: 'Headquarters building' },
  { id: 2, name: 'Storage Room', description: 'Primary storage facility' },
  { id: 3, name: 'Server Room', description: 'IT infrastructure' },
  { id: 4, name: 'Digital Assets', description: 'Digital resource storage' },
  { id: 5, name: 'Remote Warehouse', description: 'Off-site storage' }
];

// Suppliers data
export const suppliers = [
  { id: 1, name: 'Dell', contactPerson: 'Michael Smith', email: 'michael@dell.example.com', phone: '555-1234' },
  { id: 2, name: 'LG', contactPerson: 'Jennifer Lee', email: 'jennifer@lg.example.com', phone: '555-2345' },
  { id: 3, name: 'Office Depot', contactPerson: 'Robert Chen', email: 'robert@officedepot.example.com', phone: '555-3456' },
  { id: 4, name: 'Adobe', contactPerson: 'Sarah Jones', email: 'sarah@adobe.example.com', phone: '555-4567' },
  { id: 5, name: 'HP', contactPerson: 'David Kim', email: 'david@hp.example.com', phone: '555-5678' }
];

// Helper functions for accessing and manipulating mock data

// User-related functions
export const findUserByEmail = (email: string): User | undefined => {
  return users.find(user => user.email === email);
};

export const getUserById = (id: number): User | undefined => {
  return users.find(user => user.id === id);
};

// Project-related functions
export const getProjects = () => {
  return projects;
};

export const getProjectById = (id: number): Project | undefined => {
  return projects.find(project => project.id === id);
};

export const getProjectsByUserId = (userId: number): Project[] => {
  const user = getUserById(userId);
  if (!user) return [];
  
  // Admins can access all projects
  if (user.role === 'admin') return projects;
  
  // Managers can access projects they manage
  if (user.role === 'manager') {
    return projects.filter(project => 
      project.assignedUsers.includes(userId) || 
      (project.managerId === userId) ||
      (project.managers && project.managers.includes(userId))
    );
  }
  
  // Regular users can only access projects they're assigned to
  return projects.filter(project => project.assignedUsers.includes(userId));
};

export const getProjectsManagedByUserId = (userId: number): Project[] => {
  const user = getUserById(userId);
  if (!user) return [];
  
  // Admins can manage all projects
  if (user.role === 'admin') return projects;
  
  // Managers can only manage projects they're assigned to manage
  if (user.role === 'manager') {
    return projects.filter(project => 
      (project.managerId === userId) ||
      (project.managers && project.managers.includes(userId))
    );
  }
  
  // Regular users cannot manage projects
  return [];
};

export const archiveProject = async (projectId: number): Promise<boolean> => {
  const projectIndex = projects.findIndex(p => p.id === projectId);
  if (projectIndex !== -1) {
    projects[projectIndex].status = 'archived';
    return true;
  }
  return false;
};

export const deleteProject = async (projectId: number): Promise<boolean> => {
  const projectIndex = projects.findIndex(p => p.id === projectId);
  if (projectIndex !== -1) {
    projects.splice(projectIndex, 1);
    return true;
  }
  return false;
};

// Task-related functions
export const getTaskById = (taskId: number): Task | undefined => {
  return tasks.find(task => task.id === taskId);
};

export const getTasksByProjectId = (projectId: number): Task[] => {
  return tasks.filter(task => task.projectId === projectId);
};

export const updateTask = (taskId: number, updates: Partial<Task>): Task | undefined => {
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  if (taskIndex !== -1) {
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updates
    };
    return tasks[taskIndex];
  }
  return undefined;
};

export const getTasksAccessibleByUser = (userId: number): Task[] => {
  const user = getUserById(userId);
  if (!user) return [];
  
  // Admins can access all tasks
  if (user.role === 'admin') return tasks;
  
  // Get projects the user has access to
  const accessibleProjects = getProjectsByUserId(userId);
  const accessibleProjectIds = accessibleProjects.map(project => project.id);
  
  // Users can access tasks in projects they have access to, plus tasks assigned to them
  return tasks.filter(task => 
    accessibleProjectIds.includes(task.projectId) || task.assignedTo === userId
  );
};

export const getTasksManageableByUser = (userId: number): Task[] => {
  const user = getUserById(userId);
  if (!user) return [];
  
  // Admins can manage all tasks
  if (user.role === 'admin') return tasks;
  
  // Get projects the user manages
  const managedProjects = getProjectsManagedByUserId(userId);
  const managedProjectIds = managedProjects.map(project => project.id);
  
  // Managers can manage tasks in projects they manage, plus tasks they created
  if (user.role === 'manager') {
    return tasks.filter(task => 
      managedProjectIds.includes(task.projectId) || task.createdBy === userId
    );
  }
  
  // Regular users can only manage tasks assigned to them
  return tasks.filter(task => task.assignedTo === userId);
};

// Supplier-related functions
export const getSuppliers = () => {
  return suppliers;
};

export const getSupplierById = (id: number): any => {
  return suppliers.find(supplier => supplier.id === id);
};

export const getSupplierItems = (supplierId: number): InventoryItem[] => {
  const supplier = getSupplierById(supplierId);
  if (!supplier) return [];
  return inventoryItems.filter(item => item.supplier === supplier.name);
};

// Inventory-related functions
export const getInventoryItems = (): InventoryItem[] => {
  return inventoryItems;
};

export const getInventoryItemsByProjectId = (projectId: number): InventoryItem[] => {
  return inventoryItems.filter(item => item.projectId === projectId);
};

export const getInventoryItemsAccessibleByUser = (userId: number): InventoryItem[] => {
  const user = getUserById(userId);
  if (!user) return [];
  
  // Admins can access all inventory items
  if (user.role === 'admin') return inventoryItems;
  
  // Managers can access items for projects they manage
  if (user.role === 'manager') {
    const managedProjects = getProjectsManagedByUserId(userId);
    const managedProjectIds = managedProjects.map(project => project.id);
    
    return inventoryItems.filter(item => 
      !item.projectId || managedProjectIds.includes(item.projectId)
    );
  }
  
  // Regular users can only access items for projects they're assigned to
  const accessibleProjects = getProjectsByUserId(userId);
  const accessibleProjectIds = accessibleProjects.map(project => project.id);
  
  return inventoryItems.filter(item => 
    !item.projectId || accessibleProjectIds.includes(item.projectId)
  );
};

export const createInventoryItem = (item: Omit<InventoryItem, 'id'>): InventoryItem => {
  const newId = Math.max(...inventoryItems.map(i => i.id)) + 1;
  const newItem = { ...item, id: newId };
  inventoryItems.push(newItem);
  return newItem;
};

export const updateInventoryItem = (id: number, updates: Partial<InventoryItem>): InventoryItem | undefined => {
  const index = inventoryItems.findIndex(item => item.id === id);
  if (index !== -1) {
    inventoryItems[index] = { ...inventoryItems[index], ...updates };
    return inventoryItems[index];
  }
  return undefined;
};

export const deleteInventoryItem = (id: number): boolean => {
  const index = inventoryItems.findIndex(item => item.id === id);
  if (index !== -1) {
    inventoryItems.splice(index, 1);
    return true;
  }
  return false;
};

export const getInventoryStats = () => {
  const totalItems = inventoryItems.length;
  const totalValue = inventoryItems.reduce((sum, item) => sum + item.totalValue, 0);
  const lowStockItems = inventoryItems.filter(item => item.quantity <= item.lowStockThreshold).length;
  
  const categories = Object.entries(
    inventoryItems.reduce((acc, item) => {
      const category = item.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = { count: 0, value: 0 };
      }
      acc[category].count += 1;
      acc[category].value += item.totalValue;
      return acc;
    }, {} as Record<string, { count: number; value: number }>)
  ).map(([name, data]) => ({ name, count: data.count, value: data.value }));
  
  const locations = Object.entries(
    inventoryItems.reduce((acc, item) => {
      const location = item.location || 'Unknown';
      if (!acc[location]) {
        acc[location] = { count: 0, value: 0 };
      }
      acc[location].count += 1;
      acc[location].value += item.totalValue;
      return acc;
    }, {} as Record<string, { count: number; value: number }>)
  ).map(([name, data]) => ({ name, count: data.count, value: data.value }));
  
  const suppliers = Object.entries(
    inventoryItems.reduce((acc, item) => {
      const supplier = item.supplier || 'Unknown';
      if (!acc[supplier]) {
        acc[supplier] = { count: 0, value: 0 };
      }
      acc[supplier].count += 1;
      acc[supplier].value += item.totalValue;
      return acc;
    }, {} as Record<string, { count: number; value: number }>)
  ).map(([name, data]) => ({ name, count: data.count, value: data.value }));
  
  return {
    totalItems,
    totalValue,
    lowStockItems,
    categories,
    locations,
    suppliers
  };
};

export const getLocations = () => {
  return locations;
};

// RBAC helper functions
export const isUserAssignedToProject = (userId: number, projectId: number): boolean => {
  const project = getProjectById(projectId);
  return !!project && project.assignedUsers.includes(userId);
};

export const isUserManagerOfProject = (userId: number, projectId: number): boolean => {
  const project = getProjectById(projectId);
  if (!project) return false;
  
  return project.managerId === userId || 
    (project.managers && project.managers.includes(userId));
};

export const canUserAccessTask = (userId: number, taskId: number): boolean => {
  const task = getTaskById(taskId);
  if (!task) return false;
  
  const user = getUserById(userId);
  if (!user) return false;
  
  // Admins can access any task
  if (user.role === 'admin') return true;
  
  // Users can access tasks assigned to them
  if (task.assignedTo === userId) return true;
  
  // Users can access tasks in projects they're assigned to
  return isUserAssignedToProject(userId, task.projectId);
};

export const canUserManageTask = (userId: number, taskId: number): boolean => {
  const task = getTaskById(taskId);
  if (!task) return false;
  
  const user = getUserById(userId);
  if (!user) return false;
  
  // Admins can manage any task
  if (user.role === 'admin') return true;
  
  // Task creators can manage their own tasks
  if (task.createdBy === userId) return true;
  
  // Task assignees can manage their assigned tasks
  if (task.assignedTo === userId) return true;
  
  // Project managers can manage tasks in their projects
  return isUserManagerOfProject(userId, task.projectId);
}; 

// Dashboard data based on user role
export const getDashboardDataByUserRole = (userId: number): DashboardData => {
  const user = getUserById(userId);
  
  // Return default dashboard data for unknown users or admins
  if (!user || user.role === 'admin') {
    return dashboardData;
  }
  
  // Customize dashboard data based on user role and access
  const accessibleProjects = getProjectsByUserId(userId);
  const accessibleProjectIds = accessibleProjects.map(project => project.id);
  
  const accessibleTasks = getTasksAccessibleByUser(userId);
  
  // Calculate task counts by status for accessible tasks
  const tasksByStatus: Record<TaskStatus, number> = {
    'pending': 0,
    'in-progress': 0,
    'completed': 0,
    'cancelled': 0
  };
  
  accessibleTasks.forEach(task => {
    tasksByStatus[task.status]++;
  });
  
  // Filter activities related to accessible projects and tasks
  const relevantActivities = activities.filter(activity => {
    if (activity.type === 'project') {
      return accessibleProjectIds.includes(activity.entityId);
    }
    if (activity.type === 'task') {
      const task = getTaskById(activity.entityId);
      return task && accessibleProjectIds.includes(task.projectId);
    }
    return false;
  });
  
  // Sort activities by timestamp (newest first) and take the 5 most recent
  const recentActivity = relevantActivities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);
  
  return {
    totalProjects: accessibleProjects.length,
    totalUsers: users.length, // All users are visible regardless of role
    totalTasks: accessibleTasks.length,
    tasksByStatus,
    usersByRole: dashboardData.usersByRole, // User role distribution is visible to all
    projects: accessibleProjects.map(project => ({
      id: project.id,
      name: project.name,
      tasksCompleted: project.tasksCompleted,
      tasksTotal: project.tasksTotal
    })),
    recentActivity
  };
};
