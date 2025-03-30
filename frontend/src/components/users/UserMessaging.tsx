
import React, { useState } from 'react';
import { User, UserMessage } from '@/lib/types';
import { 
  Send, 
  Search, 
  MessageCircle, 
  Users,
  Plus,
  X,
  CheckCheck
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { toast } from 'sonner';

// Mock data for team members
const mockTeamMembers: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    createdAt: '2023-01-01',
    avatar: 'https://i.pravatar.cc/150?u=1',
    availability: 'available'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'manager',
    createdAt: '2023-01-02',
    avatar: 'https://i.pravatar.cc/150?u=2',
    availability: 'busy'
  },
  {
    id: 3,
    name: 'Robert Johnson',
    email: 'robert@example.com',
    role: 'user',
    createdAt: '2023-01-03',
    availability: 'away'
  },
  {
    id: 4,
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    role: 'user',
    createdAt: '2023-01-04',
    avatar: 'https://i.pravatar.cc/150?u=4',
    availability: 'available'
  },
  {
    id: 5,
    name: 'Michael Brown',
    email: 'michael@example.com',
    role: 'manager',
    createdAt: '2023-01-05',
    availability: 'offline'
  }
];

// Mock data for messages
const mockMessages: UserMessage[] = [
  {
    id: 1,
    senderId: 2,
    senderName: 'Jane Smith',
    recipientId: 1,
    recipientName: 'John Doe',
    content: 'Hi John, could you review the project proposal when you get a chance?',
    timestamp: '2023-06-01T09:30:00Z',
    read: true
  },
  {
    id: 2,
    senderId: 1,
    senderName: 'John Doe',
    recipientId: 2,
    recipientName: 'Jane Smith',
    content: 'Sure, I\'ll take a look at it this afternoon.',
    timestamp: '2023-06-01T09:35:00Z',
    read: true
  },
  {
    id: 3,
    senderId: 2,
    senderName: 'Jane Smith',
    recipientId: 1,
    recipientName: 'John Doe',
    content: 'Thanks! Also, are you coming to the team meeting at 2pm?',
    timestamp: '2023-06-01T10:15:00Z',
    read: true
  },
  {
    id: 4,
    senderId: 1,
    senderName: 'John Doe',
    recipientId: 2,
    recipientName: 'Jane Smith',
    content: 'Yes, I\'ll be there. I have some ideas I want to share about the new feature.',
    timestamp: '2023-06-01T10:20:00Z',
    read: true
  },
  {
    id: 5,
    senderId: 3,
    senderName: 'Robert Johnson',
    recipientId: 1,
    recipientName: 'John Doe',
    content: 'John, I need help with the database query we discussed yesterday.',
    timestamp: '2023-06-01T11:05:00Z',
    read: false
  }
];

interface UserMessagingProps {
  currentUser: User;
}

const UserMessaging: React.FC<UserMessagingProps> = ({ currentUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<UserMessage[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [teamMembers] = useState<User[]>(mockTeamMembers);
  
  // Filter team members based on search
  const filteredTeamMembers = teamMembers
    .filter(member => member.id !== currentUser.id)
    .filter(member => 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
  // Get conversation messages
  const conversationMessages = messages.filter(msg => 
    (msg.senderId === currentUser.id && msg.recipientId === selectedUser?.id) ||
    (msg.recipientId === currentUser.id && msg.senderId === selectedUser?.id)
  ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  
  // Get unread message count for a user
  const getUnreadCount = (userId: number) => {
    return messages.filter(msg => 
      msg.senderId === userId && 
      msg.recipientId === currentUser.id && 
      !msg.read
    ).length;
  };
  
  // Handle sending new message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return;
    
    const newMsg: UserMessage = {
      id: messages.length + 1,
      senderId: currentUser.id,
      senderName: currentUser.name,
      recipientId: selectedUser.id,
      recipientName: selectedUser.name,
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
    toast.success('Message sent');
  };
  
  // Mark messages as read when selected
  const markAsRead = () => {
    if (!selectedUser) return;
    
    setMessages(messages.map(msg => 
      msg.senderId === selectedUser.id && 
      msg.recipientId === currentUser.id && 
      !msg.read
        ? { ...msg, read: true }
        : msg
    ));
  };
  
  // Select a user to chat with
  const selectUser = (user: User) => {
    setSelectedUser(user);
    // Mark messages as read when selecting a user
    markAsRead();
  };

  return (
    <Card className="shadow-md h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle>Team Collaboration</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col md:flex-row gap-4 overflow-hidden p-0">
        <Tabs defaultValue="messages" className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 pb-3">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="teams">Teams</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="messages" className="flex-1 flex flex-col overflow-hidden m-0 border-t">
            <div className="flex flex-col md:flex-row h-full">
              {/* Team Members Sidebar */}
              <div className="w-full md:w-64 border-r overflow-hidden flex flex-col">
                <div className="p-3 border-b">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search team..."
                      className="pl-8 w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <ScrollArea className="flex-1">
                  <div className="p-2">
                    {filteredTeamMembers.map(member => {
                      const unreadCount = getUnreadCount(member.id);
                      return (
                        <div 
                          key={member.id}
                          className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-secondary ${selectedUser?.id === member.id ? 'bg-secondary' : ''}`}
                          onClick={() => selectUser(member)}
                        >
                          <div className="relative">
                            <Avatar>
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${
                              member.availability === 'available' ? 'bg-green-500' :
                              member.availability === 'busy' ? 'bg-amber-500' :
                              member.availability === 'away' ? 'bg-blue-500' :
                              'bg-gray-500'
                            }`}></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{member.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{member.role}</p>
                          </div>
                          {unreadCount > 0 && (
                            <Badge variant="default" className="ml-auto">{unreadCount}</Badge>
                          )}
                        </div>
                      );
                    })}
                    
                    {filteredTeamMembers.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-8 text-center px-3">
                        <Users className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">No team members found</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
              
              {/* Chat Area */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {selectedUser ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-3 border-b flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={selectedUser.avatar} />
                          <AvatarFallback>{selectedUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{selectedUser.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {selectedUser.availability === 'available' ? 'Available' :
                             selectedUser.availability === 'busy' ? 'Busy' :
                             selectedUser.availability === 'away' ? 'Away' :
                             'Offline'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Messages */}
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {conversationMessages.map(msg => {
                          const isCurrentUser = msg.senderId === currentUser.id;
                          
                          return (
                            <div 
                              key={msg.id} 
                              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`max-w-[75%] ${isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-secondary'} rounded-lg px-4 py-2`}>
                                <p className="text-sm">{msg.content}</p>
                                <div className={`text-xs ${isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'} flex items-center mt-1`}>
                                  {format(new Date(msg.timestamp), 'HH:mm')}
                                  {isCurrentUser && (
                                    <CheckCheck className="h-3 w-3 ml-1" />
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        
                        {conversationMessages.length === 0 && (
                          <div className="flex flex-col items-center justify-center py-12 text-center">
                            <MessageCircle className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">No messages yet</p>
                            <p className="text-xs text-muted-foreground mt-1">Send a message to start a conversation</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                    
                    {/* Message Input */}
                    <div className="p-3 border-t">
                      <div className="flex gap-2">
                        <Textarea
                          placeholder="Type a message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="min-h-[60px] resize-none"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                        />
                        <Button 
                          size="icon" 
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No conversation selected</h3>
                    <p className="text-muted-foreground text-center max-w-xs mt-2">
                      Select a team member from the list to start a conversation
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="teams" className="flex-1 flex flex-col overflow-hidden m-0 border-t">
            <div className="p-4 flex flex-col items-center justify-center h-full">
              <Users className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Team Collaboration</h3>
              <p className="text-muted-foreground text-center max-w-md mt-2 mb-6">
                Create and manage teams for better collaboration and communication.
              </p>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create New Team
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserMessaging;
