
import React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Project {
  id: number;
  name: string;
  tasksCompleted: number;
  tasksTotal: number;
}

interface ProjectsChartProps {
  projects: Project[];
  fullWidth?: boolean;
}

const ProjectsChart: React.FC<ProjectsChartProps> = ({ projects, fullWidth = false }) => {
  // Prepare data for the chart
  const chartData = projects.map(project => {
    const completionPercentage = project.tasksTotal > 0 
      ? Math.round((project.tasksCompleted / project.tasksTotal) * 100) 
      : 0;
    
    const pendingTasks = project.tasksTotal - project.tasksCompleted;
    
    return {
      name: project.name,
      completed: project.tasksCompleted,
      pending: pendingTasks,
      completion: completionPercentage
    };
  });

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Project Progress</CardTitle>
        <CardDescription>
          Task completion status across all projects
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`h-[300px] ${fullWidth ? 'w-full' : 'w-full'}`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              barGap={0}
              barCategoryGap={fullWidth ? 30 : 20}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'completion') return [`${value}%`, 'Completion Rate'];
                  return [value, name === 'completed' ? 'Completed Tasks' : 'Pending Tasks'];
                }}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '8px',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                }}
                wrapperStyle={{ zIndex: 10 }}
              />
              <Legend wrapperStyle={{ paddingTop: 20 }} />
              <Bar 
                dataKey="completed" 
                stackId="a" 
                fill="#3b82f6" 
                name="Completed Tasks" 
                radius={[4, 4, 0, 0]} 
              />
              <Bar 
                dataKey="pending" 
                stackId="a" 
                fill="#94a3b8" 
                name="Pending Tasks" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectsChart;
