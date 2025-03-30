
import React, { useState, useRef } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  Download, Calendar, Filter, ArrowUpDown, PanelRight, RefreshCw,
  BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon, FileText
} from 'lucide-react';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import ExportReportDialog, { ExportOptions } from './ExportReportDialog';
import { 
  generateTaskReport, 
  generateProjectReport, 
  generateUserReport, 
  generateComprehensiveReport 
} from '@/lib/reportService';

const taskData = [
  { name: 'Jan', completed: 30, pending: 15, cancelled: 5 },
  { name: 'Feb', completed: 40, pending: 20, cancelled: 8 },
  { name: 'Mar', completed: 35, pending: 18, cancelled: 10 },
  { name: 'Apr', completed: 50, pending: 25, cancelled: 7 },
  { name: 'May', completed: 65, pending: 30, cancelled: 5 },
  { name: 'Jun', completed: 60, pending: 28, cancelled: 12 },
];

const userRoleData = [
  { name: 'Admins', value: 5, color: '#ef4444' },
  { name: 'Managers', value: 15, color: '#3b82f6' },
  { name: 'Users', value: 40, color: '#e5e7eb' },
];

const projectStatusData = [
  { name: 'Planned', tasks: 10 },
  { name: 'In Progress', tasks: 25 },
  { name: 'Completed', tasks: 18 },
  { name: 'On Hold', tasks: 8 },
];

const userActivityData = [
  { day: 'Mon', tasks: 12, projects: 5 },
  { day: 'Tue', tasks: 15, projects: 6 },
  { day: 'Wed', tasks: 18, projects: 8 },
  { day: 'Thu', tasks: 14, projects: 7 },
  { day: 'Fri', tasks: 20, projects: 9 },
  { day: 'Sat', tasks: 8, projects: 3 },
  { day: 'Sun', tasks: 5, projects: 2 },
];

const ReportsPage: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('month');
  const [isLoading, setIsLoading] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  
  const taskChartRef = useRef<HTMLDivElement>(null);
  const projectChartRef = useRef<HTMLDivElement>(null);
  const userChartRef = useRef<HTMLDivElement>(null);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Data refreshed",
        description: "Report data has been updated",
      });
    }, 1200);
  };

  const handleExportClick = () => {
    setShowExportDialog(true);
  };

  const handleExport = async (options: ExportOptions) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      switch (activeTab) {
        case 'tasks':
          await generateTaskReport(taskData, options);
          break;
        case 'users':
          await generateUserReport(userRoleData, options);
          break;
        case 'overview':
          await generateComprehensiveReport(
            {
              tasks: taskData,
              projects: projectStatusData,
              users: userRoleData
            },
            {
              taskCompletion: taskChartRef.current || undefined,
              projectProgress: projectChartRef.current || undefined,
              userActivity: userChartRef.current || undefined
            },
            options
          );
          break;
        default:
          await generateProjectReport(projectStatusData, options);
      }
      
      toast({
        title: "Report Generated",
        description: `Your ${activeTab} report has been downloaded`,
        // Change from "success" to "default" to match the allowed variant types
        variant: "default"
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Report Generation Failed",
        description: "There was an error creating your report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">
          View analytics and generate reports for your projects and tasks
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col md:flex-row justify-between w-full gap-4">
            <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="tasks" className="flex items-center gap-2">
                <PieChartIcon className="h-4 w-4" />
                <span>Tasks</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <LineChartIcon className="h-4 w-4" />
                <span>Users</span>
              </TabsTrigger>
            </TabsList>
          
            <div className="flex items-center gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleRefresh} 
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="icon">
                <PanelRight className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="default" 
                className="hidden md:flex items-center gap-2"
                onClick={handleExportClick}
                disabled={isLoading}
              >
                <FileText className="h-4 w-4" />
                <span>Export Report</span>
              </Button>
            </div>
          </div>

          <div className="md:hidden mt-4">
            <Button 
              variant="default" 
              className="w-full flex items-center justify-center gap-2"
              onClick={handleExportClick}
              disabled={isLoading}
            >
              <FileText className="h-4 w-4" />
              <span>Export Report</span>
            </Button>
          </div>

          <TabsContent value="overview" className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Task Completion</CardTitle>
                  <CardDescription>Tasks by completion status</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="h-[200px]" ref={taskChartRef}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Completed', value: 124, color: '#22c55e' },
                            { name: 'In Progress', value: 78, color: '#3b82f6' },
                            { name: 'Pending', value: 45, color: '#f59e0b' },
                            { name: 'Cancelled', value: 23, color: '#ef4444' },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {[
                            { name: 'Completed', value: 124, color: '#22c55e' },
                            { name: 'In Progress', value: 78, color: '#3b82f6' },
                            { name: 'Pending', value: 45, color: '#f59e0b' },
                            { name: 'Cancelled', value: 23, color: '#ef4444' },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20">
                      Completed: 124
                    </Badge>
                    <Badge variant="outline" className="bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20">
                      In Progress: 78
                    </Badge>
                    <Badge variant="outline" className="bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20">
                      Pending: 45
                    </Badge>
                    <Badge variant="outline" className="bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20">
                      Cancelled: 23
                    </Badge>
                  </div>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">User Roles</CardTitle>
                  <CardDescription>Distribution of user roles</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="h-[200px]" ref={userChartRef}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={userRoleData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {userRoleData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">
                    Total users: {userRoleData.reduce((sum, item) => sum + item.value, 0)}
                  </p>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Project Status</CardTitle>
                  <CardDescription>Tasks by project status</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="h-[200px]" ref={projectChartRef}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={projectStatusData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="tasks" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">
                    Total tasks: {projectStatusData.reduce((sum, item) => sum + item.tasks, 0)}
                  </p>
                </CardFooter>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Monthly Task Progress</CardTitle>
                    <CardDescription>Task completion over time</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={handleExportClick}
                  >
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={taskData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="completed" stackId="a" fill="#22c55e" />
                      <Bar dataKey="pending" stackId="a" fill="#f59e0b" />
                      <Bar dataKey="cancelled" stackId="a" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Task Completion Trend</CardTitle>
                    <CardDescription>Task completion rate over time</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleExportClick}>
                      <FileText className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={taskData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="completed" stroke="#22c55e" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="pending" stroke="#f59e0b" />
                      <Line type="monotone" dataKey="cancelled" stroke="#ef4444" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Task completion increased by 
                    <span className="text-green-500 font-medium"> 23% </span>
                    compared to last {timeRange}
                  </span>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>User Activity</CardTitle>
                    <CardDescription>Daily user activity</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleExportClick}>
                      <FileText className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={userActivityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="tasks" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="projects" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    User activity increased by 
                    <span className="text-green-500 font-medium"> 15% </span>
                    compared to last {timeRange}
                  </span>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {showExportDialog && (
        <ExportReportDialog
          isOpen={showExportDialog}
          onClose={() => setShowExportDialog(false)}
          onExport={handleExport}
          reportType={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        />
      )}
    </div>
  );
};

export default ReportsPage;
