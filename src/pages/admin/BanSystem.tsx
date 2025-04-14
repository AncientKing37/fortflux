
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  AlertCircle, 
  Clock, 
  Search, 
  ShieldAlert, 
  UserX 
} from 'lucide-react';

interface UserProfile {
  id: string;
  username: string;
  role: string;
  avatar_url: string | null;
  created_at: string;
}

interface BanRecord {
  id: string;
  from_user_id: string; // The admin who banned the user
  to_user_id: string;   // The banned user
  reason: string;
  created_at: string;   // When the ban was applied
  expires_at: string | null;
  user: UserProfile | null;
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

const BanSystem: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [banReason, setBanReason] = useState('');
  const [banDuration, setBanDuration] = useState<number | null>(null); // Duration in days
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUnbanDialogOpen, setIsUnbanDialogOpen] = useState(false);
  const [selectedBanRecord, setSelectedBanRecord] = useState<BanRecord | null>(null);
  const queryClient = useQueryClient();
  const { user } = useUser();

  // Check user permissions
  if (!user || user.role !== 'admin') {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p>You do not have permission to access the ban system.</p>
      </div>
    );
  }

  // Fetch all users
  const { data: users, isLoading: isUsersLoading } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, role, created_at')
        .neq('role', 'admin'); // Exclude admins from the list
      
      if (error) throw error;
      return data as UserProfile[];
    }
  });

  // Fetch banned users
  const { data: bannedUsers, isLoading: isBannedUsersLoading } = useQuery({
    queryKey: ['banned-users'],
    queryFn: async () => {
      // First, get the vouches with rating=0 (bans)
      const { data: vouchesData, error: vouchesError } = await supabase
        .from('vouches')
        .select(`
          id,
          from_user_id,
          to_user_id,
          comment,
          created_at,
          rating
        `)
        .eq('rating', 0) // Using rating 0 to represent a ban
        .gte('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()); // Only show bans from last 90 days
      
      if (vouchesError) {
        console.error('Error fetching vouches:', vouchesError);
        return [];
      }
      
      if (!vouchesData || vouchesData.length === 0) {
        return [];
      }
      
      // Get all banned user IDs
      const bannedUserIds = vouchesData.map(vouch => vouch.to_user_id);
      
      // Fetch the profile data for these users separately
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, role, avatar_url, created_at')
        .in('id', bannedUserIds);
        
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }
      
      // Create a map of user IDs to profile data for easier lookup
      const profilesMap: Record<string, UserProfile> = {};
      if (profilesData) {
        profilesData.forEach(profile => {
          profilesMap[profile.id] = profile;
        });
      }
      
      // Transform data to match BanRecord interface
      return vouchesData.map(item => ({
        id: item.id,
        from_user_id: item.from_user_id,
        to_user_id: item.to_user_id,
        reason: item.comment || 'No reason provided',
        created_at: item.created_at,
        expires_at: null, // We don't have expiry yet, can add this field to vouches if needed
        user: profilesMap[item.to_user_id] || null
      })) as BanRecord[];
    }
  });

  // Filter users based on search term
  const filteredUsers = users?.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Handle ban user mutation
  const banUserMutation = useMutation({
    mutationFn: async ({ userId, reason, duration }: { userId: string, reason: string, duration: number | null }) => {
      // We're using the vouches table with rating=0 to represent a ban
      const { error } = await supabase
        .from('vouches')
        .insert([
          { 
            from_user_id: user.id, // Admin who created the ban
            to_user_id: userId,    // User being banned
            rating: 0,             // 0 rating indicates a ban
            comment: reason,       // Store reason in comment field
            transaction_id: '00000000-0000-0000-0000-000000000000' // Dummy transaction ID for now
          }
        ]);
      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banned-users'] });
      toast.success('User banned successfully!');
      closeDialog();
    },
    onError: (error) => {
      console.error('Ban error:', error);
      toast.error('Failed to ban user');
    }
  });

  // Handle unban user mutation
  const unbanUserMutation = useMutation({
    mutationFn: async (banId: string) => {
      const { error } = await supabase
        .from('vouches')
        .delete()
        .eq('id', banId);
      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banned-users'] });
      toast.success('User unbanned successfully!');
      closeUnbanDialog();
    },
    onError: (error) => {
      console.error('Unban error:', error);
      toast.error('Failed to unban user');
    }
  });

  // Handlers
  const openDialog = (userId: string) => {
    setSelectedUserId(userId);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setSelectedUserId(null);
    setBanReason('');
    setBanDuration(null);
    setIsDialogOpen(false);
  };

  const handleBanUser = () => {
    if (!selectedUserId || !banReason) {
      toast.error('Please provide a reason for the ban.');
      return;
    }
    banUserMutation.mutate({ 
      userId: selectedUserId, 
      reason: banReason,
      duration: banDuration
    });
  };

  const openUnbanDialog = (banRecord: BanRecord) => {
    setSelectedBanRecord(banRecord);
    setIsUnbanDialogOpen(true);
  };

  const closeUnbanDialog = () => {
    setSelectedBanRecord(null);
    setIsUnbanDialogOpen(false);
  };

  const handleUnbanUser = () => {
    if (!selectedBanRecord) return;
    unbanUserMutation.mutate(selectedBanRecord.id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">User Ban System</h1>
        <p className="text-muted-foreground">Manage and monitor banned users.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Search, view, and manage user bans.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="users" className="space-y-4">
            <TabsList>
              <TabsTrigger value="users">All Users</TabsTrigger>
              <TabsTrigger value="banned">Banned Users</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-4">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>

              {isUsersLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[220px]" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map(user => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{formatDate(user.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" onClick={() => openDialog(user.id)}>
                            <ShieldAlert className="h-4 w-4 mr-2" />
                            Ban User
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            <TabsContent value="banned" className="space-y-4">
              {isBannedUsersLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[220px]" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Banned At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bannedUsers && bannedUsers.length > 0 ? (
                      bannedUsers.map(ban => (
                        <TableRow key={ban.id}>
                          <TableCell className="font-medium">{ban.user?.username || 'Unknown'}</TableCell>
                          <TableCell>{ban.reason}</TableCell>
                          <TableCell>{formatDate(ban.created_at)}</TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="destructive" onClick={() => openUnbanDialog(ban)}>
                              <UserX className="h-4 w-4 mr-2" />
                              Unban User
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                          No banned users found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Ban User Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ban User</DialogTitle>
            <DialogDescription>
              Are you sure you want to ban this user?
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="reason" className="text-right">
                Reason
              </label>
              <Input
                id="reason"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="duration" className="text-right">
                Ban Duration (Days)
              </label>
              <Input
                id="duration"
                type="number"
                placeholder="Leave empty for permanent ban"
                value={banDuration || ''}
                onChange={(e) => setBanDuration(e.target.value ? parseInt(e.target.value) : null)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={closeDialog}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleBanUser}>
              Ban User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unban User Dialog */}
      <Dialog open={isUnbanDialogOpen} onOpenChange={setIsUnbanDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Unban User</DialogTitle>
            <DialogDescription>
              Are you sure you want to unban this user?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={closeUnbanDialog}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleUnbanUser}>
              Unban User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BanSystem;
