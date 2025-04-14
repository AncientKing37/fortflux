
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Loader2, Heart, ShoppingBag } from 'lucide-react';
import ListingGrid from '@/components/marketplace/ListingGrid';
import { toast } from 'sonner';

interface Listing {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  status: string;
  created_at: string;
}

const Favorites: React.FC = () => {
  const { user } = useUser();
  const [favoriteListings, setFavoriteListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      // Get user's favorite listing IDs
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('favorite_listings')
        .eq('id', user?.id)
        .single();
      
      if (profileError) throw profileError;
      
      const favoriteIds = profileData?.favorite_listings || [];
      
      if (favoriteIds.length === 0) {
        setFavoriteListings([]);
        setLoading(false);
        return;
      }
      
      // Fetch the actual listings
      const { data: listingsData, error: listingsError } = await supabase
        .from('fortnite_accounts')
        .select('*')
        .in('id', favoriteIds)
        .order('created_at', { ascending: false });
      
      if (listingsError) throw listingsError;
      
      setFavoriteListings(listingsData as Listing[] || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to load favorite listings');
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    // This is just a placeholder to satisfy the ListingGrid component
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>My Favorites | Fortnite Marketplace</title>
        <meta name="description" content="View your saved Fortnite account listings" />
      </Helmet>
      
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">My Favorite Listings</h1>
          <p className="text-lg mb-4 max-w-3xl mx-auto">
            Your saved Fortnite accounts that caught your eye
          </p>
          <div className="flex justify-center">
            <Button asChild variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
              <Link to="/marketplace">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Browse Marketplace
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        {!user ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Sign in to see your favorites</h2>
            <p className="text-gray-500 mb-6">You need to be logged in to save and view your favorite listings.</p>
            <Button asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-bold">Your Favorites</h2>
              <p className="text-sm text-gray-500">{favoriteListings.length} saved listing(s)</p>
            </div>
            
            {favoriteListings.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">No favorites yet</h2>
                <p className="text-gray-500 mb-6">You haven't saved any listings to your favorites yet.</p>
                <Button asChild>
                  <Link to="/marketplace">Browse Marketplace</Link>
                </Button>
              </div>
            ) : (
              <ListingGrid 
                listings={favoriteListings}
                loading={false}
                resetFilters={resetFilters}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
