
import React, { useState, useEffect, useRef } from 'react';
import { X, Send, MessageSquare, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSocket } from '@/contexts/SocketContext';
import { useUser } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { SupportMessage, supportChatService } from '@/services/supabaseService';

const FloatingSupportChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [supportAvailable, setSupportAvailable] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { user } = useUser();
  const { 
    socket, 
    connected, 
    joinRoom, 
    leaveRoom, 
    sendSupportMessage, 
    sendSupportTypingIndicator,
    checkSupportAvailability
  } = useSocket();
  
  const supportRoomId = user ? `support_${user.id}` : '';
  
  useEffect(() => {
    if (isOpen && connected && user) {
      joinRoom(supportRoomId);
      
      // Fetch previous messages
      fetchChatHistory();
      
      // Check support availability
      checkSupportAvailability();
    }
    
    return () => {
      if (connected && user) {
        leaveRoom(supportRoomId);
      }
    };
  }, [isOpen, connected, user, supportRoomId]);
  
  useEffect(() => {
    if (socket && user) {
      // Listen for new messages
      socket.on('support_message', (newMessage: any) => {
        const supportMessage: SupportMessage = {
          id: newMessage.id || Date.now().toString(),
          userId: user.id,
          senderId: newMessage.sender_id,
          senderName: newMessage.sender_name,
          senderAvatar: newMessage.sender_avatar,
          content: newMessage.content,
          isAdmin: newMessage.is_admin,
          createdAt: new Date(newMessage.timestamp)
        };
        setMessages(prev => [...prev, supportMessage]);
      });
      
      // Listen for typing indicators
      socket.on('support_typing', (data: { isTyping: boolean, userId: string }) => {
        if (data.userId !== user.id) {
          setIsTyping(data.isTyping);
        }
      });
      
      // Listen for support availability updates
      socket.on('support_availability', (data: { available: boolean }) => {
        setSupportAvailable(data.available);
      });
      
      return () => {
        socket.off('support_message');
        socket.off('support_typing');
        socket.off('support_availability');
      };
    }
  }, [socket, user]);
  
  useEffect(() => {
    // Scroll to bottom when new messages arrive
    scrollToBottom();
  }, [messages]);
  
  const fetchChatHistory = async () => {
    if (!user) return;
    
    try {
      const supportMessages = await supportChatService.getSupportMessages(user.id);
      setMessages(supportMessages);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      toast.error('Failed to load chat history');
    }
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Emit typing indicator
    if (connected && user) {
      sendSupportTypingIndicator(true, supportRoomId);
      
      // Clear previous timeout and set new one
      const timeout = setTimeout(() => {
        if (connected) {
          sendSupportTypingIndicator(false, supportRoomId);
        }
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  };
  
  const handleSendMessage = async () => {
    if (!message.trim() || !user || !connected) return;
    
    // Send message to server
    const success = await sendSupportMessage(message, supportRoomId);
    
    if (success) {
      // Add message to local state immediately for better UX
      const newMessage: SupportMessage = {
        id: Date.now().toString(),
        userId: user.id,
        senderId: user.id,
        senderName: user.username,
        senderAvatar: user.avatar,
        content: message,
        isAdmin: false,
        createdAt: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      // Clear input
      setMessage('');
      
      // Clear typing indicator
      sendSupportTypingIndicator(false, supportRoomId);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  if (!user) return null;
  
  return (
    <div className="fixed bottom-16 right-4 md:bottom-8 md:right-8 z-40">
      {!isOpen ? (
        <Button 
          onClick={toggleChat} 
          className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center p-0 bg-primary hover:bg-primary/90"
          aria-label="Open support chat"
        >
          <MessageSquare className="h-6 w-6 text-white" />
        </Button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl flex flex-col w-80 md:w-96 h-[450px] border">
          <div className="p-3 border-b flex items-center justify-between bg-primary text-white rounded-t-lg">
            <div className="flex items-center">
              <div className={cn(
                "w-2 h-2 rounded-full mr-2",
                supportAvailable ? "bg-green-400" : "bg-gray-400"
              )} />
              <h3 className="font-medium">Support Chat</h3>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleChat}
              className="text-white hover:bg-primary/80"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                <MessageSquare className="h-12 w-12 mb-2 text-gray-300" />
                <p>No messages yet. Start the conversation!</p>
                <p className="text-xs mt-2">
                  {supportAvailable 
                    ? "Support agents are online and ready to help." 
                    : "Support agents are currently offline. Your message will be answered when someone becomes available."}
                </p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div 
                  key={msg.id || index} 
                  className={cn(
                    "mb-4 flex",
                    msg.senderId === user.id ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.senderId !== user.id && (
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={msg.senderAvatar} />
                      <AvatarFallback>
                        {msg.senderName?.substring(0, 2).toUpperCase() || "SU"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={cn(
                    "max-w-[70%] rounded-lg p-3 break-words",
                    msg.senderId === user.id 
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-800"
                  )}>
                    <p>{msg.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {msg.senderId === user.id && (
                    <Avatar className="h-8 w-8 ml-2">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>
                        {user.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))
            )}
            {isTyping && (
              <div className="flex items-center text-gray-500 text-sm">
                <Loader className="h-3 w-3 mr-2 animate-spin" />
                Support is typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-3 border-t">
            <div className="flex">
              <Textarea
                value={message}
                onChange={handleMessageChange}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="resize-none min-h-[80px]"
              />
              <Button 
                onClick={handleSendMessage} 
                className="ml-2 self-end"
                disabled={!message.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingSupportChat;
