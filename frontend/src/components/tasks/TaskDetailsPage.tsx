
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, AlertTriangle, CheckSquare } from 'lucide-react';
import { Task } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { getTaskById, getUserById, getProjectById, updateTask } from '@/lib/mockData';
import TaskDependencies from './TaskDependencies';
import TaskTimeTracking from './TaskTimeTracking';

const TaskDetailsPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const foundTask = getTaskById(Number(taskId));
        
        if (foundTask) {
          setTask(foundTask);
        } else {
          toast.error("Task not found");
          navigate('/tasks');
        }
      } catch (error) {
        console.error('Error fetching task:', error);
        toast.error("Failed to load task details");
      } finally {
        setLoading(false);
      }
    };

    if (taskId) {
      fetchTask();
    }
  }, [taskId, navigate]);

  const handleUpdateDependencies = async (dependencies: number[]) => {
    if (!task) return;
    
    try {
      const updatedTask = await updateTask(task.id, { dependencies });
      if (updatedTask) {
        setTask(updatedTask);
        toast.success("Dependencies updated successfully");
      }
    } catch (error) {
      console.error('Error updating dependencies:', error);
      toast.error("Failed to update dependencies");
      throw error;
    }
  };
  
  const handleUpdateTimeTracking = async (timeTracking: Task['timeTracking']) => {
    if (!task) return;
    
    try {
      const updatedTask = await updateTask(task.id, { timeTracking });
      if (updatedTask) {
        setTask(updatedTask);
        return Promise.resolve();
      }
      return Promise.reject("Failed to update task");
    } catch (error) {
      console.error('Error updating time tracking:', error);
      toast.error("Failed to update time tracking");
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin-slow h-12 w-12 rounded-full border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="space-y-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/tasks')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tasks
        </Button>
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Task Not Found</h2>
          <p className="text-muted-foreground">The requested task does not exist or has been deleted.</p>
        </div>
      </div>
    );
  }

  const assignedUser = getUserById(task.assignedTo);
  const project = getProjectById(task.projectId);
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return { 
          variant: 'destructive' as const, 
          label: 'High', 
          icon: <AlertTriangle className="h-3.5 w-3.5 mr-1" /> 
        };
      case 'medium':
        return { 
          variant: 'default' as const, 
          label: 'Medium', 
          icon: <Clock className="h-3.5 w-3.5 mr-1" /> 
        };
      case 'low':
        return { 
          variant: 'outline' as const, 
          label: 'Low', 
          icon: <CheckSquare className="h-3.5 w-3.5 mr-1" /> 
        };
      default:
        return { variant: 'outline' as const, label: priority, icon: null };
    }
  };
  
  const priorityBadge = getPriorityBadge(task.priority);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/tasks')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tasks
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Task Details</h1>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 md:items-start">
            <div className="flex-1">
              <CardTitle className="text-2xl">{task.title}</CardTitle>
              <CardDescription className="text-base mt-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={priorityBadge.variant} className="flex items-center mt-2">
                    {priorityBadge.icon}
                    {priorityBadge.label} Priority
                  </Badge>
                  
                  <Badge className="mt-2">
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </Badge>
                  
                  {project && (
                    <Badge variant="outline" className="mt-2">
                      Project: {project.name}
                    </Badge>
                  )}
                </div>
              </CardDescription>
            </div>
            
            {assignedUser && (
              <div className="flex items-center gap-2 p-3 border rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={assignedUser.avatar} alt={assignedUser.name} />
                  <AvatarFallback>
                    {assignedUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium">{assignedUser.name}</div>
                  <div className="text-xs text-muted-foreground">Assigned To</div>
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-3 border rounded-lg">
              <div className="text-sm text-muted-foreground">Created</div>
              <div className="font-medium">{new Date(task.createdAt).toLocaleDateString()}</div>
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="text-sm text-muted-foreground">Due Date</div>
              <div className="font-medium">{new Date(task.dueDate).toLocaleDateString()}</div>
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="text-sm text-muted-foreground">Created By</div>
              <div className="font-medium">
                {getUserById(task.createdBy)?.name || `User #${task.createdBy}`}
              </div>
            </div>
          </div>
          
          <div className="bg-secondary/30 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <p className="text-muted-foreground whitespace-pre-line">{task.description}</p>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="timeTracking" className="space-y-6">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="timeTracking">Time Tracking</TabsTrigger>
          <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
        </TabsList>
        
        <TabsContent value="timeTracking" className="space-y-6 mt-6">
          <TaskTimeTracking 
            task={task} 
            onUpdateTimeTracking={handleUpdateTimeTracking} 
          />
        </TabsContent>
        
        <TabsContent value="dependencies" className="space-y-6 mt-6">
          <TaskDependencies 
            task={task} 
            onUpdate={handleUpdateDependencies} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaskDetailsPage;
