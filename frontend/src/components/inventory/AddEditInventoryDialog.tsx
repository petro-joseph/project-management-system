
import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { InventoryItem, Project, InventoryLocation, Supplier } from '@/lib/types';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, Package, InfoIcon, Barcode, Camera, Check, AlertCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';

// Mock locations data
const mockLocations: InventoryLocation[] = [
  { id: 1, name: 'Main Warehouse', type: 'warehouse' },
  { id: 2, name: 'Project Site A', type: 'site' },
  { id: 3, name: 'Secondary Storage', type: 'warehouse' },
  { id: 4, name: 'Mobile Unit 1', type: 'vehicle' }
];

// Mock suppliers data
const mockSuppliers: Supplier[] = [
  { id: 1, name: 'BuildWell Supplies', contactPerson: '', email: '', phone: '', address: '' },
  { id: 2, name: 'MetalCraft Industries', contactPerson: '', email: '', phone: '', address: '' },
  { id: 3, name: 'PlumbPro', contactPerson: '', email: '', phone: '', address: '' },
  { id: 4, name: 'Timber Works', contactPerson: '', email: '', phone: '', address: '' },
  { id: 5, name: 'SafetyFirst Equipment', contactPerson: '', email: '', phone: '', address: '' }
];

const formSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  description: z.string().min(5, { message: 'Description must be at least 5 characters.' }),
  quantity: z.coerce.number().min(0, { message: 'Quantity must be 0 or higher.' }),
  unitOfMeasure: z.string().min(1, { message: 'Unit of measure is required.' }),
  location: z.string().min(1, { message: 'Location is required.' }),
  projectId: z.union([z.coerce.number(), z.null()]),
  purchaseDate: z.date(),
  supplier: z.string().min(1, { message: 'Supplier is required.' }),
  supplierId: z.coerce.number().optional(),
  costPerUnit: z.coerce.number().min(0, { message: 'Cost must be 0 or higher.' }),
  lowStockThreshold: z.coerce.number().min(0, { message: 'Threshold must be 0 or higher.' }),
  barcode: z.string().optional(),
  category: z.string().optional(),
  reorderPoint: z.coerce.number().min(0).optional(),
  reorderQuantity: z.coerce.number().min(0).optional(),
  valuationMethod: z.enum(['FIFO', 'LIFO', 'average']).optional()
});

type FormValues = z.infer<typeof formSchema>;

interface AddEditInventoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: InventoryItem | null;
  onSave: (data: InventoryItem) => void;
  projects: Project[];
}

export const AddEditInventoryDialog: React.FC<AddEditInventoryDialogProps> = ({
  open,
  onOpenChange,
  initialData,
  onSave,
  projects
}) => {
  const isEditing = !!initialData;
  const [activeTab, setActiveTab] = useState('basic');
  const [isBarcodeScanning, setIsBarcodeScanning] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState('');
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: initialData?.id,
      name: initialData?.name || '',
      description: initialData?.description || '',
      quantity: initialData?.quantity || 0,
      unitOfMeasure: initialData?.unitOfMeasure || '',
      location: initialData?.location || '',
      projectId: initialData?.projectId || null,
      purchaseDate: initialData?.purchaseDate ? new Date(initialData.purchaseDate) : new Date(),
      supplier: initialData?.supplier || '',
      supplierId: initialData?.supplierId,
      costPerUnit: initialData?.costPerUnit || 0,
      lowStockThreshold: initialData?.lowStockThreshold || 0,
      barcode: initialData?.barcode || '',
      category: initialData?.category || '',
      reorderPoint: initialData?.reorderPoint || 0,
      reorderQuantity: initialData?.reorderQuantity || 0,
      valuationMethod: initialData?.valuationMethod || 'average'
    }
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (open) {
      form.reset({
        id: initialData?.id,
        name: initialData?.name || '',
        description: initialData?.description || '',
        quantity: initialData?.quantity || 0,
        unitOfMeasure: initialData?.unitOfMeasure || '',
        location: initialData?.location || '',
        projectId: initialData?.projectId || null,
        purchaseDate: initialData?.purchaseDate ? new Date(initialData.purchaseDate) : new Date(),
        supplier: initialData?.supplier || '',
        supplierId: initialData?.supplierId,
        costPerUnit: initialData?.costPerUnit || 0,
        lowStockThreshold: initialData?.lowStockThreshold || 0,
        barcode: initialData?.barcode || '',
        category: initialData?.category || '',
        reorderPoint: initialData?.reorderPoint || 0,
        reorderQuantity: initialData?.reorderQuantity || 0,
        valuationMethod: initialData?.valuationMethod || 'average'
      });
      setScannedBarcode(initialData?.barcode || '');
    }
  }, [initialData, open, form]);

  // Update form barcode field when scanned barcode changes
  useEffect(() => {
    if (scannedBarcode) {
      form.setValue('barcode', scannedBarcode);
    }
  }, [scannedBarcode, form]);

  const onSubmit = (values: FormValues) => {
    const totalValue = values.quantity * values.costPerUnit;
    
    // Make sure id is set for existing items or generate a new one for new items
    const itemId = isEditing ? (initialData?.id as number) : Math.floor(Math.random() * 10000);
    
    // Find supplier id based on name
    const supplier = mockSuppliers.find(s => s.name === values.supplier);
    
    onSave({
      ...values,
      id: itemId,
      totalValue,
      supplierId: supplier?.id,
      purchaseDate: format(values.purchaseDate, 'yyyy-MM-dd'),
    } as InventoryItem);
    
    form.reset();
  };

  // Start barcode scanning
  const handleStartScanning = () => {
    setIsBarcodeScanning(true);
    
    // Simulate barcode scanning
    setTimeout(() => {
      const fakeBarcode = 'ITM' + Math.floor(1000000 + Math.random() * 9000000);
      setScannedBarcode(fakeBarcode);
      setIsBarcodeScanning(false);
      toast.success("Barcode scanned successfully");
    }, 2000);
  };
  
  // Generate new barcode
  const handleGenerateBarcode = () => {
    const newBarcode = 'ITM' + Math.floor(1000000 + Math.random() * 9000000);
    setScannedBarcode(newBarcode);
    form.setValue('barcode', newBarcode);
    toast.success("New barcode generated");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Package className="h-5 w-5" />
            {isEditing ? 'Edit Inventory Item' : 'Add New Inventory Item'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Make changes to the inventory item details below.' 
              : 'Add a new inventory item with the details below.'}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="tracking">Tracking & Barcode</TabsTrigger>
          </TabsList>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
              <TabsContent value="basic" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Item name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ''}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="materials">Materials</SelectItem>
                            <SelectItem value="tools">Tools & Equipment</SelectItem>
                            <SelectItem value="safety">Safety Equipment</SelectItem>
                            <SelectItem value="electrical">Electrical</SelectItem>
                            <SelectItem value="plumbing">Plumbing</SelectItem>
                            <SelectItem value="office">Office Supplies</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief description of the item" 
                            className="resize-none"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
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
                  
                  <FormField
                    control={form.control}
                    name="unitOfMeasure"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit of Measure</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., pieces, kg, liters" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ''}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockLocations.map(location => (
                              <SelectItem key={location.id} value={location.name}>
                                {location.name}
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
                    name="projectId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Associated Project</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(value === "null" ? null : parseInt(value))}
                          value={field.value === null ? "null" : field.value?.toString() || "null"}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a project" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="null">None</SelectItem>
                            {projects.map((project) => (
                              <SelectItem key={project.id} value={project.id.toString()}>
                                {project.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="advanced" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="supplier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supplier</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ''}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a supplier" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockSuppliers.map(supplier => (
                              <SelectItem key={supplier.id} value={supplier.name}>
                                {supplier.name}
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
                    name="purchaseDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Purchase Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
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
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="costPerUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cost Per Unit</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="valuationMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cost Tracking Method</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || 'average'}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select valuation method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="FIFO">FIFO (First In, First Out)</SelectItem>
                            <SelectItem value="LIFO">LIFO (Last In, First Out)</SelectItem>
                            <SelectItem value="average">Weighted Average</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Method used for cost calculations when inventory is consumed
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lowStockThreshold"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel>Low Stock Threshold</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <InfoIcon className="h-4 w-4 text-muted-foreground cursor-pointer" />
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <p className="text-sm">
                                Items with quantity at or below this threshold will be marked as low stock.
                              </p>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="reorderPoint"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel>Reorder Point</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <InfoIcon className="h-4 w-4 text-muted-foreground cursor-pointer" />
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <p className="text-sm">
                                Quantity at which a reorder should be triggered. System will generate notifications when this level is reached.
                              </p>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="reorderQuantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reorder Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormDescription>
                          Amount to order when reorder point is reached
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="tracking" className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name="barcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Barcode</FormLabel>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <div className="relative flex-1">
                              <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input 
                                className="pl-9 pr-24" 
                                placeholder="Barcode value" 
                                {...field} 
                                value={field.value || ''}
                              />
                              {field.value && (
                                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                  <Check className="h-4 w-4 text-green-500" />
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={handleGenerateBarcode}
                          >
                            Generate
                          </Button>
                          <Button 
                            type="button" 
                            variant={isBarcodeScanning ? "destructive" : "secondary"}
                            onClick={handleStartScanning}
                            disabled={isBarcodeScanning}
                          >
                            {isBarcodeScanning ? (
                              <>
                                <span className="animate-pulse mr-2">Scanning...</span>
                                <Camera className="h-4 w-4 animate-pulse" />
                              </>
                            ) : (
                              <>
                                <Camera className="mr-2 h-4 w-4" />
                                Scan
                              </>
                            )}
                          </Button>
                        </div>
                        {scannedBarcode && (
                          <div className="mt-2 flex items-center text-sm text-muted-foreground">
                            <Check className="h-3 w-3 mr-1 text-green-500" />
                            Barcode {scannedBarcode} is valid and ready to use
                          </div>
                        )}
                        <FormDescription>
                          Use the barcode to quickly scan and update inventory
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="border rounded-md p-4 space-y-4">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                      <h3 className="text-lg font-medium">Automatic Reordering</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Configure automatic reordering for this inventory item. When the quantity drops to the reorder point, the system will generate a notification.
                    </p>
                    <FormField
                      control={form.control}
                      name="reorderPoint"
                      render={({ field }) => (
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Reorder Trigger Point:</span>
                          <span>{field.value} {form.getValues('unitOfMeasure')}</span>
                        </div>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="reorderQuantity"
                      render={({ field }) => (
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Default Order Quantity:</span>
                          <span>{field.value} {form.getValues('unitOfMeasure')}</span>
                        </div>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="supplier"
                      render={({ field }) => (
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Default Supplier:</span>
                          <span>{field.value || 'Not set'}</span>
                        </div>
                      )}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Note: You can adjust reorder settings in the Advanced tab
                    </p>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h3 className="text-lg font-medium mb-2">Barcode Operations</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Quick operations that can be performed when scanning this item's barcode
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Button variant="outline" type="button" disabled>
                        Quick Add to Inventory
                      </Button>
                      <Button variant="outline" type="button" disabled>
                        Quick Remove from Inventory
                      </Button>
                      <Button variant="outline" type="button" disabled>
                        Quick Transfer
                      </Button>
                      <Button variant="outline" type="button" disabled>
                        Check Stock Levels
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Note: These operations will be available when scanning this item using the mobile app
                    </p>
                  </div>
                </div>
              </TabsContent>
            
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditing ? 'Save Changes' : 'Add Item'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
