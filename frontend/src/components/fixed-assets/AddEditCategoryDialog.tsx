
import React, { useState } from 'react';
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
  FormDescription,
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
import { Switch } from "@/components/ui/switch";
import { AssetCategory, DepreciationMethod } from '@/lib/types';
import { createAssetCategory } from '@/lib/mockFixedAssets';
import { useEffect } from 'react';
import { asyncOperation } from '@/lib/mockDataUtils';

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  defaultUsefulLifeMin: z.string().min(1, "Minimum useful life is required")
    .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Minimum useful life must be a positive number",
    }),
  defaultUsefulLifeMax: z.string().min(1, "Maximum useful life is required")
    .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Maximum useful life must be a positive number",
    }),
  defaultDepreciationMethod: z.enum(["straight-line", "reducing-balance", "units-of-production", "sum-of-years-digits"]),
  defaultSalvageValuePercent: z.string().min(1, "Salvage value percentage is required")
    .refine(val => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100, {
      message: "Salvage value percentage must be between 0 and 100",
    }),
  isActive: z.boolean(),
});

type CategoryFormData = z.infer<typeof formSchema>;

interface AddEditCategoryDialogProps {
  category?: AssetCategory;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddEditCategoryDialog: React.FC<AddEditCategoryDialogProps> = ({ 
  category, 
  open, 
  onOpenChange 
}) => {
  const isEditing = !!category;
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      defaultUsefulLifeMin: "",
      defaultUsefulLifeMax: "",
      defaultDepreciationMethod: "straight-line",
      defaultSalvageValuePercent: "",
      isActive: true,
    },
  });
  
  // Reset form with category data when opening dialog or when category changes
  useEffect(() => {
    if (open) {
      form.reset({
        name: category?.name || "",
        description: category?.description || "",
        defaultUsefulLifeMin: category?.defaultUsefulLifeMin?.toString() || "",
        defaultUsefulLifeMax: category?.defaultUsefulLifeMax?.toString() || "",
        defaultDepreciationMethod: category?.defaultDepreciationMethod || "straight-line",
        defaultSalvageValuePercent: category?.defaultSalvageValuePercent?.toString() || "",
        isActive: category ? category.isActive : true,
      });
    }
  }, [category, open, form]);
  
  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    
    try {
      await asyncOperation(() => {
        if (isEditing) {
          // In a real app, you would update the category in the database
          console.log("Updating category:", category?.id);
        } else {
          // Create a new category
          const newCategory = createAssetCategory({
            name: data.name,
            description: data.description,
            defaultUsefulLifeMin: parseInt(data.defaultUsefulLifeMin),
            defaultUsefulLifeMax: parseInt(data.defaultUsefulLifeMax),
            defaultDepreciationMethod: data.defaultDepreciationMethod as DepreciationMethod,
            defaultSalvageValuePercent: parseFloat(data.defaultSalvageValuePercent),
            isActive: data.isActive,
            createdBy: 1, // Hardcoded for mock
          });
          
          console.log("Created new category:", newCategory);
        }
      });
      
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Category" : "Add New Category"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update category details below" : "Enter details to create a new asset category"}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name*</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isSubmitting} />
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
                name="defaultUsefulLifeMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Useful Life (Years)*</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="1" step="1" disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="defaultUsefulLifeMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Useful Life (Years)*</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="1" step="1" disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="defaultDepreciationMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Depreciation Method*</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
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
                name="defaultSalvageValuePercent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Salvage Value (%)*</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="0" max="100" step="1" disabled={isSubmitting} />
                    </FormControl>
                    <FormDescription>
                      Percentage of original cost
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <FormDescription>
                      Whether this category is active and available for new assets
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
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
                  isEditing ? "Update Category" : "Add Category"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditCategoryDialog;
