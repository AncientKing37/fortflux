import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Ticket {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  assignedTo: string | null;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt: Date | null;
  closedAt: Date | null;
  user?: {
    username: string;
    avatar: string;
  };
  assignedUser?: {
    username: string;
    avatar: string;
  };
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  userId: string;
  content: string;
  isInternal: boolean;
  createdAt: Date;
  user?: {
    username: string;
    avatar: string;
  };
}

export interface TicketAttachment {
  id: string;
  ticketId: string;
  messageId: string;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  createdAt: Date;
}

export const ticketService = {
  async createTicket(ticket: {
    title: string;
    description: string;
    category: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
  }): Promise<Ticket | null> {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .insert({
          title: ticket.title,
          description: ticket.description,
          category: ticket.category,
          priority: ticket.priority || 'medium',
        })
        .select()
        .single();

      if (error) throw error;

      return {
        ...data,
        userId: data.user_id,
        assignedTo: data.assigned_to,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        resolvedAt: data.resolved_at ? new Date(data.resolved_at) : null,
        closedAt: data.closed_at ? new Date(data.closed_at) : null,
      };
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error('Failed to create ticket');
      return null;
    }
  },

  async getTickets(filters?: {
    status?: Ticket['status'];
    priority?: Ticket['priority'];
    category?: string;
  }): Promise<Ticket[]> {
    try {
      let query = supabase
        .from('tickets')
        .select(`
          *,
          user:user_id(username, avatar_url),
          assigned_user:assigned_to(username, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.priority) {
        query = query.eq('priority', filters.priority);
      }
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map(ticket => ({
        ...ticket,
        userId: ticket.user_id,
        assignedTo: ticket.assigned_to,
        createdAt: new Date(ticket.created_at),
        updatedAt: new Date(ticket.updated_at),
        resolvedAt: ticket.resolved_at ? new Date(ticket.resolved_at) : null,
        closedAt: ticket.closed_at ? new Date(ticket.closed_at) : null,
        user: ticket.user,
        assignedUser: ticket.assigned_user,
      }));
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to load tickets');
      return [];
    }
  },

  async getTicketById(id: string): Promise<Ticket | null> {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          user:user_id(username, avatar_url),
          assigned_user:assigned_to(username, avatar_url)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        ...data,
        userId: data.user_id,
        assignedTo: data.assigned_to,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        resolvedAt: data.resolved_at ? new Date(data.resolved_at) : null,
        closedAt: data.closed_at ? new Date(data.closed_at) : null,
        user: data.user,
        assignedUser: data.assigned_user,
      };
    } catch (error) {
      console.error('Error fetching ticket:', error);
      toast.error('Failed to load ticket');
      return null;
    }
  },

  async updateTicket(
    id: string,
    updates: {
      status?: Ticket['status'];
      priority?: Ticket['priority'];
      assignedTo?: string | null;
    }
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('tickets')
        .update({
          status: updates.status,
          priority: updates.priority,
          assigned_to: updates.assignedTo,
          updated_at: new Date().toISOString(),
          ...(updates.status === 'resolved' && !updates.resolvedAt
            ? { resolved_at: new Date().toISOString() }
            : {}),
          ...(updates.status === 'closed' && !updates.closedAt
            ? { closed_at: new Date().toISOString() }
            : {}),
        })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast.error('Failed to update ticket');
      return false;
    }
  },

  async addMessage(
    ticketId: string,
    content: string,
    isInternal: boolean = false
  ): Promise<TicketMessage | null> {
    try {
      const { data, error } = await supabase
        .from('ticket_messages')
        .insert({
          ticket_id: ticketId,
          content,
          is_internal: isInternal,
        })
        .select(`
          *,
          user:user_id(username, avatar_url)
        `)
        .single();

      if (error) throw error;

      return {
        ...data,
        ticketId: data.ticket_id,
        userId: data.user_id,
        isInternal: data.is_internal,
        createdAt: new Date(data.created_at),
        user: data.user,
      };
    } catch (error) {
      console.error('Error adding message:', error);
      toast.error('Failed to add message');
      return null;
    }
  },

  async getMessages(ticketId: string): Promise<TicketMessage[]> {
    try {
      const { data, error } = await supabase
        .from('ticket_messages')
        .select(`
          *,
          user:user_id(username, avatar_url)
        `)
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return (data || []).map(message => ({
        ...message,
        ticketId: message.ticket_id,
        userId: message.user_id,
        isInternal: message.is_internal,
        createdAt: new Date(message.created_at),
        user: message.user,
      }));
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
      return [];
    }
  },

  async addAttachment(
    ticketId: string,
    messageId: string,
    file: File
  ): Promise<TicketAttachment | null> {
    try {
      // Upload file to storage
      const filePath = `tickets/${ticketId}/${messageId}/${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('ticket-attachments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create attachment record
      const { data, error } = await supabase
        .from('ticket_attachments')
        .insert({
          ticket_id: ticketId,
          message_id: messageId,
          file_name: file.name,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size,
        })
        .select()
        .single();

      if (error) throw error;

      return {
        ...data,
        ticketId: data.ticket_id,
        messageId: data.message_id,
        fileName: data.file_name,
        filePath: data.file_path,
        fileType: data.file_type,
        fileSize: data.file_size,
        createdAt: new Date(data.created_at),
      };
    } catch (error) {
      console.error('Error adding attachment:', error);
      toast.error('Failed to add attachment');
      return null;
    }
  },

  async getAttachments(ticketId: string): Promise<TicketAttachment[]> {
    try {
      const { data, error } = await supabase
        .from('ticket_attachments')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return (data || []).map(attachment => ({
        ...attachment,
        ticketId: attachment.ticket_id,
        messageId: attachment.message_id,
        fileName: attachment.file_name,
        filePath: attachment.file_path,
        fileType: attachment.file_type,
        fileSize: attachment.file_size,
        createdAt: new Date(attachment.created_at),
      }));
    } catch (error) {
      console.error('Error fetching attachments:', error);
      toast.error('Failed to load attachments');
      return [];
    }
  },
}; 