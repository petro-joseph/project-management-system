
import React, { useState } from 'react';
import { Project, ProjectPhase, ProjectMilestone } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, addDays } from 'date-fns';
import { Milestone, CalendarRange, Plus, Edit, X, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { HexColorPicker } from 'react-colorful';
import { toast } from 'sonner';

interface ProjectTimelineProps {
  project: Project;
  onUpdate?: (updatedProject: Project) => void;
}

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ project, onUpdate }) => {
  const [showAddPhase, setShowAddPhase] = useState(false);
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [editingPhaseId, setEditingPhaseId] = useState<number | null>(null);
  const [editingMilestoneId, setEditingMilestoneId] = useState<number | null>(null);
  
  // Phase form states
  const [phaseForm, setPhaseForm] = useState({
    name: '',
    startDate: new Date(),
    endDate: addDays(new Date(), 7),
    color: '#3b82f6'
  });
  
  // Milestone form states
  const [milestoneForm, setMilestoneForm] = useState({
    name: '',
    description: '',
    dueDate: new Date(),
    completed: false,
    completedDate: null as Date | null
  });

  if (!project.timeline) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <CalendarRange className="h-5 w-5 mr-2" />
            Project Timeline
          </CardTitle>
          {onUpdate && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                const updatedProject = {
                  ...project,
                  timeline: {
                    startDate: new Date().toISOString(),
                    endDate: addDays(new Date(), 30).toISOString(),
                    phases: []
                  }
                };
                onUpdate(updatedProject);
                toast.success("Timeline initialized successfully");
              }}
            >
              Initialize Timeline
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No timeline data available for this project.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { startDate, endDate, phases } = project.timeline;
  const totalDuration = new Date(endDate).getTime() - new Date(startDate).getTime();
  
  const handleAddPhase = () => {
    if (!onUpdate) return;
    
    const newPhase: ProjectPhase = {
      id: Date.now(),
      name: phaseForm.name,
      startDate: phaseForm.startDate.toISOString(),
      endDate: phaseForm.endDate.toISOString(),
      color: phaseForm.color
    };
    
    const updatedProject = {
      ...project,
      timeline: {
        ...project.timeline,
        phases: [...(project.timeline.phases || []), newPhase]
      }
    };
    
    onUpdate(updatedProject);
    setShowAddPhase(false);
    setPhaseForm({
      name: '',
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      color: '#3b82f6'
    });
    toast.success(`Phase "${newPhase.name}" added successfully`);
  };
  
  const handleUpdatePhase = () => {
    if (!onUpdate || editingPhaseId === null) return;
    
    const updatedPhases = project.timeline.phases.map(phase => 
      phase.id === editingPhaseId 
        ? {
            ...phase,
            name: phaseForm.name,
            startDate: phaseForm.startDate.toISOString(),
            endDate: phaseForm.endDate.toISOString(),
            color: phaseForm.color
          }
        : phase
    );
    
    const updatedProject = {
      ...project,
      timeline: {
        ...project.timeline,
        phases: updatedPhases
      }
    };
    
    onUpdate(updatedProject);
    setEditingPhaseId(null);
    toast.success(`Phase "${phaseForm.name}" updated successfully`);
  };
  
  const handleDeletePhase = (phaseId: number) => {
    if (!onUpdate) return;
    
    const updatedPhases = project.timeline.phases.filter(phase => phase.id !== phaseId);
    
    const updatedProject = {
      ...project,
      timeline: {
        ...project.timeline,
        phases: updatedPhases
      }
    };
    
    onUpdate(updatedProject);
    toast.success("Phase deleted successfully");
  };
  
  const handleEditPhase = (phase: ProjectPhase) => {
    setPhaseForm({
      name: phase.name,
      startDate: new Date(phase.startDate),
      endDate: new Date(phase.endDate),
      color: phase.color
    });
    setEditingPhaseId(phase.id);
  };
  
  const handleAddMilestone = () => {
    if (!onUpdate) return;
    
    const newMilestone: ProjectMilestone = {
      id: Date.now(),
      name: milestoneForm.name,
      description: milestoneForm.description,
      dueDate: milestoneForm.dueDate.toISOString(),
      completed: milestoneForm.completed,
      completedDate: milestoneForm.completedDate ? milestoneForm.completedDate.toISOString() : undefined
    };
    
    const updatedProject = {
      ...project,
      milestones: [...(project.milestones || []), newMilestone]
    };
    
    onUpdate(updatedProject);
    setShowAddMilestone(false);
    setMilestoneForm({
      name: '',
      description: '',
      dueDate: new Date(),
      completed: false,
      completedDate: null
    });
    toast.success(`Milestone "${newMilestone.name}" added successfully`);
  };
  
  const handleUpdateMilestone = () => {
    if (!onUpdate || editingMilestoneId === null) return;
    
    const updatedMilestones = project.milestones.map(milestone => 
      milestone.id === editingMilestoneId 
        ? {
            ...milestone,
            name: milestoneForm.name,
            description: milestoneForm.description,
            dueDate: milestoneForm.dueDate.toISOString(),
            completed: milestoneForm.completed,
            completedDate: milestoneForm.completedDate ? milestoneForm.completedDate.toISOString() : undefined
          }
        : milestone
    );
    
    const updatedProject = {
      ...project,
      milestones: updatedMilestones
    };
    
    onUpdate(updatedProject);
    setEditingMilestoneId(null);
    toast.success(`Milestone "${milestoneForm.name}" updated successfully`);
  };
  
  const handleDeleteMilestone = (milestoneId: number) => {
    if (!onUpdate) return;
    
    const updatedMilestones = project.milestones.filter(milestone => milestone.id !== milestoneId);
    
    const updatedProject = {
      ...project,
      milestones: updatedMilestones
    };
    
    onUpdate(updatedProject);
    toast.success("Milestone deleted successfully");
  };
  
  const handleEditMilestone = (milestone: ProjectMilestone) => {
    setMilestoneForm({
      name: milestone.name,
      description: milestone.description,
      dueDate: new Date(milestone.dueDate),
      completed: milestone.completed,
      completedDate: milestone.completedDate ? new Date(milestone.completedDate) : null
    });
    setEditingMilestoneId(milestone.id);
  };
  
  const toggleMilestoneCompletion = (milestone: ProjectMilestone) => {
    if (!onUpdate) return;
    
    const updatedMilestone = {
      ...milestone,
      completed: !milestone.completed,
      completedDate: !milestone.completed ? new Date().toISOString() : undefined
    };
    
    const updatedMilestones = project.milestones.map(m => 
      m.id === milestone.id ? updatedMilestone : m
    );
    
    const updatedProject = {
      ...project,
      milestones: updatedMilestones
    };
    
    onUpdate(updatedProject);
    toast.success(`Milestone marked as ${updatedMilestone.completed ? 'completed' : 'pending'}`);
  };
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <CalendarRange className="h-5 w-5 mr-2" />
            Project Timeline
          </CardTitle>
          {onUpdate && (
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <CalendarRange className="h-4 w-4 mr-2" />
                    Timeline Range
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <div className="p-4 space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Start Date</h4>
                      <Calendar
                        mode="single"
                        selected={new Date(startDate)}
                        onSelect={(date) => {
                          if (!date || !onUpdate) return;
                          const updatedProject = {
                            ...project,
                            timeline: {
                              ...project.timeline,
                              startDate: date.toISOString()
                            }
                          };
                          onUpdate(updatedProject);
                        }}
                        initialFocus
                      />
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">End Date</h4>
                      <Calendar
                        mode="single"
                        selected={new Date(endDate)}
                        onSelect={(date) => {
                          if (!date || !onUpdate) return;
                          const updatedProject = {
                            ...project,
                            timeline: {
                              ...project.timeline,
                              endDate: date.toISOString()
                            }
                          };
                          onUpdate(updatedProject);
                        }}
                        initialFocus
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Button variant="outline" size="sm" onClick={() => setShowAddPhase(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Phase
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex justify-between text-sm mb-2">
            <div>{format(new Date(startDate), 'MMM d, yyyy')}</div>
            <div>{format(new Date(endDate), 'MMM d, yyyy')}</div>
          </div>
          
          <div className="h-12 bg-secondary rounded-lg overflow-hidden flex relative mb-6">
            {phases?.map((phase) => {
              const phaseStart = new Date(phase.startDate).getTime();
              const phaseEnd = new Date(phase.endDate).getTime();
              const startPosition = ((phaseStart - new Date(startDate).getTime()) / totalDuration) * 100;
              const width = ((phaseEnd - phaseStart) / totalDuration) * 100;
              
              return (
                <div 
                  key={phase.id}
                  className="absolute h-full flex items-center justify-center text-xs font-medium text-white truncate px-2 cursor-pointer group"
                  style={{ 
                    left: `${startPosition}%`, 
                    width: `${width}%`,
                    backgroundColor: phase.color || 'var(--primary)'
                  }}
                  title={`${phase.name}: ${format(new Date(phase.startDate), 'MMM d')} - ${format(new Date(phase.endDate), 'MMM d')}`}
                  onClick={() => onUpdate && handleEditPhase(phase)}
                >
                  <span className="z-10">{phase.name}</span>
                  {onUpdate && (
                    <div className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 flex space-x-1">
                      <button
                        className="bg-white/20 rounded-full p-0.5"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditPhase(phase);
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </button>
                      <button
                        className="bg-white/20 rounded-full p-0.5"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePhase(phase.id);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="flex items-center justify-between mt-8 mb-4">
            <h4 className="text-lg font-medium flex items-center">
              <Milestone className="h-5 w-5 mr-2" />
              Milestones
            </h4>
            {onUpdate && (
              <Button variant="outline" size="sm" onClick={() => setShowAddMilestone(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Milestone
              </Button>
            )}
          </div>
          
          {project.milestones && project.milestones.length > 0 ? (
            <div className="space-y-4">
              {project.milestones.map((milestone) => (
                <div 
                  key={milestone.id} 
                  className="flex items-start p-3 border rounded-lg hover:bg-secondary/50 transition-colors group"
                >
                  {onUpdate && (
                    <div className="mt-1 mr-2">
                      <button
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          milestone.completed ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground'
                        }`}
                        onClick={() => toggleMilestoneCompletion(milestone)}
                        title={milestone.completed ? "Mark as pending" : "Mark as completed"}
                      >
                        {milestone.completed && <Check className="h-3 w-3" />}
                      </button>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h5 className="font-medium">{milestone.name}</h5>
                      <Badge variant={milestone.completed ? "secondary" : "outline"}>
                        {milestone.completed ? "Completed" : "Pending"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                    <div className="mt-2 text-xs">
                      Due: {format(new Date(milestone.dueDate), 'MMM d, yyyy')}
                      {milestone.completed && milestone.completedDate && (
                        <span className="ml-2">
                          • Completed: {format(new Date(milestone.completedDate), 'MMM d, yyyy')}
                        </span>
                      )}
                    </div>
                  </div>
                  {onUpdate && (
                    <div className="opacity-0 group-hover:opacity-100 flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0" 
                        onClick={() => handleEditMilestone(milestone)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0" 
                        onClick={() => handleDeleteMilestone(milestone.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center">
              <p className="text-muted-foreground">No milestones have been created for this project.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add/Edit Phase Dialog */}
      <Dialog open={showAddPhase || editingPhaseId !== null} onOpenChange={(open) => {
        if (!open) {
          setShowAddPhase(false);
          setEditingPhaseId(null);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPhaseId !== null ? 'Edit Phase' : 'Add New Phase'}</DialogTitle>
            <DialogDescription>
              {editingPhaseId !== null 
                ? 'Update the phase details below.' 
                : 'Create a new phase for your project timeline.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="phase-name" className="text-sm font-medium">Phase Name</label>
              <Input
                id="phase-name"
                placeholder="Enter phase name"
                value={phaseForm.name}
                onChange={(e) => setPhaseForm({ ...phaseForm, name: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {format(phaseForm.startDate, 'MMM d, yyyy')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={phaseForm.startDate}
                      onSelect={(date) => date && setPhaseForm({ ...phaseForm, startDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {format(phaseForm.endDate, 'MMM d, yyyy')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={phaseForm.endDate}
                      onSelect={(date) => date && setPhaseForm({ ...phaseForm, endDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Color</label>
              <div className="flex items-start gap-4">
                <div 
                  className="w-10 h-10 rounded border"
                  style={{ backgroundColor: phaseForm.color }} 
                />
                <HexColorPicker 
                  color={phaseForm.color} 
                  onChange={(color) => setPhaseForm({ ...phaseForm, color })} 
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowAddPhase(false);
                setEditingPhaseId(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={editingPhaseId !== null ? handleUpdatePhase : handleAddPhase}
              disabled={!phaseForm.name || phaseForm.endDate < phaseForm.startDate}
            >
              {editingPhaseId !== null ? 'Update Phase' : 'Add Phase'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add/Edit Milestone Dialog */}
      <Dialog open={showAddMilestone || editingMilestoneId !== null} onOpenChange={(open) => {
        if (!open) {
          setShowAddMilestone(false);
          setEditingMilestoneId(null);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingMilestoneId !== null ? 'Edit Milestone' : 'Add New Milestone'}</DialogTitle>
            <DialogDescription>
              {editingMilestoneId !== null 
                ? 'Update the milestone details below.' 
                : 'Create a new milestone for your project.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="milestone-name" className="text-sm font-medium">Milestone Name</label>
              <Input
                id="milestone-name"
                placeholder="Enter milestone name"
                value={milestoneForm.name}
                onChange={(e) => setMilestoneForm({ ...milestoneForm, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="milestone-description" className="text-sm font-medium">Description</label>
              <Textarea
                id="milestone-description"
                placeholder="Enter milestone description"
                value={milestoneForm.description}
                onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Due Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {format(milestoneForm.dueDate, 'MMM d, yyyy')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={milestoneForm.dueDate}
                    onSelect={(date) => date && setMilestoneForm({ ...milestoneForm, dueDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {editingMilestoneId !== null && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="milestone-completed"
                  checked={milestoneForm.completed}
                  onChange={(e) => {
                    const completed = e.target.checked;
                    setMilestoneForm({ 
                      ...milestoneForm, 
                      completed,
                      completedDate: completed ? new Date() : null
                    });
                  }}
                  className="rounded border-gray-300"
                />
                <label htmlFor="milestone-completed" className="text-sm font-medium">
                  Mark as completed
                </label>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowAddMilestone(false);
                setEditingMilestoneId(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={editingMilestoneId !== null ? handleUpdateMilestone : handleAddMilestone}
              disabled={!milestoneForm.name}
            >
              {editingMilestoneId !== null ? 'Update Milestone' : 'Add Milestone'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectTimeline;
