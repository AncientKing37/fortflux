import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { UserCog, Search, RefreshCw } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/types';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const RoleManagement: React.FC = () => {
  const { user, assignRole } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  
  if (!user || user.role !== 'admin') {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }
  
  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return data.map(userProfile => ({
        id: userProfile.id,
        username: userProfile.username,
        email: `${userProfile.username.toLowerCase()}@example.com`,
        role: userProfile.role as UserRole,
        avatar: userProfile.avatar_url,
        createdAt: new Date(userProfile.created_at),
        vouchCount: userProfile.vouch_count || 0,
        balance: userProfile.balance || 0,
        description: userProfile.description
      })) as User[];
    },
    enabled: !!user && (user.role === 'admin')
  });

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    if (!user || user.role !== 'admin') {
      toast.error('Only administrators can assign roles');
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
      
      if (error) throw error;
      
      const success = await assignRole(userId, newRole);
      
      if (success) {
        toast.success(`User role updated to ${newRole}`);
        refetch();
      }
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast.error(error.message || 'Failed to update user role');
    }
  };

  const filteredUsers = users?.filter(u => {
    const matchesSearch = u.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || u.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Role Management</h2>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Assign User Roles</CardTitle>
          <CardDescription>Manage user roles and permissions across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by username..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
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
          
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers && filteredUsers.length > 0 ? (
                filteredUsers.map(userData => (
                  <div
                    key={userData.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center mb-4 md:mb-0">
                      <Avatar className="h-10 w-10 mr-4">
                        <AvatarImage src={userData.avatar} />
                        <AvatarFallback className="bg-primary/10">
                          {userData.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{userData.username}</p>
                        <p className="text-sm text-muted-foreground">
                          Joined: {userData.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-primary/10 px-3 py-1 rounded-full text-xs font-medium">
                        <UserCog className="h-3.5 w-3.5 mr-1" />
                        <span className="capitalize">{userData.role}</span>
                      </div>
                      
                      <Select
                        defaultValue={userData.role}
                        onValueChange={(value) => handleRoleChange(userData.id, value as UserRole)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Change role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="buyer">Buyer</SelectItem>
                          <SelectItem value="seller">Seller</SelectItem>
                          <SelectItem value="escrow">Escrow</SelectItem>
                          <SelectItem value="support">Support</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 border rounded-lg">
                  <p className="text-muted-foreground">No users found matching your filters</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
          <CardDescription>Overview of permissions for each user role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left pb-2 pr-4">Permission</th>
                  <th className="text-center pb-2 px-2">Buyer</th>
                  <th className="text-center pb-2 px-2">Seller</th>
                  <th className="text-center pb-2 px-2">Escrow</th>
                  <th className="text-center pb-2 px-2">Support</th>
                  <th className="text-center pb-2 px-2">Admin</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="py-2 pr-4">View Marketplace</td>
                  <td className="text-center py-2 px-2">✓</td>
                  <td className="text-center py-2 px-2">✓</td>
                  <td className="text-center py-2 px-2">✓</td>
                  <td className="text-center py-2 px-2">✓</td>
                  <td className="text-center py-2 px-2">✓</td>
                </tr>
                <tr className="border-t">
                  <td className="py-2 pr-4">Make Purchases</td>
                  <td className="text-center py-2 px-2">✓</td>
                  <td className="text-center py-2 px-2">✓</td>
                  <td className="text-center py-2 px-2">-</td>
                  <td className="text-center py-2 px-2">-</td>
                  <td className="text-center py-2 px-2">✓</td>
                </tr>
                <tr className="border-t">
                  <td className="py-2 pr-4">Create Listings</td>
                  <td className="text-center py-2 px-2">-</td>
                  <td className="text-center py-2 px-2">✓</td>
                  <td className="text-center py-2 px-2">-</td>
                  <td className="text-center py-2 px-2">-</td>
                  <td className="text-center py-2 px-2">✓</td>
                </tr>
                <tr className="border-t">
                  <td className="py-2 pr-4">Manage Escrows</td>
                  <td className="text-center py-2 px-2">-</td>
                  <td className="text-center py-2 px-2">-</td>
                  <td className="text-center py-2 px-2">✓</td>
                  <td className="text-center py-2 px-2">-</td>
                  <td className="text-center py-2 px-2">✓</td>
                </tr>
                <tr className="border-t">
                  <td className="py-2 pr-4">Release Funds</td>
                  <td className="text-center py-2 px-2">-</td>
                  <td className="text-center py-2 px-2">-</td>
                  <td className="text-center py-2 px-2">✓</td>
                  <td className="text-center py-2 px-2">-</td>
                  <td className="text-center py-2 px-2">✓</td>
                </tr>
                <tr className="border-t">
                  <td className="py-2 pr-4">Manage Disputes</td>
                  <td className="text-center py-2 px-2">-</td>
                  <td className="text-center py-2 px-2">-</td>
                  <td className="text-center py-2 px-2">-</td>
                  <td className="text-center py-2 px-2">✓</td>
                  <td className="text-center py-2 px-2">✓</td>
                </tr>
                <tr className="border-t">
                  <td className="py-2 pr-4">Moderate Content</td>
                  <td className="text-center py-2 px-2">-</td>
                  <td className="text-center py-2 px-2">-</td>
                  <td className="text-center py-2 px-2">-</td>
                  <td className="text-center py-2 px-2">✓</td>
                  <td className="text-center py-2 px-2">✓</td>
                </tr>
                <tr className="border-t">
                  <td className="py-2 pr-4">Live Support Chat</td>
                  <td className="text-center py-2 px-2">-</td>
                  <td className="text-center py-2 px-2">-</td>
                  <td className="text-center py-2 px-2">-</td>
                  <td className="text-center py-2 px-2">✓</td>
                  <td className="text-center py-2 px-2">✓</td>
                </tr>
                <tr className="border-t">
                  <td className="py-2 pr-4">Assign Roles</td>
                  <td className="text-center py-2 px-2">-</td>
                  <td className="text-center py-2 px-2">-</td>
                  <td className="text-center py-2 px-2">-</td>
                  <td className="text-center py-2 px-2">-</td>
                  <td className="text-center py-2 px-2">✓</td>
                </tr>
                <tr className="border-t">
                  <td className="py-2 pr-4">System Management</td>
                  <td className="text-center py-2 px-2">-</td>
                  <td className="text-center py-2 px-2">-</td>
                  <td className="text-center py-2 px-2">-</td>
                  <td className="text-center py-2 px-2">-</td>
                  <td className="text-center py-2 px-2">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleManagement;
