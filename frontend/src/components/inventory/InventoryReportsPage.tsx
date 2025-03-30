import React, { useState } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { 
  FileDown, 
  Calendar as CalendarIcon, 
  Filter, 
  Plus, 
  PieChart, 
  BarChart4, 
  LineChart, 
  FileText,
  Package,
  Wallet,
  Clock,
  TrendingDown,
  Settings,
  PlusCircle,
  ChevronDown,
  Download,
  Printer,
  Mail,
  Trash2,
  Users,
  CalendarDays
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { InventoryReport } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import DatePicker from './DatePickerComponent';

// Sample reports data
const sampleReports: InventoryReport[] = [
  {
    id: 1,
    name: 'Monthly Stock Levels',
    type: 'stock_levels',
    createdAt: '2024-03-01',
    createdBy: 1,
    lastGenerated: '2024-03-01',
    schedule: 'monthly',
    recipients: ['admin@example.com'],
    format: 'pdf'
  },
  {
    id: 2,
    name: 'Quarterly Inventory Valuation',
    type: 'valuation',
    createdAt: '2024-01-15',
    createdBy: 1,
    lastGenerated: '2024-01-15',
    schedule: 'quarterly',
    recipients: ['admin@example.com', 'finance@example.com'],
    format: 'excel'
  },
  {
    id: 3,
    name: 'Weekly Low Stock Alert',
    type: 'low_stock',
    createdAt: '2024-02-10',
    createdBy: 2,
    lastGenerated: '2024-03-04',
    schedule: 'weekly',
    recipients: ['warehouse@example.com', 'purchasing@example.com'],
    format: 'pdf'
  },
  {
    id: 4,
    name: 'Inventory Transactions Log',
    type: 'transactions',
    createdAt: '2024-02-20',
    createdBy: 1,
    lastGenerated: '2024-03-01',
    schedule: 'monthly',
    recipients: ['admin@example.com'],
    format: 'csv'
  },
  {
    id: 5,
    name: 'Custom Project Materials Report',
    type: 'custom',
    createdAt: '2024-03-05',
    createdBy: 3,
    lastGenerated: '2024-03-05',
    schedule: 'monthly',
    recipients: ['project_manager@example.com'],
    format: 'excel'
  }
];

// Get report icon based on type
const getReportIcon = (type: string) => {
  switch (type) {
    case 'stock_levels':
      return <Package className="h-5 w-5 text-primary" />;
    case 'valuation':
      return <Wallet className="h-5 w-5 text-emerald-500" />;
    case 'transactions':
      return <Clock className="h-5 w-5 text-amber-500" />;
    case 'low_stock':
      return <TrendingDown className="h-5 w-5 text-destructive" />;
    case 'custom':
      return <Settings className="h-5 w-5 text-violet-500" />;
    default:
      return <FileText className="h-5 w-5 text-primary" />;
  }
};

// Format report type for display
const formatReportType = (type: string): string => {
  switch (type) {
    case 'stock_levels':
      return 'Stock Levels';
    case 'valuation':
      return 'Inventory Valuation';
    case 'transactions':
      return 'Transaction History';
    case 'low_stock':
      return 'Low Stock Items';
    case 'custom':
      return 'Custom Report';
    default:
      return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
};

// Get schedule badge color
const getScheduleBadge = (schedule?: string) => {
  if (!schedule) return null;
  
  switch (schedule) {
    case 'daily':
      return <Badge className="bg-blue-500">Daily</Badge>;
    case 'weekly':
      return <Badge className="bg-green-500">Weekly</Badge>;
    case 'monthly':
      return <Badge className="bg-amber-500">Monthly</Badge>;
    case 'quarterly':
      return <Badge className="bg-purple-500">Quarterly</Badge>;
    default:
      return <Badge>{schedule}</Badge>;
  }
};

// Get format badge color
const getFormatBadge = (format?: string) => {
  if (!format) return null;
  
  switch (format) {
    case 'pdf':
      return <Badge variant="outline" className="border-red-500 text-red-500">PDF</Badge>;
    case 'csv':
      return <Badge variant="outline" className="border-green-500 text-green-500">CSV</Badge>;
    case 'excel':
      return <Badge variant="outline" className="border-blue-500 text-blue-500">Excel</Badge>;
    default:
      return <Badge variant="outline">{format.toUpperCase()}</Badge>;
  }
};

const InventoryReportsPage: React.FC = () => {
  const [reports, setReports] = useState<InventoryReport[]>(sampleReports);
  const [activeTab, setActiveTab] = useState('saved');
  const [date, setDate] = useState<Date>(new Date());
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<string>('stock_levels');
  const [selectedFormat, setSelectedFormat] = useState<string>('pdf');
  const [showSendOptions, setShowSendOptions] = useState(false);
  const [emailRecipient, setEmailRecipient] = useState('');
  
  const { toast: shadcnToast } = useToast();

  // Handler for generating report
  const handleGenerateReport = () => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      toast.success("Report generated successfully");
      
      // If this was scheduled to be sent, show another notification
      if (showSendOptions && emailRecipient) {
        setTimeout(() => {
          toast.success(`Report sent to ${emailRecipient}`);
        }, 1000);
      }
    }, 2000);
  };

  // Handler for downloading a saved report
  const handleDownloadReport = (report: InventoryReport) => {
    toast.success(`Downloading ${report.name}`);
    
    // Simulate download delay
    setTimeout(() => {
      shadcnToast({
        title: "Download Complete",
        description: `${report.name} has been downloaded`
      });
    }, 1500);
  };

  // Handler for printing a report
  const handlePrintReport = (report: InventoryReport) => {
    toast.success(`Preparing ${report.name} for printing`);
  };

  // Handler for emailing a report
  const handleEmailReport = (report: InventoryReport) => {
    toast.success(`Sending ${report.name} to recipients`);
    
    // Simulate email sending
    setTimeout(() => {
      shadcnToast({
        title: "Email Sent",
        description: `${report.name} has been emailed to ${report.recipients?.join(', ') || 'recipients'}`
      });
    }, 1500);
  };

  // Handler for scheduling a report
  const handleScheduleReport = (report: InventoryReport) => {
    toast.success(`${report.name} scheduling options updated`);
  };

  // Handler for deleting a report
  const handleDeleteReport = (id: number) => {
    setReports(prev => prev.filter(report => report.id !== id));
    toast.success("Report deleted successfully");
  };

  // Chart icon set for dashboard
  const chartIcons = [
    <BarChart4 key="1" className="h-40 w-40 text-muted-foreground/20" />,
    <FileText key="2" className="h-40 w-40 text-muted-foreground/20" />
  ];
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Inventory Reports</h1>
        <p className="text-muted-foreground">
          Generate and manage inventory reports and analytics
        </p>
      </div>

      <Tabs defaultValue="saved" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="saved">Saved Reports</TabsTrigger>
          <TabsTrigger value="generate">Generate New Report</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>
        
        {/* Saved Reports Tab */}
        <TabsContent value="saved" className="space-y-6">
          <Card>
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Your Reports</CardTitle>
                <Button onClick={() => setActiveTab('generate')}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Report
                </Button>
              </div>
              <CardDescription>
                Access and manage your previously generated reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="hidden md:table-cell">Last Generated</TableHead>
                      <TableHead className="hidden lg:table-cell">Schedule</TableHead>
                      <TableHead className="hidden md:table-cell">Format</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.length > 0 ? (
                      reports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                                {getReportIcon(report.type)}
                              </div>
                              <div>
                                <p className="font-medium">{report.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  Created {new Date(report.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {formatReportType(report.type)}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {report.lastGenerated 
                              ? new Date(report.lastGenerated).toLocaleDateString() 
                              : 'Never'}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {report.schedule 
                              ? getScheduleBadge(report.schedule)
                              : <span className="text-muted-foreground">None</span>}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {getFormatBadge(report.format)}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  Actions <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-[200px]">
                                <DropdownMenuLabel>Report Options</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleDownloadReport(report)}>
                                  <Download className="mr-2 h-4 w-4" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handlePrintReport(report)}>
                                  <Printer className="mr-2 h-4 w-4" />
                                  Print
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEmailReport(report)}>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Email
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleScheduleReport(report)}>
                                  <Calendar className="mr-2 h-4 w-4" />
                                  Schedule
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteReport(report.id)} className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-24">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <FileText className="h-8 w-8 mb-2" />
                            <p>No reports found</p>
                            <p className="text-sm">Generate a new report to get started</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Generate New Report Tab */}
        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Generate New Report</CardTitle>
                <CardDescription>
                  Select options to create a custom inventory report
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Report Name</label>
                    <Input className="mt-1" placeholder="Enter report name" />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Report Type</label>
                    <Select 
                      defaultValue={selectedReportType} 
                      onValueChange={setSelectedReportType}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stock_levels">Stock Levels</SelectItem>
                        <SelectItem value="valuation">Inventory Valuation</SelectItem>
                        <SelectItem value="transactions">Transaction History</SelectItem>
                        <SelectItem value="low_stock">Low Stock Items</SelectItem>
                        <SelectItem value="custom">Custom Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Date Range</label>
                    <div className="flex flex-col sm:flex-row gap-2 mt-1">
                      <DatePicker date={date} setDate={setDate} />
                      
                      <Select defaultValue="last_30_days">
                        <SelectTrigger className="w-full sm:w-[240px]">
                          <SelectValue placeholder="Select a range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="last_7_days">Last 7 days</SelectItem>
                          <SelectItem value="last_30_days">Last 30 days</SelectItem>
                          <SelectItem value="this_month">This month</SelectItem>
                          <SelectItem value="this_quarter">This quarter</SelectItem>
                          <SelectItem value="this_year">This year</SelectItem>
                          <SelectItem value="custom">Custom range</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Additional Filters</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                      <Select defaultValue="all_locations">
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all_locations">All Locations</SelectItem>
                          <SelectItem value="1">Main Warehouse</SelectItem>
                          <SelectItem value="2">Project Site A</SelectItem>
                          <SelectItem value="3">Secondary Storage</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select defaultValue="all_categories">
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all_categories">All Categories</SelectItem>
                          <SelectItem value="materials">Materials</SelectItem>
                          <SelectItem value="tools">Tools & Equipment</SelectItem>
                          <SelectItem value="safety">Safety Equipment</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select defaultValue="all_projects">
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by project" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all_projects">All Projects</SelectItem>
                          <SelectItem value="1">Office Tower Construction</SelectItem>
                          <SelectItem value="2">Residential Complex</SelectItem>
                          <SelectItem value="3">Highway Bridge Repair</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select defaultValue="all_suppliers">
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by supplier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all_suppliers">All Suppliers</SelectItem>
                          <SelectItem value="1">BuildWell Supplies</SelectItem>
                          <SelectItem value="2">MetalCraft Industries</SelectItem>
                          <SelectItem value="3">PlumbPro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Group By</label>
                    <Select defaultValue="none">
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select grouping" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Grouping</SelectItem>
                        <SelectItem value="location">Group by Location</SelectItem>
                        <SelectItem value="category">Group by Category</SelectItem>
                        <SelectItem value="project">Group by Project</SelectItem>
                        <SelectItem value="supplier">Group by Supplier</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Output Format</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Button 
                        variant={selectedFormat === 'pdf' ? "default" : "outline"} 
                        size="sm" 
                        onClick={() => setSelectedFormat('pdf')}
                        className={selectedFormat === 'pdf' ? "text-white bg-red-500 hover:bg-red-600" : "border-red-200 text-red-500 hover:bg-red-50"}
                      >
                        <FileDown className="mr-1 h-4 w-4" />
                        PDF
                      </Button>
                      <Button 
                        variant={selectedFormat === 'csv' ? "default" : "outline"} 
                        size="sm" 
                        onClick={() => setSelectedFormat('csv')}
                        className={selectedFormat === 'csv' ? "text-white bg-green-500 hover:bg-green-600" : "border-green-200 text-green-500 hover:bg-green-50"}
                      >
                        <FileDown className="mr-1 h-4 w-4" />
                        CSV
                      </Button>
                      <Button 
                        variant={selectedFormat === 'excel' ? "default" : "outline"} 
                        size="sm" 
                        onClick={() => setSelectedFormat('excel')}
                        className={selectedFormat === 'excel' ? "text-white bg-blue-500 hover:bg-blue-600" : "border-blue-200 text-blue-500 hover:bg-blue-50"}
                      >
                        <FileDown className="mr-1 h-4 w-4" />
                        Excel
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="send-options" checked={showSendOptions} onCheckedChange={() => setShowSendOptions(!showSendOptions)} />
                      <label
                        htmlFor="send-options"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Email this report when generated
                      </label>
                    </div>
                    
                    {showSendOptions && (
                      <div className="mt-2 pl-6">
                        <Input 
                          placeholder="Enter email address" 
                          type="email" 
                          value={emailRecipient}
                          onChange={(e) => setEmailRecipient(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Separate multiple addresses with a comma
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab('saved')}>
                  Cancel
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline">
                    Save as Template
                  </Button>
                  <Button onClick={handleGenerateReport} disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <span className="mr-2">Generating...</span>
                        <span className="animate-spin">⏳</span>
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Generate Report
                      </>
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Report Preview</CardTitle>
                <CardDescription>
                  How your report will look
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <div className="text-center p-4">
                  {selectedReportType === 'stock_levels' && (
                    <>
                      <div className="flex flex-col items-center gap-2">
                        {chartIcons[0]}
                        <h3 className="text-xl font-semibold mt-4">Stock Levels Report</h3>
                        <p className="text-muted-foreground text-sm">Shows current inventory levels across all locations</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-6">
                        <div className="border rounded-md p-3">
                          <div className="text-3xl font-bold">235</div>
                          <div className="text-sm text-muted-foreground">Total Items</div>
                        </div>
                        <div className="border rounded-md p-3">
                          <div className="text-3xl font-bold">12</div>
                          <div className="text-sm text-muted-foreground">Low Stock</div>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {selectedReportType === 'valuation' && (
                    <>
                      <div className="flex flex-col items-center gap-2">
                        {chartIcons[1]}
                        <h3 className="text-xl font-semibold mt-4">Inventory Valuation</h3>
                        <p className="text-muted-foreground text-sm">Total value of all inventory assets</p>
                      </div>
                      <div className="border rounded-md p-3 mt-6">
                        <div className="text-3xl font-bold">$187,450.23</div>
                        <div className="text-sm text-muted-foreground">Total Inventory Value</div>
                      </div>
                    </>
                  )}
                  
                  {selectedReportType === 'transactions' && (
                    <>
                      <div className="flex flex-col items-center gap-2">
                        <Clock className="h-40 w-40 text-muted-foreground/20" />
                        <h3 className="text-xl font-semibold mt-4">Transaction History</h3>
                        <p className="text-muted-foreground text-sm">Record of all inventory movements</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-6">
                        <div className="border rounded-md p-3">
                          <div className="text-3xl font-bold">124</div>
                          <div className="text-sm text-muted-foreground">Total Transactions</div>
                        </div>
                        <div className="border rounded-md p-3">
                          <div className="text-xl font-bold text-green-500">+$12,450</div>
                          <div className="text-xl font-bold text-red-500">-$8,320</div>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {selectedReportType === 'low_stock' && (
                    <>
                      <div className="flex flex-col items-center gap-2">
                        <TrendingDown className="h-40 w-40 text-destructive/20" />
                        <h3 className="text-xl font-semibold mt-4">Low Stock Report</h3>
                        <p className="text-muted-foreground text-sm">Items below minimum threshold</p>
                      </div>
                      <div className="border rounded-md p-3 mt-6 bg-red-50">
                        <div className="text-3xl font-bold text-destructive">12 Items</div>
                        <div className="text-sm text-muted-foreground">Below Reorder Point</div>
                      </div>
                    </>
                  )}
                  
                  {selectedReportType === 'custom' && (
                    <>
                      <div className="flex flex-col items-center gap-2">
                        <Settings className="h-40 w-40 text-muted-foreground/20" />
                        <h3 className="text-xl font-semibold mt-4">Custom Report</h3>
                        <p className="text-muted-foreground text-sm">Build your own custom report</p>
                      </div>
                      <div className="border rounded-md p-4 mt-6">
                        <p className="text-sm text-muted-foreground">Select parameters on the left to customize your report</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Scheduled Reports Tab */}
        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>
                Manage automatically generated recurring reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Name</TableHead>
                      <TableHead>Schedule</TableHead>
                      <TableHead className="hidden md:table-cell">Next Run</TableHead>
                      <TableHead className="hidden lg:table-cell">Recipients</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.filter(r => r.schedule).length > 0 ? (
                      reports.filter(r => r.schedule).map((report) => (
                        <TableRow key={report.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                                {getReportIcon(report.type)}
                              </div>
                              <div>
                                <p className="font-medium">{report.name}</p>
                                <p className="text-xs text-muted-foreground">{formatReportType(report.type)}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getScheduleBadge(report.schedule)}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {/* Calculate next run date based on schedule and last generated */}
                            {report.lastGenerated 
                              ? (() => {
                                  const lastDate = new Date(report.lastGenerated);
                                  let nextDate = new Date(lastDate);
                                  
                                  switch (report.schedule) {
                                    case 'daily':
                                      nextDate.setDate(lastDate.getDate() + 1);
                                      break;
                                    case 'weekly':
                                      nextDate.setDate(lastDate.getDate() + 7);
                                      break;
                                    case 'monthly':
                                      nextDate.setMonth(lastDate.getMonth() + 1);
                                      break;
                                    case 'quarterly':
                                      nextDate.setMonth(lastDate.getMonth() + 3);
                                      break;
                                    default:
                                      nextDate = new Date();
                                  }
                                  
                                  return nextDate.toLocaleDateString();
                                })()
                              : 'Not scheduled'}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {report.recipients && report.recipients.length > 0 ? (
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span>{report.recipients.length} recipient(s)</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">None</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" onClick={() => handleScheduleReport(report)}>
                              Edit Schedule
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center h-24">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <CalendarDays className="h-8 w-8 mb-2" />
                            <p>No scheduled reports found</p>
                            <p className="text-sm">Set up a report schedule to automate your reporting</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryReportsPage;
