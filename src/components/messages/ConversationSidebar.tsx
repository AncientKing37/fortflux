
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import EscrowRankBadge from '@/components/escrow/EscrowRankBadge';

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

interface ConversationSidebarProps {
  conversations: ConversationUser[];
  selectedUserId: string | null;
  setSelectedUserId: (id: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  loading: boolean;
  currentUserId: string;
}

const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  conversations,
  selectedUserId,
  setSelectedUserId,
  searchTerm,
  setSearchTerm,
  loading,
  currentUserId
}) => {
  // Filter conversations based on search term
  const filteredConversations = conversations.filter(
    c => c.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-1/3 border-r flex flex-col">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-20">
            <p className="text-sm text-muted-foreground">Loading conversations...</p>
          </div>
        ) : filteredConversations.length > 0 ? (
          filteredConversations.map(conversation => (
            <Button
              key={conversation.id}
              variant="ghost"
              className={`w-full justify-start p-3 h-auto ${
                selectedUserId === conversation.id ? 'bg-gray-100' : ''
              }`}
              onClick={() => setSelectedUserId(conversation.id)}
            >
              <div className="flex items-start w-full">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={conversation.avatar_url} />
                  <AvatarFallback>
                    {conversation.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <p className="font-medium text-sm">{conversation.username}</p>
                      {conversation.role === 'escrow' && conversation.vouch_count !== undefined && (
                        <div className="ml-1">
                          <EscrowRankBadge 
                            dealCount={conversation.vouch_count}
                            size="sm"
                            showTooltip={false}
                          />
                        </div>
                      )}
                    </div>
                    {conversation.lastMessage && (
                      <p className="text-xs text-gray-500">
                        {new Date(conversation.lastMessage.created_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  {conversation.lastMessage && (
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {conversation.lastMessage.sender_id === currentUserId ? 'You: ' : ''}
                      {conversation.lastMessage.content}
                    </p>
                  )}
                </div>
                {conversation.unreadCount > 0 && (
                  <Badge variant="default" className="bg-marketplace-blue rounded-full h-6 w-6 flex items-center justify-center ml-1">
                    {conversation.unreadCount}
                  </Badge>
                )}
              </div>
            </Button>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            {searchTerm ? 'No conversations found' : 'No conversations yet'}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationSidebar;
