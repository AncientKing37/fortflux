
import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useSocket } from '@/contexts/SocketContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, Users, Clock, MessageSquare, UserX, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { supportChatService, SupportChat, SupportMessage } from '@/services/supabaseService';

const SupportDashboard = () => {
  const { user } = useUser();
  const { socket, connected, joinRoom, leaveRoom } = useSocket();
  
  const [chats, setChats] = useState<SupportChat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [message, setMessage] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [userIsTyping, setUserIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  
  // Check if user is an admin or escrow
  const isAdmin = user?.role === 'admin' || user?.role === 'escrow';
  
  useEffect(() => {
    if (!isAdmin) return;
    
    fetchSupportChats();
    
    // Set up socket listeners
    if (socket && connected) {
      // Join admin support room
      joinRoom('admin_support');
      
      // Listen for new support messages
      socket.on('new_support_chat', handleNewSupportChat);
      
      // Listen for support chat updates
      socket.on('support_chat_updated', handleSupportChatUpdated);
      
      // Set admin availability
      socket.emit('set_support_availability', { available: isAvailable });
      
      return () => {
        leaveRoom('admin_support');
        socket.off('new_support_chat');
        socket.off('support_chat_updated');
      };
    }
  }, [isAdmin, socket, connected]);
  
  // Join active chat room
  useEffect(() => {
    if (!isAdmin || !activeChat || !socket || !connected) return;
    
    const roomId = `support_${activeChat}`;
    joinRoom(roomId);
    
    // Fetch chat messages
    fetchChatMessages(activeChat);
    
    // Listen for new messages
    socket.on('support_message', handleNewMessage);
    
    // Listen for typing indicators
    socket.on('support_typing', handleTypingIndicator);
    
    // Mark messages as read
    markChatAsRead(activeChat);
    
    return () => {
      leaveRoom(roomId);
      socket.off('support_message');
      socket.off('support_typing');
    };
  }, [activeChat, isAdmin, socket, connected]);
  
  const fetchSupportChats = async () => {
    try {
      setIsLoadingChats(true);
      const supportChats = await supportChatService.getSupportChats();
      setChats(supportChats);
    } catch (error) {
      console.error('Error fetching support chats:', error);
      toast.error('Failed to load support chats');
    } finally {
      setIsLoadingChats(false);
    }
  };
  
  const fetchChatMessages = async (userId: string) => {
    try {
      setIsLoadingMessages(true);
      const supportMessages = await supportChatService.getSupportMessages(userId);
      setMessages(supportMessages);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      toast.error('Failed to load chat messages');
    } finally {
      setIsLoadingMessages(false);
    }
  };
  
  const handleNewSupportChat = (chat: any) => {
    const newChat: SupportChat = {
      id: chat.id || chat.userId,
      userId: chat.userId,
      username: chat.username,
      avatar: chat.avatar,
      lastMessage: chat.lastMessage,
      lastMessageTime: new Date(chat.lastMessageTime),
      unreadCount: chat.unread,
      isActive: chat.isActive
    };
    
    setChats(prev => {
      // Check if chat already exists
      const exists = prev.some(c => c.userId === newChat.userId);
      
      if (exists) {
        // Update existing chat
        return prev.map(c => 
          c.userId === newChat.userId ? newChat : c
        ).sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime());
      } else {
        // Add new chat and sort
        return [newChat, ...prev].sort((a, b) => 
          b.lastMessageTime.getTime() - a.lastMessageTime.getTime()
        );
      }
    });
  };
  
  const handleSupportChatUpdated = (chat: any) => {
    setChats(prev => 
      prev.map(c => 
        c.userId === chat.userId 
          ? {
              ...c,
              lastMessage: chat.lastMessage,
              lastMessageTime: new Date(chat.lastMessageTime),
              unreadCount: chat.unread,
              isActive: chat.isActive
            }
          : c
      ).sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime())
    );
  };
  
  const handleNewMessage = (msg: any) => {
    if (msg.roomId === `support_${activeChat}`) {
      const newMessage: SupportMessage = {
        id: msg.id || Date.now().toString(),
        userId: msg.userId || activeChat,
        senderId: msg.senderId,
        senderName: msg.senderName,
        senderAvatar: msg.senderAvatar,
        content: msg.content,
        isAdmin: msg.isAdmin,
        createdAt: new Date(msg.timestamp || msg.createdAt)
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      // Mark message as read since we're in the active chat
      markChatAsRead(activeChat);
    }
  };
  
  const handleTypingIndicator = (data: any) => {
    if (data.roomId === `support_${activeChat}` && data.userId !== user?.id) {
      setUserIsTyping(data.isTyping);
    }
  };
  
  const markChatAsRead = async (userId: string) => {
    const success = await supportChatService.markChatAsRead(userId);
    
    if (success) {
      // Update local state
      setChats(prev => 
        prev.map(c => 
          c.userId === userId ? { ...c, unreadCount: 0 } : c
        )
      );
    }
  };
  
  const handleChatSelect = (userId: string) => {
    setActiveChat(userId);
  };
  
  const handleAvailabilityToggle = () => {
    const newAvailability = !isAvailable;
    setIsAvailable(newAvailability);
    
    // Update availability status
    if (socket && connected) {
      socket.emit('set_support_availability', { available: newAvailability });
    }
  };
  
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Emit typing indicator
    if (socket && connected && user && activeChat) {
      const roomId = `support_${activeChat}`;
      socket.emit('support_typing', { isTyping: true, userId: user.id, roomId });
      
      // Clear previous timeout
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      
      // Set new timeout to stop typing indicator after 2 seconds
      const timeout = setTimeout(() => {
        if (socket && connected) {
          socket.emit('support_typing', { isTyping: false, userId: user.id, roomId });
        }
      }, 2000);
      
      setTypingTimeout(timeout);
    }
  };
  
  const sendMessage = () => {
    if (!message.trim() || !user || !socket || !connected || !activeChat) return;
    
    const roomId = `support_${activeChat}`;
    const newMessage = {
      senderId: user.id,
      content: message,
      timestamp: new Date(),
      senderName: user.username,
      senderAvatar: user.avatar,
      isAdmin: true,
      userId: activeChat
    };
    
    // Emit message to server
    socket.emit('support_message', {
      ...newMessage,
      roomId
    });
    
    // Add message to local state
    setMessages(prev => [...prev, { ...newMessage, id: Date.now().toString(), createdAt: new Date() }]);
    
    // Clear input
    setMessage('');
    
    // Clear typing indicator
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    socket.emit('support_typing', { isTyping: false, userId: user.id, roomId });
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.round(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.round(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };
  
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access the support dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href="/dashboard">Return to Dashboard</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Support Dashboard</h1>
        <div className="flex items-center mt-2">
          <Badge 
            variant={isAvailable ? "default" : "outline"}
            className={cn(
              "cursor-pointer",
              isAvailable ? "bg-green-500" : "text-gray-500"
            )}
            onClick={handleAvailabilityToggle}
          >
            {isAvailable ? "Available" : "Unavailable"}
          </Badge>
          <span className="text-sm text-gray-500 ml-2">
            {isAvailable 
              ? "You are visible to users for support requests" 
              : "You are not visible to users for support requests"}
          </span>
        </div>
      </div>
      
      <Tabs defaultValue="active">
        <TabsList className="mb-4">
          <TabsTrigger value="active" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Active Chats
          </TabsTrigger>
          <TabsTrigger value="closed" className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Closed Chats
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Active Conversations</CardTitle>
                  <CardDescription>
                    {chats.filter(c => c.isActive).length} active support requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingChats ? (
                    <div className="flex justify-center py-4">
                      <Loader className="h-5 w-5 animate-spin text-gray-400" />
                    </div>
                  ) : chats.filter(c => c.isActive).length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p>No active support chats</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {chats
                        .filter(chat => chat.isActive)
                        .map(chat => (
                          <div
                            key={chat.id}
                            className={cn(
                              "p-3 rounded-lg cursor-pointer transition-colors",
                              activeChat === chat.userId
                                ? "bg-primary/10 border border-primary/20"
                                : "hover:bg-gray-100 border border-transparent"
                            )}
                            onClick={() => handleChatSelect(chat.userId)}
                          >
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={chat.avatar} />
                                <AvatarFallback>
                                  {chat.username.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="ml-3 flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                  <p className="font-medium truncate">{chat.username}</p>
                                  <span className="text-xs text-gray-500">
                                    {getTimeAgo(chat.lastMessageTime)}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                              </div>
                              {chat.unreadCount > 0 && (
                                <span className="h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center ml-2">
                                  {chat.unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Card className="h-full flex flex-col">
                {!activeChat ? (
                  <div className="flex items-center justify-center h-full flex-1 p-8">
                    <div className="text-center text-gray-500">
                      <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <h3 className="text-lg font-medium">No chat selected</h3>
                      <p className="max-w-sm mx-auto mt-2">
                        Select a conversation from the list to view and respond to support requests.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <CardHeader className="border-b pb-3">
                      {chats.find(c => c.userId === activeChat) && (
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={chats.find(c => c.userId === activeChat)?.avatar} />
                            <AvatarFallback>
                              {chats.find(c => c.userId === activeChat)?.username.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle>{chats.find(c => c.userId === activeChat)?.username}</CardTitle>
                            <CardDescription>User ID: {activeChat}</CardDescription>
                          </div>
                          <div className="ml-auto">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-500"
                              onClick={() => {
                                // Close this chat
                                if (socket && connected) {
                                  socket.emit('close_support_chat', { userId: activeChat });
                                }
                                setActiveChat(null);
                              }}
                            >
                              <UserX className="h-4 w-4 mr-1" />
                              Close Chat
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardHeader>
                    <div className="flex-1 overflow-auto p-4 max-h-[400px]">
                      {isLoadingMessages ? (
                        <div className="flex justify-center py-4">
                          <Loader className="h-5 w-5 animate-spin text-gray-400" />
                        </div>
                      ) : messages.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                          <p>No messages yet</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {messages.map((msg, index) => (
                            <div 
                              key={msg.id || index} 
                              className={cn(
                                "flex",
                                msg.isAdmin ? "justify-end" : "justify-start"
                              )}
                            >
                              {!msg.isAdmin && (
                                <Avatar className="h-8 w-8 mr-2">
                                  <AvatarImage src={msg.senderAvatar} />
                                  <AvatarFallback>
                                    {msg.senderName?.substring(0, 2).toUpperCase() || "US"}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              <div className={cn(
                                "max-w-[70%] rounded-lg p-3 break-words",
                                msg.isAdmin 
                                  ? "bg-primary text-white"
                                  : "bg-gray-100 text-gray-800"
                              )}>
                                <p>{msg.content}</p>
                                <p className="text-xs mt-1 opacity-70">
                                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                              {msg.isAdmin && (
                                <Avatar className="h-8 w-8 ml-2">
                                  <AvatarImage src={user?.avatar} />
                                  <AvatarFallback>
                                    {user?.username.substring(0, 2).toUpperCase() || "AD"}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                            </div>
                          ))}
                          {userIsTyping && (
                            <div className="flex items-center text-gray-500 text-sm">
                              <Loader className="h-3 w-3 mr-2 animate-spin" />
                              User is typing...
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="p-3 border-t mt-auto">
                      <div className="flex">
                        <Textarea
                          value={message}
                          onChange={handleMessageChange}
                          onKeyDown={handleKeyDown}
                          placeholder="Type your reply..."
                          className="resize-none min-h-[80px]"
                          disabled={!activeChat}
                        />
                        <Button 
                          onClick={sendMessage} 
                          className="ml-2 self-end"
                          disabled={!message.trim() || !activeChat}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="closed">
          <Card>
            <CardHeader>
              <CardTitle>Closed Conversations</CardTitle>
              <CardDescription>
                {chats.filter(c => !c.isActive).length} closed support requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingChats ? (
                <div className="flex justify-center py-4">
                  <Loader className="h-5 w-5 animate-spin text-gray-400" />
                </div>
              ) : chats.filter(c => !c.isActive).length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>No closed support chats</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {chats
                    .filter(chat => !chat.isActive)
                    .map(chat => (
                      <div
                        key={chat.id}
                        className="p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleChatSelect(chat.userId)}
                      >
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={chat.avatar} />
                            <AvatarFallback>
                              {chat.username.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-3 flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <p className="font-medium truncate">{chat.username}</p>
                              <span className="text-xs text-gray-500">
                                {getTimeAgo(chat.lastMessageTime)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupportDashboard;
