
import { supabase } from '@/integrations/supabase/client';

export interface SupportChat {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isActive: boolean;
}

export interface SupportMessage {
  id: string;
  userId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  isAdmin: boolean;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  content: string;
  read: boolean;
  createdAt: Date;
  metadata?: any;
}

export const supportChatService = {
  async getSupportChats(): Promise<SupportChat[]> {
    try {
      const { data, error } = await supabase
        .from('support_chats')
        .select('*')
        .order('last_message_time', { ascending: false });
      
      if (error) throw error;
      
      return (data || []).map(chat => ({
        id: chat.id,
        userId: chat.user_id,
        username: chat.username,
        avatar: chat.avatar_url,
        lastMessage: chat.last_message,
        lastMessageTime: new Date(chat.last_message_time),
        unreadCount: chat.unread_count,
        isActive: chat.is_active
      }));
    } catch (error) {
      console.error('Error fetching support chats:', error);
      return [];
    }
  },
  
  async getSupportMessages(userId: string): Promise<SupportMessage[]> {
    try {
      const { data, error } = await supabase
        .from('support_messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      return (data || []).map(message => ({
        id: message.id,
        userId: message.user_id,
        senderId: message.sender_id,
        senderName: message.sender_name,
        senderAvatar: message.sender_avatar,
        content: message.content,
        isAdmin: message.is_admin,
        createdAt: new Date(message.created_at)
      }));
    } catch (error) {
      console.error('Error fetching support messages:', error);
      return [];
    }
  },
  
  async markChatAsRead(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('support_chats')
        .update({ unread_count: 0 })
        .eq('user_id', userId);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error marking chat as read:', error);
      return false;
    }
  },
  
  async sendSupportMessage(message: {
    userId: string;
    senderId: string;
    senderName: string;
    senderAvatar?: string;
    content: string;
    isAdmin: boolean;
  }): Promise<SupportMessage | null> {
    try {
      // Insert message
      const { data: messageData, error: messageError } = await supabase
        .from('support_messages')
        .insert([{
          user_id: message.userId,
          sender_id: message.senderId,
          sender_name: message.senderName,
          sender_avatar: message.senderAvatar,
          content: message.content,
          is_admin: message.isAdmin
        }])
        .select()
        .single();
      
      if (messageError) throw messageError;
      
      // Update chat
      const { error: chatError } = await supabase
        .from('support_chats')
        .upsert([{
          user_id: message.userId,
          username: message.isAdmin ? message.senderName : message.senderName,
          avatar_url: message.senderAvatar,
          last_message: message.content,
          last_message_time: new Date().toISOString(),
          unread_count: message.isAdmin ? 0 : 1,
          is_active: true
        }], { onConflict: 'user_id' });
      
      if (chatError) throw chatError;
      
      if (messageData) {
        return {
          id: messageData.id,
          userId: messageData.user_id,
          senderId: messageData.sender_id,
          senderName: messageData.sender_name,
          senderAvatar: messageData.sender_avatar,
          content: messageData.content,
          isAdmin: messageData.is_admin,
          createdAt: new Date(messageData.created_at)
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error sending support message:', error);
      return null;
    }
  }
};

export const notificationService = {
  async getNotifications(userId: string, limit: number = 20): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      
      return (data || []).map(notification => ({
        id: notification.id,
        userId: notification.user_id,
        type: notification.type,
        title: notification.title,
        content: notification.content,
        read: notification.read,
        createdAt: new Date(notification.created_at),
        metadata: notification.metadata
      }));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },
  
  async markAsRead(notificationId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', userId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  },
  
  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  }
};
