
import React from 'react';
import { User, UserPerformanceMetrics, UserWorkload } from '@/lib/types';
import { 
  BarChart, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  PieChart,
  TrendingUp
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

// Mock performance data
const mockPerformanceData: UserPerformanceMetrics = {
  tasksCompleted: 78,
  tasksInProgress: 12,
  avgCompletionTime: 4.2, // hours
  onTimeCompletion: 92, // percentage
  efficiency: 85, // percentage
};

// Mock workload data
const mockWorkloadData: UserWorkload = {
  userId: 1,
  userName: 'John Doe',
  assignedTasks: 15,
  estimatedHours: 32,
  capacityUtilization: 75, // percentage
};

interface UserPerformanceProps {
  user: User;
  performanceMetrics?: UserPerformanceMetrics;
  workloadData?: UserWorkload;
}

const UserPerformance: React.FC<UserPerformanceProps> = ({ 
  user, 
  performanceMetrics = mockPerformanceData,
  workloadData = mockWorkloadData 
}) => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Performance & Workload</CardTitle>
        <CardDescription>
          Track performance metrics and current workload
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="performance" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="workload">Workload</TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">Tasks Completed</h3>
                  <span className="text-xl font-semibold flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-1" />
                    {performanceMetrics.tasksCompleted}
                  </span>
                </div>
                <Progress value={Math.min(100, (performanceMetrics.tasksCompleted / 100) * 100)} className="h-2" />
              </div>
              
              <div className="flex flex-col space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">Tasks In Progress</h3>
                  <span className="text-xl font-semibold flex items-center">
                    <Clock className="h-5 w-5 text-blue-500 mr-1" />
                    {performanceMetrics.tasksInProgress}
                  </span>
                </div>
                <Progress value={Math.min(100, (performanceMetrics.tasksInProgress / 20) * 100)} className="h-2" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="flex flex-col items-center p-3 border rounded-lg">
                <Clock className="h-8 w-8 text-foreground mb-2" />
                <span className="text-lg font-bold mb-1">{performanceMetrics.avgCompletionTime} hrs</span>
                <span className="text-xs text-muted-foreground text-center">Avg. Completion Time</span>
              </div>
              
              <div className="flex flex-col items-center p-3 border rounded-lg">
                <CheckCircle2 className="h-8 w-8 text-green-500 mb-2" />
                <span className="text-lg font-bold mb-1">{performanceMetrics.onTimeCompletion}%</span>
                <span className="text-xs text-muted-foreground text-center">On-Time Completion</span>
              </div>
              
              <div className="flex flex-col items-center p-3 border rounded-lg">
                <TrendingUp className="h-8 w-8 text-primary mb-2" />
                <span className="text-lg font-bold mb-1">{performanceMetrics.efficiency}%</span>
                <span className="text-xs text-muted-foreground text-center">Efficiency Rating</span>
              </div>
            </div>
            
            <div className="pt-2">
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-medium mb-2">Performance Insights</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                    <span>Completes tasks {performanceMetrics.efficiency > 80 ? 'efficiently' : 'within average time'}</span>
                  </li>
                  <li className="flex items-start">
                    {performanceMetrics.onTimeCompletion > 90 ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 mr-2" />
                    )}
                    <span>Delivers {performanceMetrics.onTimeCompletion}% of tasks on time</span>
                  </li>
                  <li className="flex items-start">
                    <TrendingUp className="h-4 w-4 text-primary mt-0.5 mr-2" />
                    <span>Performance trend: {performanceMetrics.efficiency > 80 ? 'Positive' : 'Neutral'}</span>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="workload" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">Assigned Tasks</h3>
                  <span className="text-xl font-semibold">{workloadData.assignedTasks}</span>
                </div>
                <Progress 
                  value={Math.min(100, (workloadData.assignedTasks / 20) * 100)} 
                  className={`h-2 ${workloadData.assignedTasks > 15 ? 'bg-amber-500' : ''}`} 
                />
              </div>
              
              <div className="flex flex-col space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">Capacity Utilization</h3>
                  <span className="text-xl font-semibold">{workloadData.capacityUtilization}%</span>
                </div>
                <Progress 
                  value={workloadData.capacityUtilization} 
                  className={`h-2 ${workloadData.capacityUtilization > 90 ? 'bg-red-500' : workloadData.capacityUtilization > 75 ? 'bg-amber-500' : ''}`} 
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg mt-4">
              <div>
                <h3 className="font-medium">Estimated Working Hours</h3>
                <p className="text-sm text-muted-foreground">This week</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{workloadData.estimatedHours}</p>
                <p className="text-sm text-muted-foreground">hours</p>
              </div>
            </div>
            
            <div className="pt-2">
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-medium mb-2">Workload Status</h3>
                <div className="flex items-center mt-1">
                  {workloadData.capacityUtilization > 90 ? (
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                  ) : workloadData.capacityUtilization > 75 ? (
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  )}
                  <div>
                    <p className="font-medium">
                      {workloadData.capacityUtilization > 90 
                        ? 'Overallocated' 
                        : workloadData.capacityUtilization > 75 
                          ? 'High workload' 
                          : 'Optimal workload'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {workloadData.capacityUtilization > 90 
                        ? 'Consider redistributing tasks' 
                        : workloadData.capacityUtilization > 75 
                          ? 'Monitor for potential overload' 
                          : 'Current workload is manageable'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserPerformance;
