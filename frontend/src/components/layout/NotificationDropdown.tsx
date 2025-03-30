
import React, { useState } from 'react';
import { Bell, Check, MailOpen, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Notification } from '@/lib/types';
import { cn, formatDate } from '@/lib/utils';

// Mock notification data
const initialNotifications: Notification[] = [
  {
    id: 1,
    title: 'Task Assignment',
    message: 'You have been assigned to a new task: "Update project documentation"',
    type: 'info',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    userId: 1,
    link: '/tasks'
  },
  {
    id: 2,
    title: 'Low Inventory Alert',
    message: 'Steel Rebar is running low. Current quantity: 15 pieces',
    type: 'warning',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    userId: 1,
    link: '/inventory'
  },
  {
    id: 3,
    title: 'Project Completed',
    message: 'The project "Office Renovation" has been marked as completed',
    type: 'success',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    userId: 1,
    link: '/projects'
  },
  {
    id: 4,
    title: 'Task Overdue',
    message: 'The task "Finalize budget report" is overdue by 2 days',
    type: 'error',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    userId: 1,
    link: '/tasks'
  },
  {
    id: 5,
    title: 'New Comment',
    message: 'John Smith commented on the task "Design project logo"',
    type: 'info',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    userId: 1,
  }
];

const NotificationDropdown: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  
  const handleMarkAsRead = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  const handleRemove = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };
  
  const handleClearAll = () => {
    setNotifications([]);
  };
  
  // Helper function to get notification icon based on type
  const getNotificationIcon = (type: 'info' | 'success' | 'warning' | 'error') => {
    switch (type) {
      case 'info':
        return <div className="rounded-full bg-blue-500/20 p-1"><Bell className="h-3 w-3 text-blue-500" /></div>;
      case 'success':
        return <div className="rounded-full bg-green-500/20 p-1"><Check className="h-3 w-3 text-green-500" /></div>;
      case 'warning':
        return <div className="rounded-full bg-amber-500/20 p-1"><Bell className="h-3 w-3 text-amber-500" /></div>;
      case 'error':
        return <div className="rounded-full bg-red-500/20 p-1"><Bell className="h-3 w-3 text-red-500" /></div>;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };
  
  // Helper function to get time string
  const getTimeString = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return formatDate(dateString);
    }
  };
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center px-1 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {notifications.length > 0 && (
            <div className="flex gap-1">
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2 text-xs"
                  onClick={handleMarkAllAsRead}
                >
                  <MailOpen className="mr-1 h-3 w-3" />
                  Mark all read
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 text-xs"
                onClick={handleClearAll}
              >
                <X className="mr-1 h-3 w-3" />
                Clear all
              </Button>
            </div>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {notifications.length > 0 ? (
          <>
            <ScrollArea className="h-[300px]">
              <DropdownMenuGroup>
                {notifications.map((notification) => (
                  <DropdownMenuItem 
                    key={notification.id}
                    className={cn(
                      "flex items-start p-3 cursor-pointer",
                      !notification.read && "bg-muted/50"
                    )}
                    onClick={() => {
                      if (notification.link && !notification.read) {
                        setNotifications(prev => 
                          prev.map(n => 
                            n.id === notification.id ? { ...n, read: true } : n
                          )
                        );
                        setIsOpen(false);
                        // In a real app, we would navigate to the link
                        console.log(`Navigating to: ${notification.link}`);
                      }
                    }}
                  >
                    <div className="flex gap-3 w-full">
                      <div className="mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between">
                          <p className={cn(
                            "text-sm font-medium",
                            !notification.read && "text-primary"
                          )}>
                            {notification.title}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {getTimeString(notification.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                    <div className="ml-2 flex flex-col gap-1">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => handleMarkAsRead(notification.id, e)}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => handleRemove(notification.id, e)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </ScrollArea>
          </>
        ) : (
          <div className="py-6 text-center">
            <MailOpen className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">No notifications</p>
            <p className="text-xs text-muted-foreground mt-1">
              You're all caught up!
            </p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
