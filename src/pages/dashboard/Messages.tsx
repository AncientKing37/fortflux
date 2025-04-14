
import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Chat from '@/components/chat/Chat';
import { useSocket } from '@/contexts/SocketContext';
import { supabase } from '@/integrations/supabase/client';

// Import components
import ConversationSidebar from '@/components/messages/ConversationSidebar';
import ChatPlaceholder from '@/components/messages/ChatPlaceholder';

interface ConversationUser {
  id: string;
  username: string;
  avatar_url?: string;
  role: string;
  vouch_count?: number;
  unreadCount: number;
  lastMessage?: {
    content: string;
    created_at: string;
    sender_id: string;
  };
}

const Messages: React.FC = () => {
  const { user } = useUser();
  const { socket, connected } = useSocket();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [conversations, setConversations] = useState<ConversationUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // Fetch messages to get unique conversation partners
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order('created_at', { ascending: false });
          
        if (messagesError) throw messagesError;
        
        if (!messagesData?.length) {
          setConversations([]);
          setLoading(false);
          return;
        }
        
        // Extract unique user IDs from conversations
        const userIds = new Set<string>();
        messagesData.forEach(message => {
          const otherId = message.sender_id === user.id 
            ? message.receiver_id 
            : message.sender_id;
          userIds.add(otherId);
        });
        
        // Fetch user profiles for all conversation partners
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', Array.from(userIds));
          
        if (profilesError) throw profilesError;
        
        // Create conversations with latest message and unread count
        const conversationsMap = new Map<string, ConversationUser>();
        
        profilesData?.forEach(profile => {
          conversationsMap.set(profile.id, {
            ...profile,
            unreadCount: 0,
            lastMessage: undefined
          });
        });
        
        // Populate with latest message and unread count
        messagesData.forEach(message => {
          const otherId = message.sender_id === user.id 
            ? message.receiver_id 
            : message.sender_id;
            
          const conversation = conversationsMap.get(otherId);
          
          if (conversation) {
            // Set last message if it doesn't exist yet
            if (!conversation.lastMessage) {
              conversation.lastMessage = {
                content: message.content,
                created_at: message.created_at,
                sender_id: message.sender_id
              };
            }
            
            // Count unread messages
            if (message.sender_id === otherId && !message.read) {
              conversation.unreadCount++;
            }
          }
        });
        
        setConversations(Array.from(conversationsMap.values()));
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversations();
  }, [user]);
  
  // Listen for new messages via socket
  useEffect(() => {
    if (socket && user) {
      const newMessageHandler = (message: any) => {
        // Update conversations if message is for current user
        if (message.receiver_id === user.id || message.sender_id === user.id) {
          setConversations(prev => {
            const otherId = message.sender_id === user.id 
              ? message.receiver_id 
              : message.sender_id;
              
            // Find if user is already in conversations
            const existingIndex = prev.findIndex(c => c.id === otherId);
            
            if (existingIndex >= 0) {
              // Update existing conversation
              const updated = [...prev];
              
              // Update last message
              updated[existingIndex] = {
                ...updated[existingIndex],
                lastMessage: {
                  content: message.content,
                  created_at: message.created_at,
                  sender_id: message.sender_id
                }
              };
              
              // Increment unread count if message is from other user and not current chat
              if (message.sender_id === otherId && selectedUserId !== otherId) {
                updated[existingIndex].unreadCount++;
              }
              
              // Move to top of list
              const [conversation] = updated.splice(existingIndex, 1);
              return [conversation, ...updated];
            }
            
            // Handle case where this is a new conversation
            // We would need to fetch the user profile in a real app
            return prev;
          });
        }
      };
      
      socket.on('new_message', newMessageHandler);
      
      return () => {
        socket.off('new_message', newMessageHandler);
      };
    }
  }, [socket, user, selectedUserId]);
  
  // Mark messages as read when selecting a conversation
  useEffect(() => {
    const markMessagesAsRead = async () => {
      if (!user || !selectedUserId) return;
      
      try {
        // Update UI immediately to show as read
        setConversations(prev => 
          prev.map(c => 
            c.id === selectedUserId 
              ? { ...c, unreadCount: 0 } 
              : c
          )
        );
        
        // Update in database
        await supabase
          .from('messages')
          .update({ read: true })
          .match({ 
            sender_id: selectedUserId,
            receiver_id: user.id,
            read: false
          });
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    };
    
    markMessagesAsRead();
  }, [selectedUserId, user]);

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-9rem)] overflow-hidden rounded-lg border">
        {/* Conversations Sidebar */}
        <ConversationSidebar
          conversations={conversations}
          selectedUserId={selectedUserId}
          setSelectedUserId={setSelectedUserId}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          loading={loading}
          currentUserId={user.id}
        />

        {/* Chat Area */}
        <div className="flex-1">
          {selectedUserId ? (
            <Chat receiverId={selectedUserId} />
          ) : (
            <ChatPlaceholder connected={connected} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Messages;
