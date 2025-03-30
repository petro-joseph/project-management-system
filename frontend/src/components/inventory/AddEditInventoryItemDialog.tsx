
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { InventoryItem } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Package, MapPin, Building, Briefcase, Plus } from 'lucide-react';
import { getLocations, getSuppliers, getProjects } from '@/lib/mockData';

// Form schema with custom unit of measure
const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  quantity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: 'Quantity must be a valid number',
  }),
  unitOfMeasure: z.string().min(1, 'Unit of measure is required'),
  customUnit: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  costPerUnit: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: 'Cost per unit must be a valid number',
  }),
  projectId: z.string().optional(),
  supplierId: z.string().optional(),
  lowStockThreshold: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: 'Low stock threshold must be a valid number',
  }),
});

interface AddEditInventoryItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: InventoryItem;
  onSave: (data: any) => Promise<void>;
}

const AddEditInventoryItemDialog: React.FC<AddEditInventoryItemDialogProps> = ({
  open,
  onOpenChange,
  item,
  onSave,
}) => {
  const isEditMode = !!item;
  const [isCustomUnit, setIsCustomUnit] = useState(false);
  const [locations, setLocations] = useState<{id: number, name: string}[]>([]);
  const [suppliers, setSuppliers] = useState<{id: number, name: string}[]>([]);
  const [projects, setProjects] = useState<{id: number, name: string}[]>([]);
  
  // Fetch dropdown options
  useEffect(() => {
    setLocations(getLocations().map(loc => ({ id: loc.id, name: loc.name })));
    setSuppliers(getSuppliers().map(sup => ({ id: sup.id, name: sup.name })));
    setProjects(getProjects().map(proj => ({ id: proj.id, name: proj.name })));
  }, []);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      quantity: '0',
      unitOfMeasure: 'units',
      customUnit: '',
      location: '',
      costPerUnit: '0',
      projectId: '',
      supplierId: '',
      lowStockThreshold: '5',
    },
  });
  
  // Check if item has custom unit and reset the form when item changes or dialog opens/closes
  useEffect(() => {
    if (open) {
      if (item) {
        const standardUnits = ['units', 'kg', 'liters', 'boxes', 'packages', 'licenses'];
        const isCustom = !standardUnits.includes(item.unitOfMeasure);
        setIsCustomUnit(isCustom);
        
        form.reset({
          name: item.name || '',
          description: item.description || '',
          quantity: item.quantity ? String(item.quantity) : '0',
          unitOfMeasure: isCustom ? 'custom' : (item.unitOfMeasure || 'units'),
          customUnit: isCustom ? item.unitOfMeasure : '',
          location: item.location || '',
          costPerUnit: item.costPerUnit ? String(item.costPerUnit) : '0',
          projectId: item.projectId ? String(item.projectId) : '',
          supplierId: item.supplierId ? String(item.supplierId) : '',
          lowStockThreshold: item.lowStockThreshold ? String(item.lowStockThreshold) : '5',
        });
      } else {
        form.reset({
          name: '',
          description: '',
          quantity: '0',
          unitOfMeasure: 'units',
          customUnit: '',
          location: '',
          costPerUnit: '0',
          projectId: '',
          supplierId: '',
          lowStockThreshold: '5',
        });
        setIsCustomUnit(false);
      }
    }
  }, [item, open, form]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const watchUnitOfMeasure = form.watch('unitOfMeasure');
  
  // Update custom unit state when unit selection changes
  useEffect(() => {
    setIsCustomUnit(watchUnitOfMeasure === 'custom');
  }, [watchUnitOfMeasure]);
  
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      // Process the unitOfMeasure field to use the custom unit if selected
      const processedValues = {
        ...values,
        unitOfMeasure: values.unitOfMeasure === 'custom' ? values.customUnit : values.unitOfMeasure,
      };
      
      await onSave(processedValues);
    } catch (error) {
      console.error('Error saving inventory item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit' : 'Add'} Inventory Item</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Package className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Enter item name" className="pl-9" {...field} />
                    </div>
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
                    <Textarea placeholder="Enter description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className={isCustomUnit ? "space-y-4" : ""}>
                <FormField
                  control={form.control}
                  name="unitOfMeasure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit of Measure</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || "units"}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="units">Units</SelectItem>
                          <SelectItem value="kg">Kilograms</SelectItem>
                          <SelectItem value="liters">Liters</SelectItem>
                          <SelectItem value="boxes">Boxes</SelectItem>
                          <SelectItem value="packages">Packages</SelectItem>
                          <SelectItem value="licenses">Licenses</SelectItem>
                          <SelectItem value="custom">
                            <div className="flex items-center">
                              <Plus className="mr-2 h-4 w-4" />
                              Custom Unit
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {isCustomUnit && (
                  <FormField
                    control={form.control}
                    name="customUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Enter custom unit" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <SelectTrigger className="pl-9">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map(location => (
                            <SelectItem key={location.id} value={location.name}>
                              {location.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="costPerUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost Per Unit</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-2.5 top-2.5 text-muted-foreground">$</span>
                        <Input type="number" min="0" step="0.01" className="pl-7" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lowStockThreshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Low Stock Threshold</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormDescription>
                      Alerts when stock falls below this level
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="supplierId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Building className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <SelectTrigger className="pl-9">
                            <SelectValue placeholder="Select supplier" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {suppliers.map(supplier => (
                              <SelectItem key={supplier.id} value={String(supplier.id)}>
                                {supplier.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project (Optional)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Briefcase className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <SelectTrigger className="pl-9">
                            <SelectValue placeholder="Select project" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {projects.map(project => (
                              <SelectItem key={project.id} value={String(project.id)}>
                                {project.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter className="pt-4">
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                )}
                {isEditMode ? 'Save Changes' : 'Add Item'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditInventoryItemDialog;
