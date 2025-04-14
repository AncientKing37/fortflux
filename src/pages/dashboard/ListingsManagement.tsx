
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

// Import components
import ListingCard from '@/components/listings/ListingCard';
import NoListings from '@/components/listings/NoListings';
import StatusFilter from '@/components/listings/StatusFilter';
import { Skeleton } from '@/components/ui/skeleton';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  status: string;
  created_at: string;
}

const ListingsManagement: React.FC = () => {
  const { user } = useUser();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const { data: listings, isLoading, refetch } = useQuery({
    queryKey: ['seller-listings', user?.id, statusFilter],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from('fortnite_accounts')
        .select('*')
        .eq('seller_id', user.id);
      
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data as Listing[] || [];
    },
    enabled: !!user && user.role === 'seller'
  });

  const handleDeleteListing = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('fortnite_accounts')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      toast.success('Listing deleted successfully');
      refetch();
    } catch (error: any) {
      console.error('Error deleting listing:', error);
      toast.error(error.message || 'Failed to delete listing');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Manage Your Listings</h1>
        <Link to="/dashboard/create-listing">
          <Button className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Listing
          </Button>
        </Link>
      </div>

      <StatusFilter statusFilter={statusFilter} setStatusFilter={setStatusFilter} />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-80 w-full rounded-xl" />
          ))}
        </div>
      ) : listings && listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {listings.map((listing) => (
            <ListingCard 
              key={listing.id} 
              listing={listing} 
              onDelete={handleDeleteListing} 
            />
          ))}
        </div>
      ) : (
        <NoListings />
      )}
    </div>
  );
};

export default ListingsManagement;
