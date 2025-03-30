import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Barcode, Scan, Check, FileDown, FileUp, Package, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { InventoryItem } from '@/lib/types';
import BarcodeScanner from './BarcodeScanner';

const formSchema = z.object({
  barcode: z.string().min(3, { message: 'Please enter a valid barcode.' }),
  quantity: z.coerce.number().min(1, { message: 'Quantity must be at least 1.' }),
  location: z.string().optional(),
  notes: z.string().optional()
});

interface InventoryQuickScanProps {
  onUpdateInventory: (data: any) => void;
  getItemByBarcode: (barcode: string) => InventoryItem | null;
  locations: { id: number; name: string }[];
}

const InventoryQuickScan: React.FC<InventoryQuickScanProps> = ({ 
  onUpdateInventory, 
  getItemByBarcode,
  locations
}) => {
  const [activeTab, setActiveTab] = useState('add');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannedItem, setScannedItem] = useState<InventoryItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      barcode: '',
      quantity: 1,
      location: '',
      notes: ''
    }
  });

  const handleScan = (barcode: string) => {
    form.setValue('barcode', barcode);
    lookupBarcode(barcode);
  };

  const lookupBarcode = (barcode: string) => {
    const item = getItemByBarcode(barcode);
    setScannedItem(item);
    
    if (item) {
      toast.success(`Found: ${item.name}`);
    } else {
      toast.error("Item not found in inventory");
    }
  };

  const handleManualLookup = () => {
    const barcode = form.getValues('barcode');
    if (barcode) {
      lookupBarcode(barcode);
    } else {
      toast.error("Please enter a barcode");
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!scannedItem) {
      toast.error("No item found for this barcode");
      return;
    }
    
    setIsSubmitting(true);
    
    const transactionData = {
      inventoryId: scannedItem.id,
      barcode: values.barcode,
      quantity: values.quantity,
      location: values.location || scannedItem.location,
      notes: values.notes,
      timestamp: new Date().toISOString(),
      type: activeTab
    };
    
    setTimeout(() => {
      onUpdateInventory(transactionData);
      
      form.reset({
        barcode: '',
        quantity: 1,
        location: '',
        notes: ''
      });
      setScannedItem(null);
      setIsSubmitting(false);
      
      toast.success(`Inventory ${activeTab === 'add' ? 'added' : activeTab === 'remove' ? 'removed' : 'transferred'} successfully`);
    }, 800);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" />
            Quick Inventory Update
          </CardTitle>
          <CardDescription>
            Quickly add, remove, or transfer inventory using barcodes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="add" className="flex items-center gap-1">
                <FileDown className="h-4 w-4" />
                Add
              </TabsTrigger>
              <TabsTrigger value="remove" className="flex items-center gap-1">
                <FileUp className="h-4 w-4" />
                Remove
              </TabsTrigger>
              <TabsTrigger value="transfer" className="flex items-center gap-1">
                <ArrowLeftRight className="h-4 w-4" />
                Transfer
              </TabsTrigger>
            </TabsList>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="barcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Barcode</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <div className="relative flex-1">
                            <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                              className="pl-9" 
                              placeholder="Enter barcode" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setIsScannerOpen(true)}
                        >
                          <Scan className="mr-2 h-4 w-4" />
                          Scan
                        </Button>
                        <Button 
                          type="button" 
                          variant="secondary"
                          onClick={handleManualLookup}
                        >
                          Look Up
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {scannedItem && (
                  <div className="bg-muted p-3 rounded-md">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{scannedItem.name}</p>
                        <p className="text-sm text-muted-foreground">{scannedItem.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Check className="h-3 w-3 text-green-500" />
                          <span className="text-xs">Barcode verified</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      {scannedItem && (
                        <FormDescription>
                          Current inventory: {scannedItem.quantity} {scannedItem.unitOfMeasure}
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <TabsContent value="add" className="mt-0 space-y-4">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || undefined}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {locations.map(location => (
                              <SelectItem key={location.id} value={location.name || "location-" + location.id}>
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
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Additional details" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <TabsContent value="remove" className="mt-0 space-y-4">
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason for Removal</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select reason" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="used">Used in project</SelectItem>
                            <SelectItem value="damaged">Damaged/Defective</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <TabsContent value="transfer" className="mt-0 space-y-4">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination Location</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select destination" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {locations.map(location => (
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
                </TabsContent>
                
                <div className="flex justify-end mt-6">
                  <Button type="submit" disabled={isSubmitting || !scannedItem}>
                    {isSubmitting ? (
                      <span className="flex items-center gap-1">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-b-transparent" />
                        Processing...
                      </span>
                    ) : (
                      <>
                        {activeTab === 'add' ? 'Add to Inventory' : 
                         activeTab === 'remove' ? 'Remove from Inventory' : 
                         'Transfer Item'}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </Tabs>
        </CardContent>
      </Card>
      
      <BarcodeScanner 
        open={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)} 
        onScan={handleScan}
      />
    </>
  );
};

export default InventoryQuickScan;
