
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { AuthContextType, User, Role, Project, Task } from '@/lib/types';
import { findUserByEmail, getProjectsByUserId, getProjectById, getTasksByProjectId } from '@/lib/mockData';

// Default auth context
const defaultAuthContext: AuthContextType = {
  isAuthenticated: false,
  user: null,
  role: null,
  loading: true,
  error: null,
  login: async () => {
    throw new Error('login function not implemented');
  },
  logout: () => {
    throw new Error('logout function not implemented');
  },
  register: async () => {
    throw new Error('register function not implemented');
  },
  hasPermission: () => false,
  canAccessProject: () => false,
  canManageProject: () => false,
  canAccessTask: () => false,
  canManageTask: () => false,
  canAccessInventory: () => false,
  getAccessibleProjects: () => [],
  isProjectManager: () => false,
  getProjectsUserManages: () => [],
};

// Create the auth context
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [accessibleProjects, setAccessibleProjects] = useState<Project[]>([]);
  const [managedProjects, setManagedProjects] = useState<Project[]>([]);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('erp_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setRole(userData.role);
          setIsAuthenticated(true);
          
          // Load user's accessible projects
          if (userData.id) {
            const projects = getProjectsByUserId(userData.id);
            setAccessibleProjects(projects);
            
            // If user is a project manager, set projects they manage
            if (userData.role === 'manager') {
              const managed = projects.filter(project => 
                project.managerId === userData.id || 
                (project.managers && project.managers.includes(userData.id))
              );
              setManagedProjects(managed);
            }
          }
        }
      } catch (error) {
        console.error('Failed to restore authentication:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would call an API
      // For now, we'll simulate with a delay and mock data
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const user = findUserByEmail(email);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // In a real app, we would validate the password here
      // For our mock, we'll just assume it's correct
      
      setUser(user);
      setRole(user.role);
      setIsAuthenticated(true);
      
      // Load user's accessible projects
      if (user.id) {
        const projects = getProjectsByUserId(user.id);
        setAccessibleProjects(projects);
        
        // If user is a project manager, set projects they manage
        if (user.role === 'manager') {
          const managed = projects.filter(project => 
            project.managerId === user.id || 
            (project.managers && project.managers.includes(user.id))
          );
          setManagedProjects(managed);
        }
      }
      
      // Store in localStorage for persistence
      localStorage.setItem('erp_user', JSON.stringify(user));
      
      toast.success('Login successful', {
        description: `Welcome back, ${user.name}!`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to login';
      setError(message);
      toast.error('Login failed', {
        description: message,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
    setAccessibleProjects([]);
    setManagedProjects([]);
    localStorage.removeItem('erp_user');
    
    toast.success('Logged out successfully', {
      description: 'You have been logged out of your account.',
    });
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would call an API
      // For now, we'll simulate with a delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const existingUser = findUserByEmail(email);
      
      if (existingUser) {
        throw new Error('Email already exists');
      }
      
      // In a real app, we would create a new user here
      // For our mock, we'll just pretend it succeeded
      
      toast.success('Registration successful', {
        description: 'Your account has been created successfully.',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to register';
      setError(message);
      toast.error('Registration failed', {
        description: message,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Role-based permission check
  const hasPermission = (requiredRoles: Role[] = []) => {
    if (!isAuthenticated || !user) return false;
    if (requiredRoles.length === 0) return true;
    return requiredRoles.includes(user.role);
  };

  // Project access permission check
  const canAccessProject = (projectId: number) => {
    if (!isAuthenticated || !user) return false;
    
    // Admins can access all projects
    if (user.role === 'admin') return true;
    
    // Check if the project is in user's accessible projects
    return accessibleProjects.some(project => project.id === projectId);
  };

  // Project management permission check
  const canManageProject = (projectId: number) => {
    if (!isAuthenticated || !user) return false;
    
    // Admins can manage all projects
    if (user.role === 'admin') return true;
    
    // Managers can only manage projects they are assigned to manage
    if (user.role === 'manager') {
      return managedProjects.some(project => project.id === projectId);
    }
    
    // Regular users cannot manage projects
    return false;
  };

  // Check if user is a project manager
  const isProjectManager = () => {
    if (!isAuthenticated || !user) return false;
    return user.role === 'admin' || user.role === 'manager';
  };

  // Get projects the user manages
  const getProjectsUserManages = (): Project[] => {
    if (!isAuthenticated || !user) return [];
    
    if (user.role === 'admin') {
      // Admin manages all accessible projects
      return accessibleProjects;
    }
    
    if (user.role === 'manager') {
      return managedProjects;
    }
    
    return [];
  };

  // Task access permission check
  const canAccessTask = (taskId: number, projectId: number) => {
    if (!isAuthenticated || !user) return false;
    
    // First, check if the user can access the project
    if (!canAccessProject(projectId)) return false;
    
    // If user can access the project, they can access tasks in it
    return true;
  };

  // Task management permission check
  const canManageTask = (taskId: number, projectId: number, taskAssigneeId?: number) => {
    if (!isAuthenticated || !user) return false;
    
    // Admins can manage all tasks
    if (user.role === 'admin') return true;
    
    // Project managers can manage all tasks in their projects
    if (user.role === 'manager' && managedProjects.some(project => project.id === projectId)) {
      return true;
    }
    
    // Regular users can only manage tasks assigned to them
    if (taskAssigneeId && taskAssigneeId === user.id) return true;
    
    return false;
  };

  // Inventory access permission check based on project
  const canAccessInventory = (inventoryId: number, projectId?: number) => {
    if (!isAuthenticated || !user) return false;
    
    // Admins can access all inventory
    if (user.role === 'admin') return true;
    
    // If inventory is not associated with a project, only admins and managers can access it
    if (!projectId) return user.role === 'manager';
    
    // For project-related inventory, check project access
    return canAccessProject(projectId);
  };

  // Get accessible projects for the current user
  const getAccessibleProjects = (): Project[] => {
    if (!isAuthenticated || !user) return [];
    return accessibleProjects;
  };

  // Auth context value with enhanced RBAC
  const value: AuthContextType = {
    isAuthenticated,
    user,
    role,
    loading,
    error,
    login,
    logout,
    register,
    hasPermission,
    canAccessProject,
    canManageProject,
    canAccessTask,
    canManageTask,
    canAccessInventory,
    getAccessibleProjects,
    isProjectManager,
    getProjectsUserManages,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
