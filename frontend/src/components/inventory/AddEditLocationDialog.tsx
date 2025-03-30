
import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { InventoryLocation, User } from '@/lib/types';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { MapPin, Warehouse, Building, Store, Map } from 'lucide-react';

const formSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  address: z.string().optional(),
  type: z.enum(['warehouse', 'site', 'store', 'vehicle']),
  manager: z.number().optional().nullable(),
  capacity: z.coerce.number().min(0, { message: 'Capacity must be 0 or higher.' }).optional(),
  currentUtilization: z.coerce.number().min(0).max(100, { message: 'Utilization must be between 0 and 100%.' }).optional()
});

type FormValues = z.infer<typeof formSchema>;

interface AddEditLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: InventoryLocation | null;
  onSave: (data: InventoryLocation) => void;
  users: User[];
}

export const AddEditLocationDialog: React.FC<AddEditLocationDialogProps> = ({
  open,
  onOpenChange,
  initialData,
  onSave,
  users
}) => {
  const isEditing = !!initialData;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: initialData?.id,
      name: initialData?.name || '',
      address: initialData?.address || '',
      type: initialData?.type || 'warehouse',
      manager: initialData?.manager || null,
      capacity: initialData?.capacity || 1000,
      currentUtilization: initialData?.currentUtilization || 0,
    }
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (open) {
      form.reset({
        id: initialData?.id,
        name: initialData?.name || '',
        address: initialData?.address || '',
        type: initialData?.type || 'warehouse',
        manager: initialData?.manager || null,
        capacity: initialData?.capacity || 1000,
        currentUtilization: initialData?.currentUtilization || 0,
      });
    }
  }, [initialData, open, form]);

  const onSubmit = (values: FormValues) => {
    onSave({
      ...values,
      id: isEditing ? (initialData?.id as number) : 0 // The actual ID will be assigned in the parent component
    } as InventoryLocation);
    
    form.reset();
  };

  // Get location type icon
  const getLocationTypeIcon = (type: string) => {
    switch (type) {
      case 'warehouse':
        return <Warehouse className="h-5 w-5" />;
      case 'site':
        return <Building className="h-5 w-5" />;
      case 'store':
        return <Store className="h-5 w-5" />;
      case 'vehicle':
        return <Map className="h-5 w-5" />;
      default:
        return <MapPin className="h-5 w-5" />;
    }
  };

  // Filter users for manager selection (managers and admins only)
  const eligibleManagers = users.filter(user => 
    user.role === 'manager' || user.role === 'admin'
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MapPin className="h-5 w-5" />
            {isEditing ? 'Edit Storage Location' : 'Add New Storage Location'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Make changes to the storage location details below.' 
              : 'Add a new storage location with the details below.'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Location name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a location type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="warehouse" className="flex items-center">
                          <div className="flex items-center">
                            <Warehouse className="mr-2 h-4 w-4" />
                            <span>Warehouse</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="site">
                          <div className="flex items-center">
                            <Building className="mr-2 h-4 w-4" />
                            <span>Project Site</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="store">
                          <div className="flex items-center">
                            <Store className="mr-2 h-4 w-4" />
                            <span>Store</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="vehicle">
                          <div className="flex items-center">
                            <Map className="mr-2 h-4 w-4" />
                            <span>Vehicle/Mobile Unit</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Physical address (optional for mobile units)" 
                        className="resize-none"
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="manager"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location Manager</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value === "null" ? null : parseInt(value))}
                      value={field.value === null ? "null" : field.value?.toString() || "null"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a manager" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="null">None</SelectItem>
                        {eligibleManagers.map((user) => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {user.name} ({user.role})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Storage Capacity</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        placeholder="e.g., 1000" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Units depend on location type (cubic feet, square feet, etc.)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="currentUtilization"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Current Utilization ({field.value}%)</FormLabel>
                    <FormControl>
                      <Slider
                        defaultValue={[field.value || 0]}
                        max={100}
                        step={1}
                        onValueChange={(values) => field.onChange(values[0])}
                        className="py-4"
                      />
                    </FormControl>
                    <FormDescription>
                      The percentage of capacity currently in use
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Save Changes' : 'Add Location'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
