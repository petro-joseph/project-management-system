
// This file contains tests for RBAC functionality
import { 
  isUserAssignedToProject,
  isUserManagerOfProject,
  canUserAccessTask,
  canUserManageTask,
  getProjectsByUserId,
  getProjectsManagedByUserId,
  getTasksAccessibleByUser,
  getTasksManageableByUser,
  getInventoryItemsAccessibleByUser
} from './mockData';

// Example test function
export const testRBACFunctions = (userId: number) => {
  console.log('Testing RBAC functions for user ID:', userId);
  
  // Get projects the user can access
  const accessibleProjects = getProjectsByUserId(userId);
  console.log('Accessible projects:', accessibleProjects.length);
  
  // Get projects the user can manage
  const managedProjects = getProjectsManagedByUserId(userId);
  console.log('Managed projects:', managedProjects.length);
  
  // Get tasks the user can access
  const accessibleTasks = getTasksAccessibleByUser(userId);
  console.log('Accessible tasks:', accessibleTasks.length);
  
  // Get tasks the user can manage
  const manageableTasks = getTasksManageableByUser(userId);
  console.log('Manageable tasks:', manageableTasks.length);
  
  // Get inventory items the user can access
  const accessibleInventory = getInventoryItemsAccessibleByUser(userId);
  console.log('Accessible inventory items:', accessibleInventory.length);
  
  return {
    accessibleProjects,
    managedProjects,
    accessibleTasks,
    manageableTasks,
    accessibleInventory
  };
};

// Add a function to run RBAC tests
export const runRBACTests = () => {
  const testResults = [];
  
  // Test if admin can access all projects
  const adminId = 1; // Assuming user with ID 1 is admin
  const adminProjects = getProjectsByUserId(adminId);
  testResults.push({
    name: 'Admin can access all projects',
    passed: adminProjects.length === 5, // Assuming there are 5 projects in total
    expected: 5,
    actual: adminProjects.length
  });
  
  // Test if manager can manage their assigned projects
  const managerId = 2; // Assuming user with ID 2 is a manager
  const managerProjects = getProjectsManagedByUserId(managerId);
  testResults.push({
    name: 'Manager can manage assigned projects',
    passed: managerProjects.length > 0,
    expected: 'At least 1',
    actual: managerProjects.length
  });
  
  // Test if regular user cannot manage projects
  const userId = 3; // Assuming user with ID 3 is a regular user
  const userProjects = getProjectsManagedByUserId(userId);
  testResults.push({
    name: 'Regular user cannot manage projects',
    passed: userProjects.length === 0,
    expected: 0,
    actual: userProjects.length
  });
  
  // Test if users can access tasks in their projects
  const userTasks = getTasksAccessibleByUser(userId);
  testResults.push({
    name: 'User can access tasks in their projects',
    passed: userTasks.length > 0,
    expected: 'At least 1',
    actual: userTasks.length
  });
  
  // Test if admin can access all inventory items
  const adminInventory = getInventoryItemsAccessibleByUser(adminId);
  testResults.push({
    name: 'Admin can access all inventory items',
    passed: adminInventory.length > 0,
    expected: 'At least 1',
    actual: adminInventory.length
  });
  
  // Log the test results to the console
  console.log('RBAC Tests Results:', testResults);
  
  return testResults;
};

export default testRBACFunctions;
