
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getDashboardDataByUserRole } from '@/lib/mockData';
import { DashboardData } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatCard from './StatCard';
import ProjectsChart from './ProjectsChart';
import TasksChart from './TasksChart';
import RecentActivity from './RecentActivity';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Simulate API request
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (user) {
          const data = getDashboardDataByUserRole(user.id);
          setDashboardData(data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-7rem)]">
        <div className="animate-spin-slow h-12 w-12 rounded-full border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-7rem)]">
        <p className="text-lg text-muted-foreground">No dashboard data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}. Here's an overview of your workspace.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total Projects" 
              value={dashboardData.totalProjects} 
              icon="projects"
              trend="up"
              trendValue="12%"
              helperText="From last month"
            />
            <StatCard 
              title="Total Tasks" 
              value={dashboardData.totalTasks} 
              icon="tasks"
              trend="up"
              trendValue="8%"
              helperText="From last month"
            />
            <StatCard 
              title="Completed Tasks" 
              value={dashboardData.tasksByStatus.completed} 
              icon="completed"
              trend="up"
              trendValue="24%"
              helperText="From last month"
            />
            <StatCard 
              title="Team Members" 
              value={dashboardData.totalUsers} 
              icon="users"
              trend="same"
              trendValue="0%"
              helperText="No change"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProjectsChart projects={dashboardData.projects} />
            <TasksChart tasksByStatus={dashboardData.tasksByStatus} />
          </div>

          {/* Recent Activity */}
          <RecentActivity activities={dashboardData.recentActivity} />
        </TabsContent>

        <TabsContent value="projects" className="min-h-[300px]">
          <div className="grid grid-cols-1 gap-6">
            <ProjectsChart projects={dashboardData.projects} fullWidth />
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="min-h-[300px]">
          <div className="grid grid-cols-1 gap-6">
            <TasksChart tasksByStatus={dashboardData.tasksByStatus} fullWidth />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;
