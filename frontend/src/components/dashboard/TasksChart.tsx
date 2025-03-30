
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface TasksByStatus {
  pending: number;
  'in-progress': number;
  completed: number;
  cancelled: number;
}

interface TasksChartProps {
  tasksByStatus: TasksByStatus;
  fullWidth?: boolean;
}

const TasksChart: React.FC<TasksChartProps> = ({ tasksByStatus, fullWidth = false }) => {
  // Define colors for each status
  const statusColors = {
    pending: '#f59e0b',       // Amber-500
    'in-progress': '#3b82f6',  // Blue-500
    completed: '#10b981',     // Emerald-500
    cancelled: '#ef4444'      // Red-500
  };

  // Transform data for the chart
  const chartData = Object.entries(tasksByStatus).map(([status, count]) => ({
    name: status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    color: statusColors[status as keyof typeof statusColors]
  })).filter(item => item.value > 0);

  // Calculate total tasks
  const totalTasks = Object.values(tasksByStatus).reduce((sum, count) => sum + count, 0);

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Tasks Status</CardTitle>
        <CardDescription>
          Distribution of tasks by current status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`h-[300px] ${fullWidth ? 'w-full' : 'w-full'}`}>
          {totalTasks > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} tasks`, 'Count']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No task data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TasksChart;
