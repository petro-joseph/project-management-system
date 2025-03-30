
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Edit, Save, CheckCircle, ClipboardList, Package, UserCircle } from 'lucide-react';
import { Project, Task, InventoryItem, User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { 
  getProjectById, 
  getUserById, 
  tasks, 
  archiveProject, 
  getInventoryItemsByProjectId 
} from '@/lib/mockData';
import ProjectTimeline from './ProjectTimeline';
import ProjectBudget from './ProjectBudget';
import { Progress } from '@/components/ui/progress';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useAuth } from '@/context/AuthContext';

const ProjectDetailsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [relatedTasks, setRelatedTasks] = useState<Task[]>([]);
  const [relatedInventory, setRelatedInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const { user } = useAuth();
  const userRole = user?.role || 'user';
  
  const fetchProjectData = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const foundProject = getProjectById(Number(projectId));
      
      if (foundProject) {
        setProject(foundProject);
        
        // Get related tasks
        const projectTasks = tasks.filter(task => task.projectId === foundProject.id);
        setRelatedTasks(projectTasks);
        
        // Get related inventory
        const projectInventory = getInventoryItemsByProjectId(foundProject.id);
        setRelatedInventory(projectInventory);
      } else {
        toast.error("Project not found");
        navigate('/projects');
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      toast.error("Failed to load project details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProjectData();
    }
  }, [projectId, navigate]);

  const handleProjectUpdate = async (updatedProject: Project) => {
    setSaving(true);
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get the index of the project in the projects array and update it directly
      const projectIndex = tasks.findIndex(p => p.id === updatedProject.id);
      if (projectIndex !== -1) {
        setProject(updatedProject);
        toast.success("Project updated successfully");
      } else {
        toast.error("Failed to update project");
      }
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error("Failed to update project");
    } finally {
      setSaving(false);
    }
  };

  // Check if user has permission to edit this project
  const canEditProject = () => {
    if (!user || !project) return false;
    
    // Admins can edit any project
    if (userRole === 'admin') return true;
    
    // Managers can edit projects they manage
    if (userRole === 'manager' && project.managerId === user.id) return true;
    
    return false;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin-slow h-12 w-12 rounded-full border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="space-y-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/projects')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
          <p className="text-muted-foreground">The requested project does not exist or has been deleted.</p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'planned':
        return { variant: 'outline' as const, label: 'Planned' };
      case 'in-progress':
        return { variant: 'default' as const, label: 'In Progress' };
      case 'completed':
        return { variant: 'secondary' as const, label: 'Completed' };
      case 'on-hold':
        return { variant: 'outline' as const, label: 'On Hold' };
      default:
        return { variant: 'outline' as const, label: status };
    }
  };
  
  const statusBadge = getStatusBadge(project.status);
  const progressPercentage = project.tasksTotal > 0 
    ? Math.round((project.tasksCompleted / project.tasksTotal) * 100)
    : 0;

  // Get the project manager if available
  const projectManager = project.managerId ? getUserById(project.managerId) : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/projects')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Project Details</h1>
        </div>
        
        <div className="flex gap-2">
          {canEditProject() && (
            <Button onClick={() => navigate(`/projects/edit/${project.id}`)} variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Project
            </Button>
          )}
          <Button onClick={() => fetchProjectData()} variant="outline" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl">{project.name}</CardTitle>
              <Badge variant={statusBadge.variant}>
                {statusBadge.label}
              </Badge>
            </div>
            <CardDescription className="text-base mt-2">
              {project.description}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-3 border rounded-lg">
              <div className="text-sm text-muted-foreground">Created</div>
              <div className="font-medium">{new Date(project.createdAt).toLocaleDateString()}</div>
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="text-sm text-muted-foreground">Due Date</div>
              <div className="font-medium">{new Date(project.dueDate).toLocaleDateString()}</div>
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="text-sm text-muted-foreground">Task Progress</div>
              <div className="font-medium">{project.tasksCompleted} / {project.tasksTotal} ({progressPercentage}%)</div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden mt-2">
                <div 
                  className="h-full bg-primary rounded-full" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="text-sm text-muted-foreground">Project Manager</div>
              {projectManager ? (
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-6 w-6">
                    {projectManager.avatar && <AvatarImage src={projectManager.avatar} alt={projectManager.name} />}
                    <AvatarFallback>
                      {projectManager.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="font-medium">{projectManager.name}</div>
                </div>
              ) : (
                <div className="font-medium text-muted-foreground">Not assigned</div>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Team Members
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {project.assignedUsers.map(userId => {
                const user = getUserById(userId);
                return user ? (
                  <div 
                    key={userId} 
                    className="flex items-center gap-2 p-2 border rounded-lg hover:bg-secondary/50 transition-colors"
                    onClick={() => navigate(`/users/${user.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-sm font-medium">{user.name}</div>
                  </div>
                ) : null;
              })}
              
              {project.assignedUsers.length === 0 && (
                <div className="p-3 border rounded-lg w-full text-center text-muted-foreground">
                  No team members assigned
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="timeline" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="timeline">Timeline & Milestones</TabsTrigger>
          <TabsTrigger value="budget">Budget & Expenses</TabsTrigger>
          <TabsTrigger value="tasks">Related Tasks</TabsTrigger>
          <TabsTrigger value="inventory">Assigned Inventory</TabsTrigger>
        </TabsList>
        
        <TabsContent value="timeline" className="space-y-6 mt-6">
          <ProjectTimeline project={project} onUpdate={handleProjectUpdate} />
        </TabsContent>
        
        <TabsContent value="budget" className="space-y-6 mt-6">
          <ProjectBudget project={project} onUpdate={handleProjectUpdate} />
        </TabsContent>
        
        <TabsContent value="tasks" className="space-y-6 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <ClipboardList className="h-5 w-5 mr-2" />
                Related Tasks
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/tasks', { state: { projectFilter: project.id } })}
              >
                Manage Tasks
              </Button>
            </CardHeader>
            <CardContent>
              {relatedTasks.length > 0 ? (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead>Due Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {relatedTasks.map((task) => {
                        const assignee = getUserById(task.assignedTo);
                        return (
                          <TableRow 
                            key={task.id}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => navigate(`/tasks/${task.id}`)}
                          >
                            <TableCell className="font-medium">{task.title}</TableCell>
                            <TableCell>
                              <Badge variant={
                                task.status === 'completed' ? 'secondary' : 
                                task.status === 'in-progress' ? 'default' : 
                                task.status === 'cancelled' ? 'destructive' : 
                                'outline'
                              }>
                                {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={
                                task.priority === 'high' ? 'destructive' : 
                                task.priority === 'medium' ? 'default' : 
                                'outline'
                              }>
                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback>
                                    {assignee?.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{assignee?.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">No tasks have been assigned to this project yet.</p>
                  <Button onClick={() => navigate('/tasks/new', { state: { projectId: project.id } })}>
                    Create a Task
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory" className="space-y-6 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Assigned Inventory
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/inventory', { state: { projectFilter: project.id } })}
              >
                Manage Inventory
              </Button>
            </CardHeader>
            <CardContent>
              {relatedInventory.length > 0 ? (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Unit Value</TableHead>
                        <TableHead>Total Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {relatedInventory.map((item) => (
                        <TableRow 
                          key={item.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => navigate(`/inventory/${item.id}`)}
                        >
                          <TableCell>
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-muted-foreground">{item.description}</div>
                            </div>
                          </TableCell>
                          <TableCell>{item.quantity} {item.unitOfMeasure}</TableCell>
                          <TableCell>{item.location}</TableCell>
                          <TableCell>
                            ${item.costPerUnit.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              ${item.totalValue.toFixed(2)}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">No inventory items have been assigned to this project yet.</p>
                  <Button onClick={() => navigate('/inventory/new', { state: { projectId: project.id } })}>
                    Assign Inventory
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetailsPage;
