
import React, { useState } from 'react';
import { Role, OnboardingResource } from '@/lib/types';
import {
  BookOpen,
  Video,
  FileText,
  CheckCircle2,
  Play,
  BookOpenCheck,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

// Mock data for onboarding resources
const mockOnboardingResources: OnboardingResource[] = [
  {
    id: 1,
    title: 'Getting Started with Project Managment System',
    description: 'An introduction to the basic features and navigation of the system.',
    type: 'video',
    content: 'https://example.com/videos/getting-started.mp4',
    duration: 15,
    requiredForRoles: ['admin', 'manager', 'user']
  },
  {
    id: 2,
    title: 'Project Management Fundamentals',
    description: 'Learn how to create and manage projects effectively.',
    type: 'article',
    content: 'https://example.com/articles/project-management.html',
    duration: 10,
    requiredForRoles: ['admin', 'manager', 'user']
  },
  {
    id: 3,
    title: 'Advanced User Management',
    description: 'Learn how to manage users, roles, and permissions.',
    type: 'video',
    content: 'https://example.com/videos/user-management.mp4',
    duration: 20,
    requiredForRoles: ['admin', 'manager']
  },
  {
    id: 4,
    title: 'Task Management Best Practices',
    description: 'Tips and techniques for efficient task management.',
    type: 'article',
    content: 'https://example.com/articles/task-management.html',
    duration: 12,
    requiredForRoles: ['admin', 'manager', 'user']
  },
  {
    id: 5,
    title: 'Inventory Management Essentials',
    description: 'How to track and manage inventory effectively.',
    type: 'video',
    content: 'https://example.com/videos/inventory-management.mp4',
    duration: 18,
    requiredForRoles: ['admin', 'manager']
  },
  {
    id: 6,
    title: 'Report Generation and Analysis',
    description: 'Creating and interpreting reports for business insights.',
    type: 'interactive',
    content: 'https://example.com/interactive/reports-tutorial',
    duration: 25,
    requiredForRoles: ['admin', 'manager']
  },
  {
    id: 7,
    title: 'System Security Guidelines',
    description: 'Best practices for maintaining system security.',
    type: 'quiz',
    content: 'https://example.com/quizzes/security',
    duration: 15,
    requiredForRoles: ['admin']
  }
];

// Mock completed resources
const mockCompletedResources = [1, 2, 4];

interface UserOnboardingProps {
  userRole: Role;
}

const UserOnboarding: React.FC<UserOnboardingProps> = ({ userRole }) => {
  const [selectedResource, setSelectedResource] = useState<OnboardingResource | null>(null);
  const [resourceDialogOpen, setResourceDialogOpen] = useState(false);
  const [completedResources, setCompletedResources] = useState<number[]>(mockCompletedResources);

  // Filter resources based on user role
  const relevantResources = mockOnboardingResources.filter(resource =>
    resource.requiredForRoles.includes(userRole)
  );

  // Calculate onboarding progress
  const onboardingProgress =
    relevantResources.length > 0
      ? Math.round((completedResources.filter(id =>
        relevantResources.some(resource => resource.id === id)
      ).length / relevantResources.length) * 100)
      : 0;

  // Get resource icon based on type
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-5 w-5 text-primary" />;
      case 'article':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'quiz':
        return <BookOpen className="h-5 w-5 text-purple-500" />;
      case 'interactive':
        return <Sparkles className="h-5 w-5 text-amber-500" />;
      default:
        return <BookOpen className="h-5 w-5 text-gray-500" />;
    }
  };

  // Mark resource as completed
  const markAsCompleted = (resourceId: number) => {
    if (!completedResources.includes(resourceId)) {
      setCompletedResources([...completedResources, resourceId]);
      toast.success("Resource marked as completed!");
    }
    setResourceDialogOpen(false);
  };

  // View resource details
  const viewResource = (resource: OnboardingResource) => {
    setSelectedResource(resource);
    setResourceDialogOpen(true);
  };

  return (
    <>
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Onboarding & Training</CardTitle>
              <CardDescription>
                Resources to help you get the most out of the system
              </CardDescription>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Progress</span>
                <span className="font-medium">{onboardingProgress}%</span>
              </div>
              <Progress value={onboardingProgress} className="w-24 h-2" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <GraduationCap className="h-5 w-5 mr-2 text-primary" />
              <h3 className="text-lg font-medium">Your Learning Path</h3>
            </div>

            <div className="flex items-center p-4 bg-secondary/50 rounded-md mb-6">
              <BookOpenCheck className="h-8 w-8 text-primary mr-3" />
              <div>
                <h4 className="font-medium">Complete Your Onboarding</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  You have completed {completedResources.filter(id =>
                    relevantResources.some(resource => resource.id === id)
                  ).length} of {relevantResources.length} required resources
                </p>
                <Progress value={onboardingProgress} className="mt-2 h-2" />
              </div>
            </div>
          </div>

          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {relevantResources.map(resource => {
                const isCompleted = completedResources.includes(resource.id);

                return (
                  <div
                    key={resource.id}
                    className={`p-4 border rounded-md transition-all hover:border-primary hover:shadow-sm ${isCompleted ? 'bg-secondary/30' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{getResourceIcon(resource.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{resource.title}</h4>
                          <Badge variant={isCompleted ? 'outline' : 'default'}>
                            {isCompleted ? (
                              <span className="flex items-center">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Completed
                              </span>
                            ) : `${resource.duration} min`}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                        <div className="flex items-center justify-between mt-4">
                          <Badge variant="outline" className="capitalize">{resource.type}</Badge>
                          <Button
                            variant={isCompleted ? "outline" : "default"}
                            size="sm"
                            className="h-8 gap-1"
                            onClick={() => viewResource(resource)}
                          >
                            {isCompleted ? 'Review' : <><Play className="h-3 w-3" /> Start</>}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={resourceDialogOpen} onOpenChange={setResourceDialogOpen}>
        {selectedResource && (
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getResourceIcon(selectedResource.type)}
                {selectedResource.title}
              </DialogTitle>
              <DialogDescription>
                {selectedResource.description}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <div className="p-6 border rounded-md bg-secondary/30 flex flex-col items-center justify-center min-h-[200px] mb-4">
                {selectedResource.type === 'video' && (
                  <div className="text-center">
                    <Video className="h-12 w-12 text-muted-foreground mb-3" />
                    <p className="font-medium mb-1">Video Content</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Duration: {selectedResource.duration} minutes
                    </p>
                    <Button>
                      <Play className="h-4 w-4 mr-2" />
                      Watch Video
                    </Button>
                  </div>
                )}

                {selectedResource.type === 'article' && (
                  <div className="text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mb-3" />
                    <p className="font-medium mb-1">Article Content</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Reading time: {selectedResource.duration} minutes
                    </p>
                    <Button>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Read Article
                    </Button>
                  </div>
                )}

                {selectedResource.type === 'quiz' && (
                  <div className="text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground mb-3" />
                    <p className="font-medium mb-1">Quiz Content</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Estimated time: {selectedResource.duration} minutes
                    </p>
                    <Button>
                      <Play className="h-4 w-4 mr-2" />
                      Start Quiz
                    </Button>
                  </div>
                )}

                {selectedResource.type === 'interactive' && (
                  <div className="text-center">
                    <Sparkles className="h-12 w-12 text-muted-foreground mb-3" />
                    <p className="font-medium mb-1">Interactive Tutorial</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Duration: {selectedResource.duration} minutes
                    </p>
                    <Button>
                      <Play className="h-4 w-4 mr-2" />
                      Start Tutorial
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => markAsCompleted(selectedResource.id)}
                  className="gap-2"
                  disabled={completedResources.includes(selectedResource.id)}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {completedResources.includes(selectedResource.id)
                    ? 'Already Completed'
                    : 'Mark as Completed'}
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default UserOnboarding;
