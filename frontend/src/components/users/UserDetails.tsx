
import React, { useState } from 'react';
import { User } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserActivityLog from './UserActivityLog';
import UserPerformance from './UserPerformance';
import UserAvailability from './UserAvailability';
import UserMessaging from './UserMessaging';
import UserOnboarding from './UserOnboarding';

interface UserDetailsProps {
  user: User;
}

const UserDetails: React.FC<UserDetailsProps> = ({ user }) => {
  const [activeUser, setActiveUser] = useState<User>(user);

  const handleAvailabilityChange = (status: any) => {
    setActiveUser({
      ...activeUser,
      availability: status
    });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <Avatar className="h-20 w-20">
              <AvatarImage src={activeUser.avatar} />
              <AvatarFallback className="text-2xl">{activeUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <CardTitle className="text-2xl">{activeUser.name}</CardTitle>
              <CardDescription className="text-base mt-1">{activeUser.email}</CardDescription>
              <div className="flex items-center gap-2 mt-2">
                <div className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs font-medium">
                  {activeUser.role.charAt(0).toUpperCase() + activeUser.role.slice(1)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Joined {new Date(activeUser.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <UserAvailability 
              user={activeUser} 
              onStatusChange={handleAvailabilityChange} 
            />
          </div>
        </CardHeader>
      </Card>
      
      <Tabs defaultValue="activity" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity" className="space-y-6 mt-6">
          <UserActivityLog userId={activeUser.id} />
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-6 mt-6">
          <UserPerformance user={activeUser} />
        </TabsContent>
        
        <TabsContent value="collaboration" className="space-y-6 mt-6">
          <UserMessaging currentUser={activeUser} />
        </TabsContent>
        
        <TabsContent value="onboarding" className="space-y-6 mt-6">
          <UserOnboarding userRole={activeUser.role} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDetails;
