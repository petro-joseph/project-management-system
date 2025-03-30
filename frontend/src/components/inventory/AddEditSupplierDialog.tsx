
import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Supplier } from '@/lib/types';
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
import { Building2, Mail, Phone, Link2, User, Star } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const formSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, { message: 'Company name must be at least 2 characters.' }),
  contactPerson: z.string().min(2, { message: 'Contact person name is required.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(5, { message: 'Phone number is required.' }),
  address: z.string().min(5, { message: 'Address is required.' }),
  website: z.string().url({ message: 'Please enter a valid URL.' }).or(z.literal('')).optional(),
  notes: z.string().optional(),
  rating: z.coerce.number().min(1).max(5, { message: 'Rating must be between 1 and 5.' })
});

type FormValues = z.infer<typeof formSchema>;

interface AddEditSupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: Supplier | null;
  onSave: (data: Supplier) => void;
}

export const AddEditSupplierDialog: React.FC<AddEditSupplierDialogProps> = ({
  open,
  onOpenChange,
  initialData,
  onSave
}) => {
  const isEditing = !!initialData;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: initialData?.id,
      name: initialData?.name || '',
      contactPerson: initialData?.contactPerson || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      address: initialData?.address || '',
      website: initialData?.website || '',
      notes: initialData?.notes || '',
      rating: initialData?.rating || 3,
    }
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (open) {
      form.reset({
        id: initialData?.id,
        name: initialData?.name || '',
        contactPerson: initialData?.contactPerson || '',
        email: initialData?.email || '',
        phone: initialData?.phone || '',
        address: initialData?.address || '',
        website: initialData?.website || '',
        notes: initialData?.notes || '',
        rating: initialData?.rating || 3,
      });
    }
  }, [initialData, open, form]);

  const onSubmit = (values: FormValues) => {
    // Create default performance metrics if not provided
    const performanceMetrics = initialData?.performanceMetrics || {
      onTimeDeliveryRate: 90,
      qualityRating: values.rating,
      responseTime: 8,
      averageLeadTime: 5,
      lastEvaluation: new Date().toISOString().split('T')[0]
    };
    
    onSave({
      ...values,
      id: isEditing ? (initialData?.id as number) : 0, // The actual ID will be assigned in the parent component
      items: initialData?.items || [],
      performanceMetrics
    } as Supplier);
    
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Building2 className="h-5 w-5" />
            {isEditing ? 'Edit Supplier' : 'Add New Supplier'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Make changes to the supplier information below.' 
              : 'Add a new supplier with the details below.'}
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
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-9" placeholder="Company name" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contactPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-9" placeholder="Primary contact name" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-9" type="email" placeholder="Email address" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-9" placeholder="Phone number" {...field} />
                      </div>
                    </FormControl>
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
                        placeholder="Company address" 
                        className="resize-none min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website (Optional)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-9" placeholder="https://example.com" {...field} value={field.value || ''} />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Include the full URL with http:// or https://
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value.toString()}
                        className="flex space-x-2"
                      >
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <FormItem key={rating} className="flex items-center space-x-1">
                            <FormControl>
                              <RadioGroupItem
                                value={rating.toString()}
                                id={`rating-${rating}`}
                                className="sr-only"
                              />
                            </FormControl>
                            <label
                              htmlFor={`rating-${rating}`}
                              className={`cursor-pointer rounded-md p-2 hover:bg-muted ${
                                parseInt(field.value.toString()) === rating
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-transparent'
                              }`}
                            >
                              <Star className={`h-5 w-5 ${
                                parseInt(field.value.toString()) >= rating
                                  ? 'fill-current'
                                  : ''
                              }`} />
                            </label>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Additional notes about this supplier" 
                        className="resize-none"
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
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
                {isEditing ? 'Save Changes' : 'Add Supplier'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
