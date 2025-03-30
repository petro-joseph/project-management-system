import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  UserPlus, 
  UserCog, 
  UserX,
  Pencil,
  Trash2,
  Shield,
  Check,
  X,
  Eye
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { users as mockUsers } from '@/lib/mockData';
import { User, Role } from '@/lib/types';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const userFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  role: z.enum(['admin', 'manager', 'user']),
});

const roleChangeSchema = z.object({
  role: z.enum(['admin', 'manager', 'user']),
});

type UserFormValues = z.infer<typeof userFormSchema>;
type RoleChangeValues = z.infer<typeof roleChangeSchema>;

const UsersPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [deleteUserDialogOpen, setDeleteUserDialogOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const userForm = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'user',
    },
  });

  const roleForm = useForm<RoleChangeValues>({
    resolver: zodResolver(roleChangeSchema),
    defaultValues: {
      role: 'user',
    },
  });

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        setUsers(mockUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  useEffect(() => {
    if (selectedUser && editUserDialogOpen) {
      userForm.reset({
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedUser.role,
      });
    }
  }, [selectedUser, editUserDialogOpen, userForm]);

  useEffect(() => {
    if (selectedUser && roleDialogOpen) {
      roleForm.reset({
        role: selectedUser.role,
      });
    }
  }, [selectedUser, roleDialogOpen, roleForm]);

  const filteredUsers = searchQuery 
    ? users.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return { 
          variant: 'destructive' as const, 
          label: 'Admin', 
          icon: <Shield className="h-3.5 w-3.5 mr-1" /> 
        };
      case 'manager':
        return { 
          variant: 'default' as const, 
          label: 'Manager', 
          icon: <UserCog className="h-3.5 w-3.5 mr-1" /> 
        };
      case 'user':
        return { 
          variant: 'outline' as const, 
          label: 'User', 
          icon: <UserPlus className="h-3.5 w-3.5 mr-1" /> 
        };
      default:
        return { variant: 'outline' as const, label: role, icon: null };
    }
  };

  const resetAndCloseDialogs = () => {
    userForm.reset({
      name: '',
      email: '',
      role: 'user',
    });
    roleForm.reset({
      role: 'user',
    });
    setSelectedUser(null);
    setAddUserDialogOpen(false);
    setEditUserDialogOpen(false);
    setDeleteUserDialogOpen(false);
    setRoleDialogOpen(false);
  };

  const onSubmitUserForm = (data: UserFormValues) => {
    if (selectedUser) {
      const updatedUsers = users.map(u => 
        u.id === selectedUser.id ? { ...u, ...data } : u
      );
      setUsers(updatedUsers);
      toast.success(`User "${data.name}" updated successfully`);
    } else {
      const newUser: User = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        name: data.name,
        email: data.email,
        role: data.role,
        createdAt: new Date().toISOString(),
      };
      setUsers([...users, newUser]);
      toast.success(`User "${data.name}" added successfully`);
    }
    resetAndCloseDialogs();
  };

  const onSubmitRoleChange = (data: RoleChangeValues) => {
    if (selectedUser) {
      const updatedUsers = users.map(u => 
        u.id === selectedUser.id ? { ...u, role: data.role } : u
      );
      setUsers(updatedUsers);
      toast.success(`Changed ${selectedUser.name}'s role to ${data.role}`);
    }
    resetAndCloseDialogs();
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      const updatedUsers = users.filter(u => u.id !== selectedUser.id);
      setUsers(updatedUsers);
      toast.success(`User "${selectedUser.name}" deleted successfully`);
    }
    resetAndCloseDialogs();
  };

  const viewUserDetails = (userId: number) => {
    navigate(`/users/${userId}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">
          Manage user accounts and access permissions
        </p>
      </div>

      <Card className="glass-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="pl-8 w-full sm:w-[200px] lg:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button onClick={() => {
                setSelectedUser(null);
                userForm.reset({ name: '', email: '', role: 'user' });
                setAddUserDialogOpen(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                New User
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin-slow h-12 w-12 rounded-full border-t-2 border-primary"></div>
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[120px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => {
                    const roleBadge = getRoleBadge(user.role);
                    
                    return (
                      <TableRow key={user.id} className="hover:bg-secondary/50">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <span>{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <Badge variant={roleBadge.variant} className="flex items-center w-fit">
                            {roleBadge.icon}
                            {roleBadge.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => viewUserDetails(user.id)}
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View user</span>
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => viewUserDetails(user.id)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  setSelectedUser(user);
                                  setEditUserDialogOpen(true);
                                }}>
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  setSelectedUser(user);
                                  setRoleDialogOpen(true);
                                }}>
                                  <UserCog className="h-4 w-4 mr-2" />
                                  Change Role
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setDeleteUserDialogOpen(true);
                                  }}
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
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <UserX className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No users found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery 
                  ? `No users matching "${searchQuery}"`
                  : "There are no users in the system"}
              </p>
              <Button onClick={() => {
                setSelectedUser(null);
                userForm.reset({ name: '', email: '', role: 'user' });
                setAddUserDialogOpen(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={addUserDialogOpen || editUserDialogOpen} onOpenChange={(open) => {
        if (!open) {
          resetAndCloseDialogs();
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedUser ? 'Edit User' : 'Add New User'}</DialogTitle>
          </DialogHeader>
          <Form {...userForm}>
            <form onSubmit={userForm.handleSubmit(onSubmitUserForm)} className="space-y-4">
              <FormField
                control={userForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter full name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={userForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="email@example.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={userForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || "user"}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => resetAndCloseDialogs()}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedUser ? 'Update User' : 'Add User'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={roleDialogOpen} onOpenChange={(open) => {
        if (!open) {
          resetAndCloseDialogs();
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
          </DialogHeader>
          <Form {...roleForm}>
            <form onSubmit={roleForm.handleSubmit(onSubmitRoleChange)} className="space-y-4">
              {selectedUser && (
                <p className="text-muted-foreground">
                  Changing role for <span className="font-medium text-foreground">{selectedUser.name}</span>
                </p>
              )}
              <FormField
                control={roleForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Role</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value || "user"}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="admin" id="admin" />
                          <Label htmlFor="admin" className="flex items-center">
                            <Shield className="h-4 w-4 mr-2 text-destructive" />
                            Administrator
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="manager" id="manager" />
                          <Label htmlFor="manager" className="flex items-center">
                            <UserCog className="h-4 w-4 mr-2 text-primary" />
                            Manager
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="user" id="user" />
                          <Label htmlFor="user" className="flex items-center">
                            <UserPlus className="h-4 w-4 mr-2 text-muted-foreground" />
                            User
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => resetAndCloseDialogs()}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Change Role
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteUserDialogOpen} onOpenChange={(open) => {
        if (!open) {
          resetAndCloseDialogs();
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4">
              <p>
                Are you sure you want to delete <span className="font-medium">{selectedUser.name}</span>?
              </p>
              <p className="text-muted-foreground mt-2">
                This action cannot be undone.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => resetAndCloseDialogs()}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteUser}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPage;
