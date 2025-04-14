
import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useSocket } from '@/contexts/SocketContext';

interface ChatProps {
  receiverId: string;
  transactionId?: string;
}

interface ChatProfile {
  id: string;
  username: string;
  avatar_url?: string;
  role: string;
  vouch_count?: number;
}

const getRankBadge = (profile: ChatProfile) => {
  if (profile.role !== 'escrow' || profile.vouch_count === undefined) return null;
  
  let rank, color;
  const dealCount = profile.vouch_count;
  
  if (dealCount >= 10000) {
    rank = 'Exclusive';
    color = 'bg-purple-600 text-white';
  } else if (dealCount >= 5000) {
    rank = 'Platinum III';
    color = 'bg-slate-500 text-white';
  } else if (dealCount >= 2500) {
    rank = 'Platinum II';
    color = 'bg-slate-400 text-black';
  } else if (dealCount >= 1000) {
    rank = 'Platinum I';
    color = 'bg-slate-300 text-black';
  } else if (dealCount >= 500) {
    rank = 'Gold';
    color = 'bg-yellow-500 text-white';
  } else {
    rank = 'Bronze';
    color = 'bg-amber-700 text-white';
  }
  
  return (
    <Badge className={`ml-2 ${color}`}>
      <Crown className="h-3 w-3 mr-1" />
      {rank}
    </Badge>
  );
};

const Chat: React.FC<ChatProps> = ({ receiverId, transactionId }) => {
  const { user } = useUser();
  const { socket, connected } = useSocket();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [receiver, setReceiver] = useState<ChatProfile | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch receiver profile
  useEffect(() => {
    const fetchReceiverProfile = async () => {
      if (!receiverId) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', receiverId)
          .single();
          
        if (error) throw error;
        setReceiver(data);
      } catch (error) {
        console.error('Error fetching receiver profile:', error);
      }
    };
    
    fetchReceiverProfile();
  }, [receiverId]);

  // Fetch chat history
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user || !receiverId) return;
      
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user.id})`)
          .order('created_at', { ascending: true });
          
        if (error) throw error;
        setMessages(data || []);
        
        // Mark received messages as read
        const unreadMessages = data?.filter(m => 
          m.sender_id === receiverId && 
          m.receiver_id === user.id && 
          !m.read
        );
        
        if (unreadMessages?.length) {
          const unreadIds = unreadMessages.map(m => m.id);
          await supabase
            .from('messages')
            .update({ read: true })
            .in('id', unreadIds);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    
    fetchMessages();
  }, [user, receiverId]);

  // Socket.io message handling
  useEffect(() => {
    if (socket && user && receiverId) {
      const messageHandler = (newMessage: any) => {
        // Only process messages that are part of this conversation
        if (
          (newMessage.sender_id === user.id && newMessage.receiver_id === receiverId) ||
          (newMessage.sender_id === receiverId && newMessage.receiver_id === user.id)
        ) {
          setMessages(prev => [...prev, newMessage]);
          
          // Mark as read if we received the message
          if (newMessage.receiver_id === user.id) {
            supabase
              .from('messages')
              .update({ read: true })
              .eq('id', newMessage.id);
          }
        }
      };
      
      socket.on('new_message', messageHandler);
      
      return () => {
        socket.off('new_message', messageHandler);
      };
    }
  }, [socket, user, receiverId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !receiver || !newMessage.trim()) return;
    
    try {
      // Save message to database
      const { data: messageData, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: receiver.id,
          transaction_id: transactionId,
          content: newMessage.trim(),
          read: false
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Add to local messages
      setMessages(prev => [...prev, messageData]);
      
      // Emit via socket if connected
      if (socket && connected) {
        socket.emit('send_message', messageData);
      }
      
      // Clear input
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!user || !receiver) return null;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={receiver.avatar_url} />
            <AvatarFallback>
              {receiver.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center">
              <CardTitle className="text-sm">{receiver.username}</CardTitle>
              {getRankBadge(receiver)}
            </div>
            <p className="text-xs text-muted-foreground capitalize">{receiver.role}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-4 space-y-4">
        {messages.length > 0 ? (
          messages.map(message => {
            const isUserMessage = message.sender_id === user.id;
            
            return (
              <div 
                key={message.id} 
                className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex max-w-[80%]">
                  {!isUserMessage && (
                    <Avatar className="h-8 w-8 mr-2 mt-1">
                      <AvatarImage src={receiver.avatar_url} />
                      <AvatarFallback>
                        {receiver.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <div 
                      className={`rounded-lg px-4 py-2 inline-block ${
                        isUserMessage 
                          ? 'bg-marketplace-blue text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {message.content}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(message.created_at).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>
      <CardFooter className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <Input
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!newMessage.trim() || !connected}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default Chat;
