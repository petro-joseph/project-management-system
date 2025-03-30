
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon, UsersIcon, UserCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Project } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { users } from '@/lib/mockData';
import { useAuth } from '@/context/AuthContext';

const projectSchema = z.object({
  name: z.string().min(2, { message: 'Project name must be at least 2 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  status: z.enum(['planned', 'in-progress', 'completed', 'on-hold', 'archived']),
  dueDate: z.date({ required_error: 'Due date is required' }),
  assignedUsers: z.array(z.number()).min(1, { message: 'Assign at least one user' }),
  managerId: z.number().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface AddEditProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project; // Optional for editing
  onSave: (data: ProjectFormValues) => Promise<void>;
}

const AddEditProjectDialog: React.FC<AddEditProjectDialogProps> = ({ 
  open, 
  onOpenChange,
  project,
  onSave
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const isEditing = !!project;
  const userRole = user?.role || 'user';
  const canAssignManager = ['admin', 'manager'].includes(userRole);

  // Initialize form with default values
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'planned',
      dueDate: new Date(),
      assignedUsers: [],
      managerId: user?.role === 'manager' ? user.id : undefined,
    },
  });
  
  // Update form values when project changes (when editing)
  useEffect(() => {
    if (open && project) {
      form.reset({
        name: project.name,
        description: project.description,
        status: project.status,
        dueDate: new Date(project.dueDate),
        assignedUsers: project.assignedUsers,
        managerId: project.managerId,
      });
    } else if (open && !project) {
      // Reset to defaults when adding
      form.reset({
        name: '',
        description: '',
        status: 'planned',
        dueDate: new Date(),
        assignedUsers: [],
        managerId: user?.role === 'manager' ? user.id : undefined,
      });
    }
  }, [project, open, form, user]);
  
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: ProjectFormValues) => {
    try {
      await onSave(values);
      onOpenChange(false);
      toast({
        title: `Project ${isEditing ? 'updated' : 'created'} successfully`,
        description: `${values.name} has been ${isEditing ? 'updated' : 'created'}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} project. Please try again.`,
      });
    }
  };

  // Filter users to only managers and admins for assignment
  const eligibleUsers = users.filter(user => ['admin', 'manager', 'user'].includes(user.role));
  
  // Filter users to only managers and admins for project manager role
  const eligibleManagers = users.filter(user => ['admin', 'manager'].includes(user.role));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] glass-card">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Project' : 'Create New Project'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the project details below.'
              : 'Fill out the form below to create a new project.'
            }
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter project name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter project description"
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="planned">Planned</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="on-hold">On Hold</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value && "text-muted-foreground"
                            }`}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {canAssignManager && (
              <FormField
                control={form.control}
                name="managerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Manager</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString() || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a project manager" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {eligibleManagers.map(manager => (
                          <SelectItem key={manager.id} value={manager.id.toString()}>
                            {manager.name} ({manager.role})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="assignedUsers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assigned Team Members</FormLabel>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {eligibleUsers.map(user => (
                      <div 
                        key={user.id}
                        className={`
                          flex items-center gap-2 px-3 py-1 rounded-full border
                          ${field.value.includes(user.id)
                            ? 'bg-primary/10 border-primary/30'
                            : 'bg-secondary/50 hover:bg-secondary'
                          }
                          cursor-pointer transition-colors
                        `}
                        onClick={() => {
                          const newValue = field.value.includes(user.id)
                            ? field.value.filter(id => id !== user.id)
                            : [...field.value, user.id];
                          field.onChange(newValue);
                        }}
                      >
                        <UsersIcon className="h-3.5 w-3.5" />
                        <span className="text-sm">{user.name}</span>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="animate-spin-slow inline-block h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                    {isEditing ? "Updating..." : "Creating..."}
                  </>
                ) : isEditing ? "Update Project" : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditProjectDialog;
