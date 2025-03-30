
import { formatDistanceToNow } from 'date-fns';
import React from 'react';
import { 
  CheckCircle, 
  FileEdit, 
  FilePlus, 
  FileX, 
  FolderPlus, 
  UserPlus, 
  FolderEdit, 
  FolderX, 
  UserCog, 
  UserX
} from 'lucide-react';
import { Activity } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface RecentActivityProps {
  activities: Activity[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  // Function to get icon based on activity type and action
  const getActivityIcon = (type: string, action: string) => {
    if (type === 'task') {
      switch (action) {
        case 'created': return <FilePlus className="h-4 w-4" />;
        case 'updated': return <FileEdit className="h-4 w-4" />;
        case 'deleted': return <FileX className="h-4 w-4" />;
        case 'completed': return <CheckCircle className="h-4 w-4" />;
        default: return <FileEdit className="h-4 w-4" />;
      }
    } else if (type === 'project') {
      switch (action) {
        case 'created': return <FolderPlus className="h-4 w-4" />;
        case 'updated': return <FolderEdit className="h-4 w-4" />;
        case 'deleted': return <FolderX className="h-4 w-4" />;
        case 'completed': return <CheckCircle className="h-4 w-4" />;
        default: return <FolderEdit className="h-4 w-4" />;
      }
    } else if (type === 'user') {
      switch (action) {
        case 'created': return <UserPlus className="h-4 w-4" />;
        case 'updated': return <UserCog className="h-4 w-4" />;
        case 'deleted': return <UserX className="h-4 w-4" />;
        default: return <UserCog className="h-4 w-4" />;
      }
    }
    
    return <FileEdit className="h-4 w-4" />;
  };

  // Function to get background color based on activity type
  const getActivityBgColor = (type: string) => {
    switch (type) {
      case 'task': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
      case 'project': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400';
      case 'user': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
    }
  };

  // Function to format activity message
  const formatActivityMessage = (activity: Activity) => {
    const formattedAction = activity.action === 'created' 
      ? 'created' 
      : activity.action === 'updated' 
        ? 'updated' 
        : activity.action === 'deleted' 
          ? 'deleted' 
          : 'completed';
    
    return `${formattedAction} ${activity.type} "${activity.entityName}"`;
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest actions across your workspace
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 animate-in">
                <div className={`p-2 rounded-md ${getActivityBgColor(activity.type)}`}>
                  {getActivityIcon(activity.type, activity.action)}
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      {activity.userName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {formatActivityMessage(activity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No recent activity found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
