
import React, { useState, useEffect } from 'react';
import { Task, TaskTimeLog } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Timer, Play, Square, Clock, History } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface TaskTimeTrackingProps {
  task: Task;
  onUpdateTimeTracking?: (timeTracking: Task['timeTracking']) => Promise<void>;
}

const TaskTimeTracking: React.FC<TaskTimeTrackingProps> = ({ task, onUpdateTimeTracking }) => {
  const { user } = useAuth();
  const [isTracking, setIsTracking] = useState(false);
  const [timer, setTimer] = useState(0);
  const [currentStartTime, setCurrentStartTime] = useState<string | null>(null);
  
  const timeTracking = task.timeTracking || {
    estimatedHours: 0,
    loggedTime: [],
    totalTimeSpent: 0
  };
  
  // Format time (minutes) to hours and minutes
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  // Start timer
  const startTimer = () => {
    if (!user) return;
    
    const startTime = new Date().toISOString();
    setCurrentStartTime(startTime);
    setIsTracking(true);
    
    toast.success("Time tracking started");
  };
  
  // Stop timer and save time log
  const stopTimer = async () => {
    if (!user || !currentStartTime || !onUpdateTimeTracking) return;
    
    const endTime = new Date().toISOString();
    const startDate = new Date(currentStartTime);
    const endDate = new Date(endTime);
    const durationMinutes = Math.round((endDate.getTime() - startDate.getTime()) / 60000);
    
    // Create new time log entry
    const newTimeLog: TaskTimeLog = {
      id: Date.now(),
      startTime: currentStartTime,
      endTime,
      duration: durationMinutes,
      userId: user.id
    };
    
    // Update timeTracking with new log and total time
    const updatedTimeTracking = {
      ...timeTracking,
      loggedTime: [...(timeTracking.loggedTime || []), newTimeLog],
      totalTimeSpent: (timeTracking.totalTimeSpent || 0) + durationMinutes
    };
    
    try {
      await onUpdateTimeTracking(updatedTimeTracking);
      setIsTracking(false);
      setCurrentStartTime(null);
      setTimer(0);
      
      toast.success(`Time logged: ${formatTime(durationMinutes)}`);
    } catch (error) {
      console.error('Failed to save time log:', error);
      toast.error("Failed to save time log");
    }
  };
  
  // Timer effect
  useEffect(() => {
    let interval: number | null = null;
    
    if (isTracking && currentStartTime) {
      interval = window.setInterval(() => {
        const startDate = new Date(currentStartTime);
        const now = new Date();
        const elapsedMinutes = Math.round((now.getTime() - startDate.getTime()) / 60000);
        setTimer(elapsedMinutes);
      }, 60000); // Update every minute
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, currentStartTime]);
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Timer className="h-5 w-5 mr-2" />
          Time Tracking
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="p-3 border rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Estimated Time</div>
            <div className="text-xl font-semibold">{formatTime(timeTracking.estimatedHours * 60)}</div>
          </div>
          
          <div className="p-3 border rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Time Spent</div>
            <div className="text-xl font-semibold">{formatTime(timeTracking.totalTimeSpent)}</div>
          </div>
        </div>
        
        {isTracking && (
          <div className="p-4 border rounded-lg bg-secondary/50 mb-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center text-sm font-medium mb-1">
                  <Clock className="h-4 w-4 mr-1 animate-pulse text-primary" />
                  Timer Running
                </div>
                <div className="text-2xl font-bold">
                  {formatTime(timer)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Started at {format(new Date(currentStartTime!), 'p')}
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white hover:bg-red-50 border-red-200 text-red-500 hover:text-red-600"
                onClick={stopTimer}
              >
                <Square className="h-4 w-4 mr-2" />
                Stop
              </Button>
            </div>
          </div>
        )}
        
        {!isTracking && onUpdateTimeTracking && (
          <Button 
            variant="outline" 
            className="w-full mb-4"
            onClick={startTimer}
          >
            <Play className="h-4 w-4 mr-2" />
            Start Timer
          </Button>
        )}
        
        <h4 className="text-md font-medium mt-6 mb-3 flex items-center">
          <History className="h-4 w-4 mr-2" />
          Time Log History
        </h4>
        
        {timeTracking.loggedTime && timeTracking.loggedTime.length > 0 ? (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {timeTracking.loggedTime.map((log) => (
              <div key={log.id} className="flex justify-between items-center p-2 border-b text-sm">
                <div>
                  <div className="font-medium">{formatTime(log.duration)}</div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(log.startTime), 'MMM d, p')}
                    {log.endTime && ` - ${format(new Date(log.endTime), 'p')}`}
                  </div>
                </div>
                <Badge variant="outline">{log.note || "No description"}</Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-muted-foreground border rounded-lg">
            No time entries recorded
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskTimeTracking;
