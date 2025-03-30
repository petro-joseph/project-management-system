import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  CheckSquare, 
  Clock, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  FileEdit,
  Trash2,
  ExternalLink,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { tasks as mockTasks, getUserById, getProjectById } from '@/lib/mockData';
import { Task } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import AddEditTaskDialog from './AddEditTaskDialog';
import ConfirmationDialog from '@/components/shared/ConfirmationDialog';

const TasksPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [addTaskOpen, setAddTaskOpen] = useState<boolean>(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<number | null>(null);
  
  const canManageTasks = user && ['admin', 'manager'].includes(user.role);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setTasks(mockTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast.error("Failed to load tasks. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  const filteredTasks = searchQuery 
    ? tasks.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tasks;

  const pendingTasks = filteredTasks.filter(task => task.status === 'pending');
  const inProgressTasks = filteredTasks.filter(task => task.status === 'in-progress');
  const completedTasks = filteredTasks.filter(task => task.status === 'completed');

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'in-progress':
        return <CheckSquare className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return null;
    }
  };

  const handleCreateTask = async (data: any) => {
    try {
      const newTask: Task = {
        id: Date.now(),
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        projectId: data.projectId,
        assignedTo: data.assignedTo,
        createdBy: user?.id || 1,
        createdAt: new Date().toISOString(),
        dueDate: data.dueDate.toISOString(),
      };

      setTasks([newTask, ...tasks]);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error creating task:', error);
      return Promise.reject(error);
    }
  };

  const handleUpdateTask = async (data: any) => {
    if (!editTask) return Promise.reject('No task selected');
    
    try {
      const updatedTask: Task = {
        ...editTask,
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        projectId: data.projectId,
        assignedTo: data.assignedTo,
        dueDate: data.dueDate.toISOString(),
      };

      setTasks(tasks.map(t => t.id === editTask.id ? updatedTask : t));
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error updating task:', error);
      return Promise.reject(error);
    }
  };

  const handleDeleteTask = async () => {
    if (deleteTaskId === null) return;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const taskName = tasks.find(t => t.id === deleteTaskId)?.title || 'Task';
      
      toast.success("Task deleted", {
        description: `${taskName} has been deleted.`,
        action: {
          label: "Undo",
          onClick: () => {
            toast.success("Action undone", {
              description: `${taskName} has been restored.`
            });
          }
        }
      });
      
      setTasks(tasks.filter(t => t.id !== deleteTaskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error("Failed to delete task. Please try again.");
    } finally {
      setDeleteTaskId(null);
    }
  };

  const handleUpdateTaskStatus = async (taskId: number, newStatus: string) => {
    try {
      const taskToUpdate = tasks.find(t => t.id === taskId);
      if (!taskToUpdate) return;
      
      const updatedTask: Task = {
        ...taskToUpdate,
        status: newStatus as any,
      };
      
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
      
      toast.success("Task status updated", {
        description: `${updatedTask.title} is now ${newStatus.replace('-', ' ')}.`
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error("Failed to update task status. Please try again.");
    }
  };

  const handleViewTaskDetails = (taskId: number) => {
    navigate(`/tasks/${taskId}`);
  };

  const renderTaskTable = (tasksToRender: Task[]) => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin-slow h-12 w-12 rounded-full border-t-2 border-primary"></div>
        </div>
      );
    }

    if (tasksToRender.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <CheckSquare className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No tasks found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery 
              ? `No tasks matching "${searchQuery}"`
              : "There are no tasks in this category"}
          </p>
          {canManageTasks && (
            <Button onClick={() => setAddTaskOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create new task
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Status</TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasksToRender.map((task) => {
              const priorityBadge = getPriorityBadge(task.priority);
              const assignedUser = getUserById(task.assignedTo);
              const project = getProjectById(task.projectId);
              
              return (
                <TableRow 
                  key={task.id} 
                  className="hover:bg-secondary/50 cursor-pointer"
                  onClick={() => handleViewTaskDetails(task.id)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    {getStatusIcon(task.status)}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{task.title}</span>
                      <span className="text-xs text-muted-foreground truncate max-w-[300px]">
                        {task.description}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Badge variant={priorityBadge.variant} className="flex items-center w-fit">
                      {priorityBadge.icon}
                      {priorityBadge.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {project?.name || 'Unknown Project'}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={assignedUser?.avatar} alt={assignedUser?.name} />
                        <AvatarFallback>
                          {assignedUser?.name?.split(' ').map(n => n[0]).join('') || '??'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{assignedUser?.name || 'Unassigned'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(task.dueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleViewTaskDetails(task.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setEditTask(task)}
                      >
                        <FileEdit className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {task.status !== 'completed' && (
                            <DropdownMenuItem onClick={() => handleUpdateTaskStatus(task.id, 'completed')}>
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Mark as completed
                            </DropdownMenuItem>
                          )}
                          {task.status !== 'in-progress' && task.status !== 'completed' && (
                            <DropdownMenuItem onClick={() => handleUpdateTaskStatus(task.id, 'in-progress')}>
                              <CheckSquare className="h-4 w-4 mr-2" />
                              Mark as in progress
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDeleteTaskId(task.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <p className="text-muted-foreground">
          View and manage your tasks across all projects
        </p>
      </div>

      <Card className="glass-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>All Tasks</CardTitle>
              <CardDescription>
                {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tasks..."
                  className="pl-8 w-full sm:w-[200px] lg:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                
                {canManageTasks && (
                  <Button onClick={() => setAddTaskOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Task
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">
                All <Badge variant="outline" className="ml-2">{filteredTasks.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending <Badge variant="outline" className="ml-2">{pendingTasks.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="in-progress">
                In Progress <Badge variant="outline" className="ml-2">{inProgressTasks.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed <Badge variant="outline" className="ml-2">{completedTasks.length}</Badge>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {renderTaskTable(filteredTasks)}
            </TabsContent>
            
            <TabsContent value="pending">
              {renderTaskTable(pendingTasks)}
            </TabsContent>
            
            <TabsContent value="in-progress">
              {renderTaskTable(inProgressTasks)}
            </TabsContent>
            
            <TabsContent value="completed">
              {renderTaskTable(completedTasks)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AddEditTaskDialog 
        open={addTaskOpen || !!editTask} 
        onOpenChange={(open) => {
          if (!open) {
            setAddTaskOpen(false);
            setEditTask(null);
          }
        }}
        task={editTask || undefined}
        onSave={editTask ? handleUpdateTask : handleCreateTask}
      />

      <ConfirmationDialog
        open={deleteTaskId !== null}
        onOpenChange={(open) => !open && setDeleteTaskId(null)}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
        confirmLabel="Delete"
        confirmVariant="destructive"
        icon={<Trash2 className="h-5 w-5 text-destructive" />}
      />
    </div>
  );
};

export default TasksPage;
