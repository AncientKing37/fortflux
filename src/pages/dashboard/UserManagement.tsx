
import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, MoreHorizontal, Ban, Shield, MessageSquare, User, RefreshCw } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const UserManagement: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Check user permissions
  if (!user || (user.role !== 'admin' && user.role !== 'support' && user.role !== 'escrow')) {
    navigate('/dashboard');
    return null;
  }

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['all-users', roleFilter],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*');
        
      if (roleFilter !== 'all') {
        query = query.eq('role', roleFilter);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    }
  });

  // Send message to user
  const handleSendMessage = (userId: string) => {
    if (!user) return;
    
    // Navigate to messages with this user selected
    navigate(`/dashboard/messages?userId=${userId}`);
  };

  // View user profile
  const handleViewProfile = (userId: string) => {
    navigate(`/profile/${userId}`);
  };
  
  // Ban user (admin only)
  const handleBanUser = async (userId: string) => {
    if (!user || user.role !== 'admin') {
      toast.error('Only administrators can ban users');
      return;
    }
    
    if (confirm('Are you sure you want to ban this user?')) {
      // In a real app, you'd implement proper banning logic here
      toast.success('User banned successfully');
    }
  };

  // Filter users based on search
  const filteredUsers = users?.filter(userData => 
    userData.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>User Search & Filters</CardTitle>
          <CardDescription>
            Find and manage users across the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by username..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="buyer">Buyers</SelectItem>
                <SelectItem value="seller">Sellers</SelectItem>
                <SelectItem value="escrow">Escrow Agents</SelectItem>
                <SelectItem value="support">Support Staff</SelectItem>
                <SelectItem value="admin">Administrators</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="sellers">Sellers</TabsTrigger>
          <TabsTrigger value="buyers">Buyers</TabsTrigger>
          {(user.role === 'admin') && (
            <TabsTrigger value="staff">Staff</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>User List</CardTitle>
              <CardDescription>
                {filteredUsers ? `${filteredUsers.length} users found` : 'Loading users...'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : filteredUsers && filteredUsers.length > 0 ? (
                <div className="space-y-4">
                  {filteredUsers.map(userData => (
                    <div
                      key={userData.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center mb-4 md:mb-0">
                        <Avatar className="h-10 w-10 mr-4">
                          <AvatarImage src={userData.avatar_url} />
                          <AvatarFallback className="bg-primary/10">
                            {userData.username.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center">
                            <p className="font-medium">{userData.username}</p>
                            <Badge variant="outline" className="ml-2 capitalize">
                              {userData.role}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Joined: {new Date(userData.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex gap-1"
                          onClick={() => handleViewProfile(userData.id)}
                        >
                          <User className="h-4 w-4" />
                          <span className="hidden sm:inline">Profile</span>
                        </Button>
                        
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex gap-1"
                          onClick={() => handleSendMessage(userData.id)}
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span className="hidden sm:inline">Message</span>
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {user.role === 'admin' && (
                              <>
                                <DropdownMenuItem onClick={() => navigate(`/admin/role-management?userId=${userData.id}`)}>
                                  <Shield className="h-4 w-4 mr-2" />
                                  Assign Role
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleBanUser(userData.id)}
                                >
                                  <Ban className="h-4 w-4 mr-2" />
                                  Ban User
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem onClick={() => navigate(`/dashboard/transactions?userId=${userData.id}`)}>
                              View Transactions
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/profile/${userData.id}?tab=vouches`)}>
                              Check Vouches
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No users match your search criteria</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sellers">
          <Card>
            <CardHeader>
              <CardTitle>Seller Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredUsers?.filter(u => u.role === 'seller').map(userData => (
                    <div
                      key={userData.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center mb-4 md:mb-0">
                        <Avatar className="h-10 w-10 mr-4">
                          <AvatarImage src={userData.avatar_url} />
                          <AvatarFallback className="bg-primary/10">
                            {userData.username.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{userData.username}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-muted-foreground">
                              Vouches: {userData.vouch_count || 0}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Balance: ${userData.balance?.toFixed(2) || '0.00'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          View Listings
                        </Button>
                        
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="buyers">
          <Card>
            <CardHeader>
              <CardTitle>Buyer Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredUsers?.filter(u => u.role === 'buyer').map(userData => (
                    <div
                      key={userData.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center mb-4 md:mb-0">
                        <Avatar className="h-10 w-10 mr-4">
                          <AvatarImage src={userData.avatar_url} />
                          <AvatarFallback className="bg-primary/10">
                            {userData.username.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{userData.username}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-muted-foreground">
                              Created: {new Date(userData.created_at).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Balance: ${userData.balance?.toFixed(2) || '0.00'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          View Purchases
                        </Button>
                        
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {user.role === 'admin' && (
          <TabsContent value="staff">
            <Card>
              <CardHeader>
                <CardTitle>Staff Accounts</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredUsers?.filter(u => ['admin', 'support', 'escrow'].includes(u.role)).map(userData => (
                      <div
                        key={userData.id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center mb-4 md:mb-0">
                          <Avatar className="h-10 w-10 mr-4">
                            <AvatarImage src={userData.avatar_url} />
                            <AvatarFallback className="bg-primary/10">
                              {userData.username.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center">
                              <p className="font-medium">{userData.username}</p>
                              <Badge className="ml-2 capitalize bg-blue-500">
                                {userData.role}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Joined: {new Date(userData.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            View Activity
                          </Button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Shield className="h-4 w-4 mr-2" />
                                Change Role
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Ban className="h-4 w-4 mr-2" />
                                Revoke Access
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default UserManagement;
