
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import UserDetails from './UserDetails';
import { users as mockUsers } from '@/lib/mockData';
import { toast } from 'sonner';

const UserDetailsPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const foundUser = mockUsers.find(u => u.id === Number(userId));
        
        if (foundUser) {
          setUser(foundUser);
        } else {
          toast.error("User not found");
          navigate('/users');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error("Failed to load user details");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin-slow h-12 w-12 rounded-full border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/users')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
          <p className="text-muted-foreground">The requested user does not exist or has been deleted.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/users')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
      </div>
      
      <UserDetails user={user} />
    </div>
  );
};

export default UserDetailsPage;
