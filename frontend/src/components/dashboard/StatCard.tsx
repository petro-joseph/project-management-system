
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FolderKanban, CheckSquare, CheckCircle, Users, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: 'projects' | 'tasks' | 'completed' | 'users';
  trend?: 'up' | 'down' | 'same';
  trendValue?: string;
  helperText?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  helperText
}) => {
  // Get icon component based on icon type
  const IconComponent = React.useMemo(() => {
    switch (icon) {
      case 'projects':
        return FolderKanban;
      case 'tasks':
        return CheckSquare;
      case 'completed':
        return CheckCircle;
      case 'users':
        return Users;
      default:
        return FolderKanban;
    }
  }, [icon]);

  // Get trend icon and color
  const TrendIcon = React.useMemo(() => {
    switch (trend) {
      case 'up':
        return TrendingUp;
      case 'down':
        return TrendingDown;
      case 'same':
      default:
        return Minus;
    }
  }, [trend]);

  const trendColor = React.useMemo(() => {
    switch (trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      case 'same':
      default:
        return 'text-gray-500';
    }
  }, [trend]);

  // Get icon background color based on icon type
  const iconBgColor = React.useMemo(() => {
    switch (icon) {
      case 'projects':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
      case 'tasks':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400';
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
      case 'users':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
    }
  }, [icon]);

  return (
    <Card className="overflow-hidden hover-scale glass-card">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            
            {trend && trendValue && (
              <div className="flex items-center mt-1 gap-1">
                <TrendIcon className={`h-3.5 w-3.5 ${trendColor}`} />
                <span className={`text-xs font-medium ${trendColor}`}>{trendValue}</span>
                {helperText && (
                  <span className="text-xs text-muted-foreground ml-1">{helperText}</span>
                )}
              </div>
            )}
          </div>
          
          <div className={`p-2 rounded-md ${iconBgColor}`}>
            <IconComponent className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
