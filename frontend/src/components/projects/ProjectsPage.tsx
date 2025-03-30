import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  FileEdit, 
  Trash2,
  FolderArchive,
  Archive,
  ExternalLink,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { projects as mockProjects, archiveProject, deleteProject } from '@/lib/mockData';
import { Project } from '@/lib/types';
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
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import AddEditProjectDialog from './AddEditProjectDialog';
import ConfirmationDialog from '@/components/shared/ConfirmationDialog';

const ProjectsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [addProjectOpen, setAddProjectOpen] = useState<boolean>(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [deleteProjectId, setDeleteProjectId] = useState<number | null>(null);
  const [archiveProjectId, setArchiveProjectId] = useState<number | null>(null);

  const canManageProjects = user && ['admin', 'manager'].includes(user.role);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        setProjects(mockProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error("Failed to load projects. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  const filteredProjects = searchQuery 
    ? projects.filter(project => 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : projects;

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

  const handleCreateProject = async (data: any) => {
    try {
      const newProject: Project = {
        id: Date.now(),
        name: data.name,
        description: data.description,
        tasksCompleted: 0,
        tasksTotal: 0,
        createdAt: new Date().toISOString(),
        dueDate: data.dueDate.toISOString(),
        status: data.status,
        assignedUsers: data.assignedUsers,
      };

      setProjects([newProject, ...projects]);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error creating project:', error);
      return Promise.reject(error);
    }
  };

  const handleUpdateProject = async (data: any) => {
    if (!editProject) return Promise.reject('No project selected');
    
    try {
      const updatedProject: Project = {
        ...editProject,
        name: data.name,
        description: data.description,
        dueDate: data.dueDate.toISOString(),
        status: data.status,
        assignedUsers: data.assignedUsers,
      };

      setProjects(projects.map(p => p.id === editProject.id ? updatedProject : p));
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error updating project:', error);
      return Promise.reject(error);
    }
  };

  const handleArchiveProject = async () => {
    if (archiveProjectId === null) return;
    
    try {
      await archiveProject(archiveProjectId);
      
      const projectName = projects.find(p => p.id === archiveProjectId)?.name || 'Project';
      
      toast.success("Project archived", {
        description: `${projectName} has been archived.`,
        action: {
          label: "Undo",
          onClick: () => {
            toast.success("Action undone", {
              description: `${projectName} has been restored.`
            });
          }
        }
      });
      
      setProjects(projects.map(p => p.id === archiveProjectId ? { ...p, status: 'on-hold' } : p));
    } catch (error) {
      console.error('Error archiving project:', error);
      toast.error("Failed to archive project. Please try again.");
    } finally {
      setArchiveProjectId(null);
    }
  };

  const handleDeleteProject = async () => {
    if (deleteProjectId === null) return;
    
    try {
      await deleteProject(deleteProjectId);
      
      const projectName = projects.find(p => p.id === deleteProjectId)?.name || 'Project';
      
      toast.success("Project deleted", {
        description: `${projectName} has been deleted.`,
        action: {
          label: "Undo",
          onClick: () => {
            toast.success("Action undone", {
              description: `${projectName} has been restored.`
            });
          }
        }
      });
      
      setProjects(projects.filter(p => p.id !== deleteProjectId));
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error("Failed to delete project. Please try again.");
    } finally {
      setDeleteProjectId(null);
    }
  };

  const handleViewProjectDetails = (projectId: number) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground">
          Manage and track all your organization's projects
        </p>
      </div>

      <Card className="glass-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>All Projects</CardTitle>
              <CardDescription>
                {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search projects..."
                  className="pl-8 w-full sm:w-[200px] lg:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                
                {canManageProjects && (
                  <Button onClick={() => setAddProjectOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Project
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin-slow h-12 w-12 rounded-full border-t-2 border-primary"></div>
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tasks</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => {
                    const statusBadge = getStatusBadge(project.status);
                    const progressPercentage = project.tasksTotal > 0 
                      ? Math.round((project.tasksCompleted / project.tasksTotal) * 100)
                      : 0;
                    
                    return (
                      <TableRow key={project.id} className="hover:bg-secondary/50">
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span>{project.name}</span>
                            <span className="text-xs text-muted-foreground">{project.description}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusBadge.variant}>
                            {statusBadge.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="text-sm">
                              {project.tasksCompleted} / {project.tasksTotal}
                            </div>
                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full" 
                                style={{ width: `${progressPercentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(project.dueDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {canManageProjects && (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleViewProjectDetails(project.id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setEditProject(project)}
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
                                  <DropdownMenuItem onClick={() => setArchiveProjectId(project.id)}>
                                    <Archive className="h-4 w-4 mr-2" />
                                    Archive
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => setDeleteProjectId(project.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <FolderArchive className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No projects found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery 
                  ? `No projects matching "${searchQuery}"`
                  : "You don't have any projects yet"}
              </p>
              {canManageProjects && (
                <Button onClick={() => setAddProjectOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first project
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <AddEditProjectDialog 
        open={addProjectOpen || !!editProject} 
        onOpenChange={(open) => {
          if (!open) {
            setAddProjectOpen(false);
            setEditProject(null);
          }
        }}
        project={editProject || undefined}
        onSave={editProject ? handleUpdateProject : handleCreateProject}
      />

      <ConfirmationDialog
        open={deleteProjectId !== null}
        onOpenChange={(open) => !open && setDeleteProjectId(null)}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
        confirmLabel="Delete"
        confirmVariant="destructive"
        icon={<Trash2 className="h-5 w-5 text-destructive" />}
      />

      <ConfirmationDialog
        open={archiveProjectId !== null}
        onOpenChange={(open) => !open && setArchiveProjectId(null)}
        onConfirm={handleArchiveProject}
        title="Archive Project"
        description="Are you sure you want to archive this project? It can be restored later if needed."
        confirmLabel="Archive"
        icon={<Archive className="h-5 w-5" />}
      />
    </div>
  );
};

export default ProjectsPage;
