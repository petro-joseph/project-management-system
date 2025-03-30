
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
import { FixedAsset } from '@/lib/types';
import { formatCurrency } from '@/lib/mockFixedAssets';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { asyncOperation } from '@/lib/mockDataUtils';

const formSchema = z.object({
  disposalDate: z.date({
    required_error: "Disposal date is required",
  }).refine(date => date <= new Date(), {
    message: "Disposal date cannot be in the future",
  }),
  disposalType: z.enum(["sale", "scrap", "donation", "theft", "other"]),
  disposalValue: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Disposal value must be a non-negative number",
  }),
  disposalReason: z.string().min(1, "Reason is required"),
  notes: z.string().optional(),
});

type DisposalFormData = z.infer<typeof formSchema>;

interface DisposalDialogProps {
  asset: FixedAsset;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DisposalDialog: React.FC<DisposalDialogProps> = ({ 
  asset, 
  open, 
  onOpenChange 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<DisposalFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      disposalDate: new Date(),
      disposalType: "sale",
      disposalValue: asset?.currentValue.toString() || "0",
      disposalReason: "",
      notes: "",
    },
  });
  
  const onSubmit = async (data: DisposalFormData) => {
    setIsSubmitting(true);
    
    try {
      await asyncOperation(() => {
        // In a real app, you would update the asset status to 'disposed' in the database
        // and create a disposal record
        console.log("Asset disposed:", {
          assetId: asset.id,
          assetName: asset.name,
          disposalDate: data.disposalDate,
          disposalType: data.disposalType,
          disposalValue: parseFloat(data.disposalValue),
          disposalReason: data.disposalReason,
          notes: data.notes
        });
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
          <DialogTitle>Record Asset Disposal</DialogTitle>
          <DialogDescription>
            Record the disposal details for asset "{asset.name}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-2 border-y border-border">
          <div>
            <span className="text-sm text-muted-foreground">Asset</span>
            <p className="font-medium">{asset.name}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Current Value</span>
            <p className="font-medium">{formatCurrency(asset.currentValue)}</p>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="disposalDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Disposal Date*</FormLabel>
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="disposalType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Disposal Type*</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sale">Sale</SelectItem>
                        <SelectItem value="scrap">Scrapped</SelectItem>
                        <SelectItem value="donation">Donation</SelectItem>
                        <SelectItem value="theft">Theft/Loss</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="disposalValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Disposal Value*</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        min="0" 
                        step="0.01" 
                        disabled={isSubmitting} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="disposalReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Disposal*</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={2} disabled={isSubmitting} />
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
                  <FormLabel>Additional Notes</FormLabel>
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
              <Button 
                type="submit" 
                variant="destructive"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin-slow inline-block h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></span>
                    Processing...
                  </>
                ) : (
                  "Record Disposal"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DisposalDialog;
