import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useSocket } from '@/contexts/SocketContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Message, Transaction, SupabaseTransaction, SupabaseMessage } from '@/types';
import EscrowActionButtons from './EscrowActionButtons';

interface TransactionChatProps {
  transactionId: string;
}

interface ChatUser {
  id: string;
  username: string;
  avatar?: string;
  role: string;
  rank?: string;
}

interface ChatMessage extends Message {
  sender?: ChatUser;
}

const mapSupabaseTransaction = (data: SupabaseTransaction): Transaction => {
  return {
    id: data.id,
    accountId: data.account_id,
    sellerId: data.seller_id,
    buyerId: data.buyer_id,
    escrowId: data.escrow_id,
    amount: data.amount,
    status: data.status as 'pending' | 'in_escrow' | 'completed' | 'cancelled' | 'disputed',
    cryptoType: data.crypto_type,
    cryptoAmount: data.crypto_amount,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at)
  };
};

const mapSupabaseMessage = (data: SupabaseMessage, sender?: ChatUser): ChatMessage => {
  return {
    id: data.id,
    senderId: data.sender_id,
    receiverId: data.receiver_id,
    transactionId: data.transaction_id,
    content: data.content,
    read: data.read,
    createdAt: new Date(data.created_at),
    sender
  };
};

const getRankColor = (rank: string | undefined) => {
  switch (rank) {
    case 'Bronze': return 'bg-amber-700 text-white';
    case 'Gold': return 'bg-yellow-500 text-white';
    case 'Platinum I': return 'bg-slate-300 text-black';
    case 'Platinum II': return 'bg-slate-400 text-black';
    case 'Platinum III': return 'bg-slate-500 text-white';
    case 'Exclusive': return 'bg-purple-600 text-white';
    default: return 'bg-amber-700 text-white';
  }
};

const TransactionChat: React.FC<TransactionChatProps> = ({ transactionId }) => {
  const { user } = useUser();
  const { socket, connected, joinRoom, leaveRoom } = useSocket();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [participants, setParticipants] = useState<Record<string, ChatUser>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      if (!transactionId) return;

      try {
        const { data: transactionData, error: transactionError } = await supabase
          .from('transactions')
          .select('*')
          .eq('id', transactionId)
          .single();

        if (transactionError) throw transactionError;
        if (transactionData) {
          setTransaction(mapSupabaseTransaction(transactionData as SupabaseTransaction));
        }

        const participantIds = [
          transactionData.buyer_id,
          transactionData.seller_id,
          transactionData.escrow_id
        ].filter(Boolean);

        const { data: participantsData, error: participantsError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', participantIds);

        if (participantsError) throw participantsError;
        
        const participantsMap: Record<string, ChatUser> = {};
        participantsData?.forEach(profile => {
          let rank;
          if (profile.id === transactionData.escrow_id) {
            const dealCount = profile.vouch_count || 0;
            
            if (dealCount >= 10000) rank = 'Exclusive';
            else if (dealCount >= 5000) rank = 'Platinum III';
            else if (dealCount >= 2500) rank = 'Platinum II';
            else if (dealCount >= 1000) rank = 'Platinum I';
            else if (dealCount >= 500) rank = 'Gold';
            else rank = 'Bronze';
          }
          
          participantsMap[profile.id] = {
            id: profile.id,
            username: profile.username,
            avatar: profile.avatar_url,
            role: profile.role,
            rank: rank
          };
        });
        
        setParticipants(participantsMap);
      } catch (error) {
        console.error('Error fetching transaction details:', error);
      }
    };

    fetchTransactionDetails();
  }, [transactionId]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!transactionId) return;

      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('transaction_id', transactionId)
          .order('created_at', { ascending: true });

        if (error) throw error;

        const enrichedMessages = data.map(message => 
          mapSupabaseMessage(message as SupabaseMessage, participants[message.sender_id])
        );

        setMessages(enrichedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    if (Object.keys(participants).length > 0) {
      fetchMessages();
    }
  }, [transactionId, participants]);

  useEffect(() => {
    if (connected && transactionId) {
      const roomId = `transaction_${transactionId}`;
      joinRoom(roomId);

      const markMessagesAsRead = async () => {
        if (!user) return;
        
        try {
          await supabase
            .from('messages')
            .update({ read: true })
            .match({ 
              transaction_id: transactionId,
              receiver_id: user.id,
              read: false
            });
        } catch (error) {
          console.error('Error marking messages as read:', error);
        }
      };

      markMessagesAsRead();

      return () => {
        leaveRoom(roomId);
      };
    }
  }, [connected, transactionId, joinRoom, leaveRoom, user]);

  useEffect(() => {
    if (socket) {
      const messageHandler = (newMessage: SupabaseMessage & { sender?: ChatUser }) => {
        if (newMessage.transaction_id === transactionId) {
          newMessage.sender = participants[newMessage.sender_id];
          
          setMessages(prevMessages => [...prevMessages, mapSupabaseMessage(newMessage, newMessage.sender)]);
          
          if (newMessage.receiver_id === user?.id) {
            supabase
              .from('messages')
              .update({ read: true })
              .eq('id', newMessage.id)
              .then(({ error }) => {
                if (error) console.error('Error marking message as read:', error);
              });
          }
        }
      };

      socket.on('new_message', messageHandler);

      return () => {
        socket.off('new_message', messageHandler);
      };
    }
  }, [socket, transactionId, participants, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !newMessage.trim() || !transaction) return;
    
    try {
      const recipientIds = [
        transaction.buyerId,
        transaction.sellerId,
        transaction.escrowId
      ].filter(id => id && id !== user.id);
      
      const receiverId = recipientIds[0];
      
      const { data: messageData, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          transaction_id: transactionId,
          content: newMessage.trim(),
          read: false
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (socket && connected && messageData) {
        const roomId = `transaction_${transactionId}`;
        socket.emit('send_message', { 
          ...messageData,
          room: roomId,
          sender: {
            id: user.id,
            username: user.username,
            avatar: user.avatar,
            role: user.role
          }
        });
      }
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const isEscrow = user?.id === transaction?.escrowId && user?.role === 'escrow';

  if (!transaction) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent>
          <p>Transaction not found or you don't have permission to view it.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold">Transaction Chat</h3>
            <Badge variant="outline">ID: {transactionId.substring(0, 8)}...</Badge>
          </div>
          <div className="flex space-x-2">
            {Object.values(participants).map(participant => (
              <div key={participant.id} className="flex items-center space-x-1">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={participant.avatar} />
                  <AvatarFallback>
                    {participant.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-xs">
                  <span>{participant.username}</span>
                  <span className="text-muted-foreground capitalize">{participant.role}</span>
                  {participant.rank && (
                    <div className="flex items-center">
                      <Badge className={`text-xs ${getRankColor(participant.rank)}`}>
                        {participant.role === 'escrow' && <Crown className="h-3 w-3 mr-1" />}
                        {participant.rank}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {isEscrow && transaction && (
          <EscrowActionButtons 
            transaction={transaction}
            isEscrow={isEscrow}
            buyerId={transaction.buyerId}
            sellerId={transaction.sellerId}
          />
        )}
      </CardHeader>
      
      <CardContent className="flex-1 overflow-auto p-4 space-y-4">
        {messages.length > 0 ? (
          messages.map(message => {
            const isUserMessage = message.senderId === user?.id;
            const sender = message.sender || participants[message.senderId];
            
            return (
              <div 
                key={message.id} 
                className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex max-w-[80%]">
                  {!isUserMessage && (
                    <Avatar className="h-8 w-8 mr-2 mt-1">
                      <AvatarImage src={sender?.avatar} />
                      <AvatarFallback>
                        {sender?.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    {!isUserMessage && (
                      <div className="flex items-center mb-1">
                        <span className="text-sm font-medium mr-1">{sender?.username}</span>
                        {sender?.role === 'escrow' && sender?.rank && (
                          <Badge className={`text-xs ${getRankColor(sender.rank)}`}>
                            <Crown className="h-3 w-3 mr-1" />
                            {sender.rank}
                          </Badge>
                        )}
                      </div>
                    )}
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
                      {message.createdAt.toLocaleTimeString([], { 
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

export default TransactionChat;
