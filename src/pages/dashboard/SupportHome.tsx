import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { HeadphonesIcon, AlertCircle, MessageSquare, Search, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supportChatService } from '@/services/supabaseService';
import { SupportChat } from '@/services/supabaseService';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';

const SupportHome: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  if (!user || user.role !== 'support') {
    navigate('/dashboard');
    return null;
  }

  const { data: activeChats, isLoading: isLoadingChats } = useQuery({
    queryKey: ['support-chats'],
    queryFn: async () => {
      return supportChatService.getSupportChats();
    }
  });

  const { data: activeCases, isLoading: isLoadingCases } = useQuery({
    queryKey: ['support-cases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          id,
          status,
          created_at,
          updated_at,
          amount,
          buyer:buyer_id(username),
          seller:seller_id(username),
          account:account_id(title)
        `)
        .eq('status', 'disputed')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      return data.map((item: any) => ({
        id: item.id,
        username: item.buyer?.username || 'Unknown',
        issue: `Dispute for ${item.account?.title || 'Account'}`,
        status: 'open',
        priority: item.amount > 100 ? 'high' : 'medium',
        createdAt: new Date(item.created_at)
      }));
    }
  });

  if (isLoadingChats || isLoadingCases) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Support Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-12 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const openCases = activeCases?.filter(c => c.status === 'open') || [];
  const pendingCases = activeCases?.filter(c => c.status === 'pending') || [];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Support Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openCases.length}</div>
            <p className="text-xs text-muted-foreground">Open support cases</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Chats</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeChats?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Active conversations</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Resolution</CardTitle>
            <HeadphonesIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCases.length}</div>
            <p className="text-xs text-muted-foreground">Cases awaiting resolution</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Support Cases</CardTitle>
              <Link to="/dashboard/disputes">
                <Button size="sm">View All</Button>
              </Link>
            </div>
            <CardDescription>Recent support cases requiring attention</CardDescription>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search cases..." className="pl-8" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeCases && activeCases.length > 0 ? (
                activeCases.slice(0, 4).map(caseItem => (
                  <div key={caseItem.id} className="flex items-start justify-between border-b last:border-b-0 pb-4 last:pb-0">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10">
                          {caseItem.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{caseItem.username}</p>
                          <Badge 
                            variant={caseItem.status === 'open' ? 'default' : 'outline'}
                            className={caseItem.priority === 'high' ? 'bg-red-500' : ''}
                          >
                            {caseItem.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{caseItem.issue}</p>
                        <p className="text-xs text-gray-500">
                          {caseItem.createdAt.toLocaleDateString()} at {caseItem.createdAt.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">Handle</Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No active cases</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Live Support Chats</CardTitle>
              <Link to="/dashboard/support">
                <Button size="sm">Open Chat</Button>
              </Link>
            </div>
            <CardDescription>Current conversations with users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeChats && activeChats.length > 0 ? (
                activeChats.slice(0, 4).map(chat => (
                  <div key={chat.id} className="flex items-center justify-between border-b last:border-b-0 pb-4 last:pb-0">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 relative">
                        <AvatarImage src={chat.avatar} />
                        <AvatarFallback className="bg-primary/10">
                          {chat.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                        {chat.unreadCount > 0 && (
                          <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            {chat.unreadCount}
                          </div>
                        )}
                      </Avatar>
                      <div>
                        <p className="font-medium">{chat.username}</p>
                        <p className="text-sm text-gray-600 truncate max-w-[200px]">{chat.lastMessage}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(chat.lastMessageTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No active chats</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-auto py-4 flex flex-col gap-2" asChild>
              <Link to="/dashboard/users">
                <Users className="h-5 w-5" />
                <span>User Management</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
              <Link to="/dashboard/disputes">
                <AlertCircle className="h-5 w-5" />
                <span>Handle Disputes</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
              <Link to="/dashboard/support">
                <MessageSquare className="h-5 w-5" />
                <span>Live Chat</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
              <Link to="/dashboard/notifications">
                <HeadphonesIcon className="h-5 w-5" />
                <span>Support Tools</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportHome;
