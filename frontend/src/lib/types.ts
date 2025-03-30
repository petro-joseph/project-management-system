export type Role = 'admin' | 'manager' | 'user';
export type AvailabilityStatus = 'available' | 'busy' | 'away' | 'offline';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  avatar?: string;
  availability?: AvailabilityStatus;
  skills?: string[];
  department?: string;
  performanceMetrics?: UserPerformanceMetrics;
  onboardingProgress?: number;
  assignedProjects?: number[]; // IDs of projects this user is assigned to
  managedProjects?: number[]; // IDs of projects this user manages (for managers/admins)
  assignedTasks?: number[]; // IDs of tasks assigned to this user
}

export interface UserPerformanceMetrics {
  tasksCompleted: number;
  tasksInProgress: number;
  avgCompletionTime: number; // in hours
  onTimeCompletion: number; // percentage
  efficiency: number; // percentage based on estimated vs actual time
}

export interface UserActivity {
  id: number;
  userId: number;
  userName: string;
  activityType: 'login' | 'logout' | 'task_created' | 'task_updated' | 'task_completed' | 'project_created' | 'project_updated';
  timestamp: string;
  details: string;
  ipAddress?: string;
}

export interface UserMessage {
  id: number;
  senderId: number;
  senderName: string;
  recipientId: number;
  recipientName: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface UserWorkload {
  userId: number;
  userName: string;
  assignedTasks: number;
  estimatedHours: number;
  capacityUtilization: number; // percentage
}

export interface OnboardingResource {
  id: number;
  title: string;
  description: string;
  type: 'video' | 'article' | 'quiz' | 'interactive';
  content: string;
  duration: number; // in minutes
  requiredForRoles: Role[];
}

export interface Project {
  id: number;
  name: string;
  description: string;
  tasksCompleted: number;
  tasksTotal: number;
  createdAt: string;
  dueDate: string;
  status: 'planned' | 'in-progress' | 'completed' | 'on-hold' | 'archived';
  assignedUsers: number[]; // User IDs
  milestones?: ProjectMilestone[];
  budget?: ProjectBudget;
  timeline?: ProjectTimeline;
  managerId?: number; // User ID of the primary manager responsible
  managers?: number[]; // User IDs of all managers assigned to the project
  relatedInventory?: number[]; // IDs of inventory items assigned to this project
}

export interface ProjectMilestone {
  id: number;
  name: string;
  description: string;
  dueDate: string;
  completed: boolean;
  completedDate?: string;
  assignedTo?: number; // User ID responsible for this milestone
  relatedTasks?: number[]; // Task IDs that contribute to this milestone
}

export interface ProjectBudget {
  total: number;
  spent: number;
  currency: string;
  expenses: ProjectExpense[];
  budgetCategories?: ProjectBudgetCategory[]; // Optional budget allocation by category
}

export interface ProjectBudgetCategory {
  id: number;
  name: string; // e.g., "Materials", "Labor", "Software"
  allocated: number; // Amount allocated to this category
  spent: number; // Amount spent in this category
}

export interface ProjectExpense {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: string;
  approvedBy?: number; // User ID who approved the expense
  receipt?: string; // URL to receipt image/document
}

export interface ProjectTimeline {
  startDate: string;
  endDate: string;
  phases: ProjectPhase[];
}

export interface ProjectPhase {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  color: string;
  description?: string;
  completionPercentage?: number;
}

export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  projectId: number;
  assignedTo: number; // User ID
  createdBy: number; // User ID
  createdAt: string;
  dueDate: string;
  dependencies?: number[]; // Task IDs that this task depends on
  timeTracking?: TaskTimeTracking;
  notificationSettings?: TaskNotification;
  milestone?: number; // ID of the milestone this task contributes to
  requiredInventory?: TaskInventoryRequirement[]; // Inventory items required for this task
}

export interface TaskInventoryRequirement {
  inventoryId: number;
  requiredQuantity: number;
  allocated: boolean; // Whether the inventory has been allocated
}

export interface TaskTimeTracking {
  estimatedHours: number;
  loggedTime: TaskTimeLog[];
  totalTimeSpent: number; // in minutes
}

export interface TaskTimeLog {
  id: number;
  startTime: string;
  endTime?: string;
  duration: number; // in minutes
  note?: string;
  userId: number;
}

export interface TaskNotification {
  reminderDays: number; // days before due date
  reminderHours: number; // hours before due date
  notifyAssignee: boolean;
  notifyCreator: boolean;
  additionalEmails?: string[];
}

export interface Activity {
  id: number;
  type: 'task' | 'project' | 'user' | 'inventory';
  action: 'created' | 'updated' | 'deleted' | 'completed' | 'assigned' | 'unassigned';
  entityId: number;
  entityName: string;
  userId: number;
  userName: string;
  timestamp: string;
  projectId?: number; // Optional reference to related project
}

export interface DashboardData {
  totalProjects: number;
  totalUsers: number;
  totalTasks: number;
  tasksByStatus: {
    pending: number;
    'in-progress': number;
    completed: number;
    cancelled: number;
  };
  usersByRole: {
    admins: number;
    managers: number;
    users: number;
  };
  projects: {
    id: number;
    name: string;
    tasksCompleted: number;
    tasksTotal: number;
  }[];
  recentActivity: Activity[];
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  role: Role | null;
  loading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  hasPermission: (requiredRoles: Role[]) => boolean;
  canAccessProject: (projectId: number) => boolean;
  canManageProject: (projectId: number) => boolean;
  canAccessTask: (taskId: number, projectId: number) => boolean;
  canManageTask: (taskId: number, projectId: number, taskAssigneeId?: number) => boolean;
  canAccessInventory: (inventoryId: number, projectId?: number) => boolean;
  getAccessibleProjects: () => Project[];
  isProjectManager: () => boolean;
  getProjectsUserManages: () => Project[];
}

export interface InventoryItem {
  id: number;
  name: string;
  description: string;
  quantity: number;
  unitOfMeasure: string;
  location: string;
  projectId: number | null;
  purchaseDate: string;
  supplier: string;
  costPerUnit: number;
  totalValue: number;
  lowStockThreshold: number;
  image?: string;
  barcode?: string;
  assignedToTasks?: number[]; // Task IDs that this inventory is assigned to
  category?: string; // e.g., "Equipment", "Materials", "Office Supplies"
  status?: 'available' | 'assigned' | 'depleted' | 'on-order';
  lastStockCheck?: string; // Date of last inventory check
  reorderPoint?: number; // Quantity at which to reorder
  reorderQuantity?: number; // How much to order when reordering
  valuationMethod?: 'FIFO' | 'LIFO' | 'average'; // Cost tracking method
  priceHistory?: InventoryPriceRecord[]; // History of price changes
  supplierId?: number; // Reference to supplier
  stockByLocation?: InventoryLocationStock[]; // Stock levels by location
}

export interface InventoryLocationStock {
  locationId: number;
  locationName: string;
  quantity: number;
  lastUpdated: string;
}

export interface InventoryPriceRecord {
  date: string;
  price: number;
  reason?: string;
}

export interface InventoryLocation {
  id: number;
  name: string;
  address?: string;
  type: 'warehouse' | 'site' | 'store' | 'vehicle';
  manager?: number; // User ID of location manager
  capacity?: number;
  currentUtilization?: number; // percentage
}

export interface Supplier {
  id: number;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  notes?: string;
  rating?: number; // 1-5 rating
  items?: number[]; // IDs of inventory items provided by this supplier
  performanceMetrics?: SupplierPerformanceMetrics;
}

export interface SupplierPerformanceMetrics {
  onTimeDeliveryRate: number; // percentage
  qualityRating: number; // 1-5 rating
  responseTime: number; // hours
  averageLeadTime: number; // days
  lastEvaluation?: string; // date of last evaluation
}

export interface PurchaseOrder {
  id: number;
  supplierId: number;
  supplierName: string;
  status: 'draft' | 'sent' | 'confirmed' | 'received' | 'cancelled';
  createdAt: string;
  createdBy: number; // User ID
  approvedBy?: number; // User ID
  expectedDelivery?: string;
  actualDelivery?: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  notes?: string;
  attachments?: string[]; // URLs to documents
}

export interface PurchaseOrderItem {
  inventoryId: number;
  inventoryName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

export interface InventoryTransaction {
  id: number;
  inventoryId: number;
  type: 'add' | 'remove' | 'transfer' | 'adjust';
  quantity: number;
  date: string;
  userId: number; // User who performed the transaction
  fromLocation?: number; // Location ID (for transfers)
  toLocation?: number; // Location ID (for transfers)
  taskId?: number; // Task ID (if related to a task)
  projectId?: number; // Project ID (if related to a project)
  purchaseOrderId?: number; // Purchase Order ID (if related to a PO)
  notes?: string;
}

export interface InventoryReport {
  id: number;
  name: string;
  type: 'stock_levels' | 'valuation' | 'transactions' | 'low_stock' | 'expiring' | 'custom';
  createdAt: string;
  createdBy: number; // User ID
  filters?: Record<string, any>;
  lastGenerated?: string;
  schedule?: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  recipients?: string[]; // email addresses
  format?: 'pdf' | 'csv' | 'excel';
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  userId: number;
  link?: string;
  relatedEntity?: {
    type: 'project' | 'task' | 'user' | 'inventory' | 'supplier' | 'purchaseOrder';
    id: number;
  };
}

export type DepreciationMethod = 'straight-line' | 'reducing-balance' | 'units-of-production' | 'sum-of-years-digits';
export type AssetStatus = 'active' | 'fully-depreciated' | 'disposed' | 'impaired';

export interface AssetCategory {
  id: number;
  name: string;
  description: string;
  defaultUsefulLifeMin: number; // in years
  defaultUsefulLifeMax: number; // in years
  defaultDepreciationMethod: DepreciationMethod;
  defaultSalvageValuePercent: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: number; // User ID
}

export interface FixedAsset {
  id: number;
  assetTag: string;
  name: string;
  description: string;
  categoryId: number;
  acquisitionDate: string;
  originalCost: number;
  usefulLife: number; // in years
  depreciationMethod: DepreciationMethod;
  salvageValue: number;
  currentValue: number; // current book value
  accumulatedDepreciation: number;
  status: AssetStatus;
  location: string;
  custodian: number; // User ID
  serialNumber?: string;
  lastDepreciationDate?: string;
  disposalDate?: string;
  disposalProceeds?: number;
  disposalReason?: string;
  revaluations?: AssetRevaluation[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: number; // User ID
}

export interface AssetRevaluation {
  id: number;
  assetId: number;
  revaluationDate: string;
  previousValue: number;
  newValue: number;
  reason: string;
  type: 'revaluation' | 'impairment';
  notes?: string;
  createdAt: string;
  createdBy: number; // User ID
}

export interface DepreciationEntry {
  id: number;
  assetId: number;
  period: string; // YYYY-MM
  amount: number;
  bookValueBefore: number;
  bookValueAfter: number;
  postingDate: string;
  createdAt: string;
  createdBy: number; // User ID
}

export interface DisposalEntry {
  id: number;
  assetId: number;
  disposalDate: string;
  disposalProceeds: number;
  disposalCosts: number;
  netBookValue: number;
  gainLoss: number;
  reason: string;
  notes?: string;
  createdAt: string;
  createdBy: number; // User ID
}
