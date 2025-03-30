
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FixedAsset, DepreciationMethod } from '@/lib/types';
import { createFixedAsset, getAssetCategories, getCategoryById, users } from '@/lib/mockFixedAssets';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ensureValidSelectValue, asyncOperation } from '@/lib/mockDataUtils';

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  categoryId: z.string().min(1, "Category is required"),
  acquisitionDate: z.date({
    required_error: "Acquisition date is required",
  }).refine(date => date <= new Date(), {
    message: "Acquisition date cannot be in the future",
  }),
  originalCost: z.string().min(1, "Cost is required").refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Cost must be a positive number",
  }),
  usefulLife: z.string().min(1, "Useful life is required").refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Useful life must be a positive number",
  }),
  depreciationMethod: z.enum(["straight-line", "reducing-balance", "units-of-production", "sum-of-years-digits"]),
  salvageValue: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Salvage value must be a non-negative number",
  }),
  location: z.string().min(1, "Location is required"),
  custodian: z.string().min(1, "Custodian is required"),
  serialNumber: z.string().optional(),
  notes: z.string().optional(),
});

type AssetFormData = z.infer<typeof formSchema>;

interface AddEditAssetDialogProps {
  asset?: FixedAsset;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddEditAssetDialog: React.FC<AddEditAssetDialogProps> = ({ 
  asset, 
  open, 
  onOpenChange 
}) => {
  const isEditing = !!asset;
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [categories, setCategories] = useState(getAssetCategories());
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<AssetFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      acquisitionDate: new Date(),
      originalCost: "",
      usefulLife: "",
      depreciationMethod: "straight-line",
      salvageValue: "",
      location: "",
      custodian: "",
      serialNumber: "",
      notes: "",
    },
  });
  
  // Reset form with asset data when opening dialog or when asset changes
  useEffect(() => {
    if (open) {
      // Fetch categories asynchronously to prevent UI freeze
      asyncOperation(() => getAssetCategories())
        .then((fetchedCategories) => {
          setCategories(fetchedCategories);
        });
      
      // Update the selectedCategoryId state
      if (asset) {
        setSelectedCategoryId(asset.categoryId.toString());
        
        form.reset({
          name: asset.name || "",
          description: asset.description || "",
          categoryId: asset.categoryId.toString() || "",
          acquisitionDate: asset.acquisitionDate ? new Date(asset.acquisitionDate) : new Date(),
          originalCost: asset.originalCost.toString() || "",
          usefulLife: asset.usefulLife.toString() || "",
          depreciationMethod: asset.depreciationMethod || "straight-line",
          salvageValue: asset.salvageValue.toString() || "",
          location: asset.location || "",
          custodian: asset.custodian.toString() || "",
          serialNumber: asset.serialNumber || "",
          notes: asset.notes || "",
        });
      } else {
        setSelectedCategoryId(null);
        
        form.reset({
          name: "",
          description: "",
          categoryId: "",
          acquisitionDate: new Date(),
          originalCost: "",
          usefulLife: "",
          depreciationMethod: "straight-line",
          salvageValue: "",
          location: "",
          custodian: "",
          serialNumber: "",
          notes: "",
        });
      }
    }
  }, [asset, open, form]);
  
  // When category changes, update defaults based on category settings
  useEffect(() => {
    if (selectedCategoryId && !isEditing) {
      asyncOperation(() => {
        const category = getCategoryById(parseInt(selectedCategoryId));
        if (category) {
          form.setValue("depreciationMethod", category.defaultDepreciationMethod);
          form.setValue("usefulLife", category.defaultUsefulLifeMin.toString());
          
          // Calculate default salvage value based on original cost and category percentage
          const originalCost = form.getValues("originalCost");
          if (originalCost && !isNaN(Number(originalCost))) {
            const salvageValue = (Number(originalCost) * category.defaultSalvageValuePercent / 100).toFixed(2);
            form.setValue("salvageValue", salvageValue);
          }
        }
      });
    }
  }, [selectedCategoryId, form, isEditing]);
  
  const handleCategoryChange = (value: string) => {
    setSelectedCategoryId(value);
    form.setValue("categoryId", value);
  };
  
  const onSubmit = async (data: AssetFormData) => {
    setIsSubmitting(true);
    
    try {
      await asyncOperation(() => {
        if (isEditing) {
          // In a real app, you would update the asset in the database
          console.log("Updating asset:", asset?.id);
        } else {
          // Create a new asset
          const newAsset = createFixedAsset({
            name: data.name,
            description: data.description,
            categoryId: parseInt(data.categoryId),
            acquisitionDate: data.acquisitionDate.toISOString(),
            originalCost: parseFloat(data.originalCost),
            usefulLife: parseInt(data.usefulLife),
            depreciationMethod: data.depreciationMethod as DepreciationMethod,
            salvageValue: parseFloat(data.salvageValue),
            status: 'active',
            location: data.location,
            custodian: parseInt(data.custodian),
            serialNumber: data.serialNumber,
            notes: data.notes,
            createdBy: 1, // Hardcoded for mock
          });
          
          console.log("Created new asset:", newAsset);
        }
      });
      
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Asset" : "Add New Asset"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the asset details below" : "Enter asset details to add a new item"}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset Name*</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset Category*</FormLabel>
                    <Select 
                      onValueChange={(value) => handleCategoryChange(value)} 
                      value={field.value || ""}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem 
                            key={category.id} 
                            value={ensureValidSelectValue(category.id.toString())}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description*</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={2} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="acquisitionDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Acquisition Date*</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className="w-full flex justify-start text-left font-normal"
                            disabled={isSubmitting}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date()
                          }
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
                name="originalCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Original Cost*</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="0" step="0.01" disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="usefulLife"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Useful Life (Years)*</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="1" step="1" disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="depreciationMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Depreciation Method*</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value || "straight-line"}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="straight-line">Straight Line</SelectItem>
                        <SelectItem value="reducing-balance">Reducing Balance</SelectItem>
                        <SelectItem value="units-of-production">Units of Production</SelectItem>
                        <SelectItem value="sum-of-years-digits">Sum of Years Digits</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="salvageValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salvage Value*</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="0" step="0.01" disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location*</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="custodian"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custodian*</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value || ""}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select custodian" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem 
                            key={user.id} 
                            value={ensureValidSelectValue(user.id.toString())}
                          >
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="serialNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serial Number</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={2} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="animate-spin-slow inline-block h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></span>
                    {isEditing ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  isEditing ? "Update Asset" : "Add Asset"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditAssetDialog;
