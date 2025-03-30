
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';
import { Role } from '@/lib/types';

interface MainLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: Role[];
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  requireAuth = true,
  allowedRoles = []
}) => {
  const { isAuthenticated, loading, hasPermission } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Manage sidebar open/close state
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Show loading state if auth is being checked
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin-slow h-12 w-12 rounded-full border-t-2 border-primary"></div>
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (requireAuth && isAuthenticated && allowedRoles.length > 0) {
    const hasRequiredRole = hasPermission(allowedRoles);
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Return the layout for authenticated users
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar open={sidebarOpen} />
        
        <main className={`flex-1 transition-all duration-300 ease-in-out overflow-auto ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <div className="p-6 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
