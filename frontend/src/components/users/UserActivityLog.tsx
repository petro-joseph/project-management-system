
import React, { useState } from 'react';
import { 
  Activity, 
  Clock, 
  Filter, 
  Download,
  Search
} from 'lucide-react';
import { UserActivity } from '@/lib/types';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock data for user activities
const mockUserActivities: UserActivity[] = [
  {
    id: 1,
    userId: 1,
    userName: 'John Doe',
    activityType: 'login',
    timestamp: '2023-06-01T09:23:42Z',
    details: 'Logged in from Chrome on Windows',
    ipAddress: '192.168.1.1',
  },
  {
    id: 2,
    userId: 1,
    userName: 'John Doe',
    activityType: 'task_created',
    timestamp: '2023-06-01T09:35:18Z',
    details: 'Created task: Update user interface',
    ipAddress: '192.168.1.1',
  },
  {
    id: 3,
    userId: 2,
    userName: 'Jane Smith',
    activityType: 'project_updated',
    timestamp: '2023-06-01T10:12:05Z',
    details: 'Updated project: E-commerce Platform',
    ipAddress: '192.168.1.2',
  },
  {
    id: 4,
    userId: 3,
    userName: 'Robert Johnson',
    activityType: 'task_completed',
    timestamp: '2023-06-01T11:42:31Z',
    details: 'Completed task: Database optimization',
    ipAddress: '192.168.1.3',
  },
  {
    id: 5,
    userId: 1,
    userName: 'John Doe',
    activityType: 'logout',
    timestamp: '2023-06-01T17:15:00Z',
    details: 'Logged out',
    ipAddress: '192.168.1.1',
  }
];

interface UserActivityLogProps {
  userId?: number; // Optional: Filter by specific user
}

const UserActivityLog: React.FC<UserActivityLogProps> = ({ userId }) => {
  const [activities, setActivities] = useState<UserActivity[]>(mockUserActivities);
  const [searchQuery, setSearchQuery] = useState('');
  const [activityTypeFilter, setActivityTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  // Filter activities
  const filteredActivities = activities
    .filter(activity => !userId || activity.userId === userId)
    .filter(activity => 
      activity.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.details.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(activity => 
      activityTypeFilter === 'all' || activity.activityType === activityTypeFilter
    )
    .filter(activity => {
      if (dateFilter === 'all') return true;
      
      const activityDate = new Date(activity.timestamp);
      const today = new Date();
      
      switch (dateFilter) {
        case 'today':
          return activityDate.toDateString() === today.toDateString();
        case 'yesterday':
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          return activityDate.toDateString() === yesterday.toDateString();
        case 'thisWeek':
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - today.getDay());
          return activityDate >= startOfWeek;
        case 'thisMonth':
          return activityDate.getMonth() === today.getMonth() && 
                 activityDate.getFullYear() === today.getFullYear();
        default:
          return true;
      }
    });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login':
      case 'logout':
        return <Activity className="h-4 w-4 text-blue-500" />;
      case 'task_created':
      case 'task_updated':
      case 'task_completed':
        return <Clock className="h-4 w-4 text-green-500" />;
      case 'project_created':
      case 'project_updated':
        return <Filter className="h-4 w-4 text-purple-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>User Activity Log</CardTitle>
            <CardDescription>
              Track user actions and system events
            </CardDescription>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Log
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search activities..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={activityTypeFilter} onValueChange={setActivityTypeFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Activity Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="logout">Logout</SelectItem>
                <SelectItem value="task_created">Task Created</SelectItem>
                <SelectItem value="task_updated">Task Updated</SelectItem>
                <SelectItem value="task_completed">Task Completed</SelectItem>
                <SelectItem value="project_created">Project Created</SelectItem>
                <SelectItem value="project_updated">Project Updated</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Date Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="thisWeek">This Week</SelectItem>
                <SelectItem value="thisMonth">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {filteredActivities.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead className="hidden md:table-cell">IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.map((activity) => (
                  <TableRow key={activity.id} className="hover:bg-secondary/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getActivityIcon(activity.activityType)}
                        <span className="capitalize">{activity.activityType.replace('_', ' ')}</span>
                      </div>
                    </TableCell>
                    <TableCell>{activity.userName}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{activity.details}</TableCell>
                    <TableCell>{format(new Date(activity.timestamp), 'MMM d, yyyy HH:mm')}</TableCell>
                    <TableCell className="hidden md:table-cell">{activity.ipAddress}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Activity className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No activities found</h3>
            <p className="text-muted-foreground max-w-md mt-2">
              {searchQuery || activityTypeFilter !== 'all' || dateFilter !== 'all'
                ? "Try adjusting your filters"
                : "No user activities have been recorded yet"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserActivityLog;
