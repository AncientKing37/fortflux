
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ListingGrid from '@/components/marketplace/ListingGrid';

interface Listing {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  status: string;
  created_at: string;
  featured: boolean;
}

const FeaturedListings: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchFeaturedListings();
  }, []);

  const fetchFeaturedListings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('fortnite_accounts')
        .select('*')
        .eq('status', 'available')
        .eq('featured', true)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setListings(data as Listing[] || []);
    } catch (error: any) {
      console.error('Error fetching featured listings:', error);
      toast.error('Failed to load featured listings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Featured Fortnite Accounts | EL1TE MARKETPLACE</title>
        <meta name="description" content="Browse our premium selection of featured Fortnite accounts with rare skins and items." />
      </Helmet>
      
      <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Featured Listings</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Discover our hand-picked selection of premium Fortnite accounts with rare skins,
            exclusive items, and more.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-bold">Featured Accounts</h2>
          <p className="text-sm text-gray-500">{listings.length} account(s) found</p>
        </div>
            
        <ListingGrid 
          listings={listings}
          loading={loading}
          resetFilters={() => {}}
        />
      </div>
    </div>
  );
};

export default FeaturedListings;
