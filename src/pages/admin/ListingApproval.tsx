
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

// Import components
import SearchAndFilter from '@/components/admin/listings/SearchAndFilter';
import ListingTable from '@/components/admin/listings/ListingTable';
import ListingDetailsDialog from '@/components/admin/listings/ListingDetailsDialog';
import RejectionDialog from '@/components/admin/listings/RejectionDialog';

// Import utilities and types
import { Listing } from '@/components/admin/listings/types';

const ListingApproval: React.FC = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRarity, setFilterRarity] = useState('all');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  // Check user permissions
  if (!user || !['admin', 'support'].includes(user.role)) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p>You do not have permission to access the listing approval system.</p>
      </div>
    );
  }

  // Fetch pending listings from Supabase
  const { data, isLoading } = useQuery({
    queryKey: ['pending-listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fortnite_accounts')
        .select(`
          id,
          title,
          price,
          rarity,
          description,
          status,
          skins,
          level,
          v_bucks,
          battle_pass,
          images,
          created_at,
          seller_id
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Get seller information for each listing
      const listingsWithSellers = await Promise.all(
        (data || []).map(async (item) => {
          const { data: seller } = await supabase
            .from('profiles')
            .select('id, username, avatar_url, created_at, vouch_count')
            .eq('id', item.seller_id)
            .single();
            
          return {
            id: item.id,
            title: item.title,
            price: item.price,
            rarity: item.rarity || 'common',
            description: item.description || '',
            status: item.status as 'pending' | 'approved' | 'rejected',
            skins: item.skins || 0,
            level: item.level || 1,
            vBucks: item.v_bucks || 0,
            battlePass: item.battle_pass || false,
            images: item.images || [],
            seller: {
              id: seller?.id || item.seller_id,
              username: seller?.username || 'Unknown Seller',
              avatar: seller?.avatar_url || 'https://i.pravatar.cc/100?u=1',
              totalSold: seller?.vouch_count || 0,
              joinedDate: seller?.created_at
            },
            createdAt: new Date(item.created_at)
          };
        })
      );
      
      return listingsWithSellers;
    }
  });

  const listings = data || [];

  // Filter and search listings
  const filteredListings = listings.filter(listing => {
    const matchesSearch = 
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.seller.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRarity = filterRarity === 'all' || listing.rarity.toLowerCase() === filterRarity.toLowerCase();
    
    return matchesSearch && matchesRarity;
  });

  // Handle listing selection for details view
  const handleViewListing = (listing: Listing) => {
    setSelectedListing(listing);
    setDetailsOpen(true);
  };

  // Approve listing mutation
  const approveMutation = useMutation({
    mutationFn: async (listingId: string) => {
      const { error } = await supabase
        .from('fortnite_accounts')
        .update({ status: 'approved' })
        .eq('id', listingId);
        
      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-listings'] });
      toast.success('Listing approved successfully!');
    },
    onError: () => {
      toast.error('Failed to approve listing');
    }
  });

  // Handle listing approval
  const handleApproveListing = (listingId: string) => {
    approveMutation.mutate(listingId);
    setDetailsOpen(false);
  };

  // Open rejection dialog
  const handleOpenRejectDialog = (listing?: Listing) => {
    if (listing) {
      setSelectedListing(listing);
    }
    setRejectDialogOpen(true);
  };

  // Reject listing mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ listingId, reason }: { listingId: string, reason: string }) => {
      const { error } = await supabase
        .from('fortnite_accounts')
        .update({ 
          status: 'rejected',
          // In a real app, you might store the rejection reason in a metadata field
        })
        .eq('id', listingId);
        
      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-listings'] });
      toast.error('Listing rejected.');
    },
    onError: () => {
      toast.error('Failed to reject listing');
    }
  });

  // Handle listing rejection
  const handleRejectListing = () => {
    if (!selectedListing) return;
    
    rejectMutation.mutate({ 
      listingId: selectedListing.id,
      reason: rejectionReason
    });
    
    setDetailsOpen(false);
    setRejectDialogOpen(false);
    setRejectionReason('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Listing Approval</h1>
        <p className="text-muted-foreground">Review and manage pending listings.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Listings</CardTitle>
          <CardDescription>
            Listings awaiting approval before being published to the marketplace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SearchAndFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterRarity={filterRarity}
            setFilterRarity={setFilterRarity}
          />

          {isLoading ? (
            <div className="space-y-4 mt-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border rounded-md mt-4">
              <p>No pending listings found</p>
            </div>
          ) : (
            <ListingTable
              listings={filteredListings}
              handleViewListing={handleViewListing}
              handleApproveListing={handleApproveListing}
              handleOpenRejectDialog={handleOpenRejectDialog}
            />
          )}
        </CardContent>
      </Card>

      {/* Listing Details Dialog */}
      <ListingDetailsDialog
        open={detailsOpen}
        setOpen={setDetailsOpen}
        listing={selectedListing}
        handleApproveListing={handleApproveListing}
        handleOpenRejectDialog={() => handleOpenRejectDialog()}
      />

      {/* Rejection Reason Dialog */}
      <RejectionDialog
        open={rejectDialogOpen}
        setOpen={setRejectDialogOpen}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
        handleRejectListing={handleRejectListing}
      />
    </div>
  );
};

export default ListingApproval;
