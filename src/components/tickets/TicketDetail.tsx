import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ticketService, Ticket, TicketMessage, TicketAttachment } from '@/services/ticketService';
import { formatDistanceToNow } from 'date-fns';
import { Send, Paperclip, Download, X } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '@/contexts/UserContext';

const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [attachments, setAttachments] = useState<TicketAttachment[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id) {
      fetchTicket();
      fetchMessages();
      fetchAttachments();
    }
  }, [id]);

  const fetchTicket = async () => {
    try {
      if (!id) return;
      const fetchedTicket = await ticketService.getTicketById(id);
      setTicket(fetchedTicket);
    } catch (error) {
      console.error('Error fetching ticket:', error);
      toast.error('Failed to load ticket');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      if (!id) return;
      const fetchedMessages = await ticketService.getMessages(id);
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const fetchAttachments = async () => {
    try {
      if (!id) return;
      const fetchedAttachments = await ticketService.getAttachments(id);
      setAttachments(fetchedAttachments);
    } catch (error) {
      console.error('Error fetching attachments:', error);
      toast.error('Failed to load attachments');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !id || !user) return;

    setSending(true);
    try {
      const message = await ticketService.addMessage(id, newMessage);
      if (message) {
        setMessages(prev => [...prev, message]);
        setNewMessage('');

        if (selectedFile) {
          const attachment = await ticketService.addAttachment(id, message.id, selectedFile);
          if (attachment) {
            setAttachments(prev => [...prev, attachment]);
            setSelectedFile(null);
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpdateStatus = async (status: Ticket['status']) => {
    if (!id || !ticket) return;

    try {
      const success = await ticketService.updateTicket(id, { status });
      if (success) {
        setTicket(prev => prev ? { ...prev, status } : null);
        toast.success('Ticket status updated');
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
      toast.error('Failed to update ticket status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Ticket not found</h2>
        <Button onClick={() => navigate('/tickets')}>Back to Tickets</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate('/tickets')}>
          Back to Tickets
        </Button>
        <Select value={ticket.status} onValueChange={handleUpdateStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{ticket.title}</CardTitle>
            <Badge className={getPriorityColor(ticket.priority)}>
              {ticket.priority}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Created by {ticket.user?.username}</span>
            <span>•</span>
            <span>{formatDistanceToNow(ticket.createdAt, { addSuffix: true })}</span>
            <span>•</span>
            <span>{ticket.category}</span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{ticket.description}</p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.userId === user?.id ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.userId !== user?.id && (
              <Avatar className="h-8 w-8">
                <AvatarImage src={message.user?.avatar} />
                <AvatarFallback>
                  {message.user?.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.userId === user?.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {formatDistanceToNow(message.createdAt, { addSuffix: true })}
              </p>
              {attachments
                .filter(att => att.messageId === message.id)
                .map(attachment => (
                  <div
                    key={attachment.id}
                    className="mt-2 flex items-center gap-2 bg-white/10 p-2 rounded"
                  >
                    <Paperclip className="h-4 w-4" />
                    <span className="text-sm truncate">{attachment.fileName}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 ml-auto"
                      onClick={() => {
                        // Handle file download
                        const url = supabase.storage
                          .from('ticket-attachments')
                          .getPublicUrl(attachment.filePath).data.publicUrl;
                        window.open(url, '_blank');
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
            </div>
            {message.userId === user?.id && (
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>
                  {user.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 bg-white p-4 border-t">
        <div className="flex gap-2">
          <div className="flex-1">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="min-h-[80px]"
            />
            {selectedFile && (
              <div className="mt-2 flex items-center gap-2 bg-gray-100 p-2 rounded">
                <Paperclip className="h-4 w-4" />
                <span className="text-sm truncate flex-1">{selectedFile.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={handleRemoveFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sending}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const getPriorityColor = (priority: Ticket['priority']) => {
  switch (priority) {
    case 'low':
      return 'bg-green-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'high':
      return 'bg-orange-500';
    case 'urgent':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

export default TicketDetail; 