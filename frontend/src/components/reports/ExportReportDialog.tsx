
import React, { useState } from 'react';
import { Calendar, CalendarIcon, Download, FileText, Upload } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface ExportReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: ExportOptions) => void;
  reportType: string;
}

export interface ExportOptions {
  title: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  includeLogo: boolean;
  includeHeader: boolean;
  fileName: string;
}

const ExportReportDialog: React.FC<ExportReportDialogProps> = ({ 
  isOpen, 
  onClose, 
  onExport,
  reportType
}) => {
  const { toast } = useToast();
  const [title, setTitle] = useState(`${reportType} Report`);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [includeLogo, setIncludeLogo] = useState(true);
  const [includeHeader, setIncludeHeader] = useState(true);
  const [fileName, setFileName] = useState(`${reportType.toLowerCase()}_report`);

  const handleExport = () => {
    if (!startDate || !endDate) {
      toast({
        title: "Date range required",
        description: "Please select both start and end dates for your report",
        variant: "destructive"
      });
      return;
    }

    if (endDate < startDate) {
      toast({
        title: "Invalid date range",
        description: "End date must be after start date",
        variant: "destructive"
      });
      return;
    }

    onExport({
      title,
      startDate,
      endDate,
      includeLogo,
      includeHeader,
      fileName
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Export {reportType} Report
          </DialogTitle>
          <DialogDescription>
            Configure your report export options
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Report Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date-range" className="text-right">
              Date Range
            </Label>
            <div className="flex gap-2 col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PP") : <span>Start Date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PP") : <span>End Date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                    disabled={(date) => 
                      startDate ? date < startDate : false
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="filename" className="text-right">
              File Name
            </Label>
            <div className="col-span-3 flex items-center">
              <Input
                id="filename"
                value={fileName}
                onChange={(e) => setFileName(e.target.value.replace(/\s+/g, '_'))}
                className="flex-1"
              />
              <span className="ml-2">.pdf</span>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="include-logo" className="text-right">
              Include Logo
            </Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Switch 
                id="include-logo" 
                checked={includeLogo} 
                onCheckedChange={setIncludeLogo} 
              />
              <Label htmlFor="include-logo">Company logo</Label>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="include-header" className="text-right">
              Include Header
            </Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Switch 
                id="include-header" 
                checked={includeHeader} 
                onCheckedChange={setIncludeHeader} 
              />
              <Label htmlFor="include-header">Page header with date range</Label>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportReportDialog;
