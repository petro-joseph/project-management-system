
import React, { ReactNode, useEffect, useState } from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface RBACErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  requiredPermission?: 'view' | 'manage';
  resourceType?: 'project' | 'task' | 'inventory' | 'user';
  resourceId?: number;
  projectId?: number;
  onPermissionDenied?: () => void;
}

const RBACErrorBoundary: React.FC<RBACErrorBoundaryProps> = ({
  children,
  fallback,
  requiredPermission = 'view',
  resourceType,
  resourceId,
  projectId,
  onPermissionDenied
}) => {
  const { 
    isAuthenticated, 
    hasPermission, 
    canAccessProject, 
    canManageProject,
    canAccessTask,
    canManageTask,
    canAccessInventory,
    user
  } = useAuth();
  
  const navigate = useNavigate();
  const [hasPermissionToAccess, setHasPermissionToAccess] = useState<boolean>(true);

  useEffect(() => {
    let hasAccess = true;

    if (!isAuthenticated) {
      hasAccess = false;
    } else if (resourceType === 'project' && resourceId) {
      if (requiredPermission === 'view') {
        hasAccess = canAccessProject(resourceId);
      } else if (requiredPermission === 'manage') {
        hasAccess = canManageProject(resourceId);
      }
    } else if (resourceType === 'task' && resourceId && projectId) {
      if (requiredPermission === 'view') {
        hasAccess = canAccessTask(resourceId, projectId);
      } else if (requiredPermission === 'manage') {
        hasAccess = canManageTask(resourceId, projectId);
      }
    } else if (resourceType === 'inventory' && resourceId) {
      hasAccess = canAccessInventory(resourceId, projectId);
    } else if (resourceType === 'user') {
      hasAccess = hasPermission(['admin']);
    }

    setHasPermissionToAccess(hasAccess);
    
    if (!hasAccess && onPermissionDenied) {
      onPermissionDenied();
    }
  }, [
    isAuthenticated,
    resourceType,
    resourceId,
    projectId,
    requiredPermission,
    canAccessProject,
    canManageProject,
    canAccessTask,
    canManageTask,
    canAccessInventory,
    hasPermission,
    onPermissionDenied
  ]);

  if (!hasPermissionToAccess) {
    if (fallback) return <>{fallback}</>;
    
    return (
      <Alert variant="destructive" className="my-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>
          <div className="mt-2">
            {!isAuthenticated ? (
              <p>You need to be logged in to access this resource.</p>
            ) : (
              <p>
                You don't have permission to {requiredPermission}{' '}
                {resourceType && `this ${resourceType}`}.
              </p>
            )}
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
            {!isAuthenticated && (
              <Button
                size="sm"
                onClick={() => navigate('/login')}
              >
                Log In
              </Button>
            )}
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
};

export default RBACErrorBoundary;
