
import React, { useState } from 'react';
import { Task } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, ArrowRight, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getTaskById } from '@/lib/mockData';

interface TaskDependenciesProps {
  task: Task;
  onUpdate?: (dependencies: number[]) => Promise<void>;
}

const TaskDependencies: React.FC<TaskDependenciesProps> = ({ task, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  
  const dependencies = task.dependencies || [];
  
  const handleRemoveDependency = async (dependencyId: number) => {
    if (!onUpdate) return;
    
    const newDependencies = dependencies.filter(id => id !== dependencyId);
    try {
      await onUpdate(newDependencies);
    } catch (error) {
      console.error('Failed to update dependencies:', error);
    }
  };
  
  const handleAddDependency = async () => {
    if (!selectedTaskId || !onUpdate) return;
    
    // Prevent adding the task as its own dependency
    if (selectedTaskId === task.id) return;
    
    // Prevent adding duplicates
    if (dependencies.includes(selectedTaskId)) return;
    
    const newDependencies = [...dependencies, selectedTaskId];
    try {
      await onUpdate(newDependencies);
      setIsAdding(false);
      setSelectedTaskId(null);
    } catch (error) {
      console.error('Failed to add dependency:', error);
    }
  };
  
  const getTaskStatusColor = (status: string | undefined) => {
    if (!status) return 'bg-gray-300'; // Add a default for undefined status
    
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'pending': return 'bg-amber-500';
      case 'cancelled': return 'bg-destructive';
      default: return 'bg-secondary';
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Link className="h-5 w-5 mr-2" />
          Dependencies
        </CardTitle>
      </CardHeader>
      <CardContent>
        {dependencies.length > 0 ? (
          <div className="space-y-3">
            {dependencies.map(depId => {
              const dependencyTask = getTaskById(depId);
              return (
                <div key={depId} className="flex items-center justify-between p-3 border rounded-lg group">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getTaskStatusColor(dependencyTask?.status)}`} />
                    <span className="font-medium">{dependencyTask?.title || `Task #${depId}`}</span>
                    
                    {dependencyTask && (
                      <Badge variant={
                        dependencyTask.status === 'completed' ? 'secondary' : 
                        dependencyTask.status === 'in-progress' ? 'default' :
                        'outline'
                      }>
                        {dependencyTask.status}
                      </Badge>
                    )}
                  </div>
                  
                  {onUpdate && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="opacity-0 group-hover:opacity-100 transition-opacity" 
                      onClick={() => handleRemoveDependency(depId)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            No dependencies set for this task
          </div>
        )}
        
        {onUpdate && (
          <div className="mt-4">
            {isAdding ? (
              <div className="space-y-3">
                <select 
                  className="w-full p-2 border rounded-md"
                  value={selectedTaskId || ''}
                  onChange={e => setSelectedTaskId(Number(e.target.value))}
                >
                  <option value="">Select a task...</option>
                  {/* This would ideally be populated with a filtered list of tasks */}
                  <option value="1">Design database schema</option>
                  <option value="2">Implement user authentication</option>
                  <option value="3">Create dashboard UI</option>
                </select>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={handleAddDependency}
                    disabled={!selectedTaskId}
                  >
                    Add
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setIsAdding(false);
                      setSelectedTaskId(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => setIsAdding(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Dependency
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskDependencies;
