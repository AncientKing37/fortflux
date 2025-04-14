
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';
import MarketplaceHeader from '@/components/marketplace/MarketplaceHeader';
import MarketplaceFilters from '@/components/marketplace/MarketplaceFilters';
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
  skins?: number;
  rarity?: string;
  battle_pass?: boolean;
}

const Marketplace: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [minSkins, setMinSkins] = useState<number>(0);
  const [rarity, setRarity] = useState<string>('all');
  const [hasBattlePass, setHasBattlePass] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<number>(0); // 0=anytime, 1=today, 7=week, etc.

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('fortnite_accounts')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setListings(data as Listing[] || []);
    } catch (error: any) {
      console.error('Error fetching listings:', error);
      toast.error('Failed to load marketplace listings');
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setPriceRange([0, 1000]);
    setSortBy('newest');
    setMinSkins(0);
    setRarity('all');
    setHasBattlePass(false);
    setDateRange(0);
  };

  const filteredListings = listings.filter(listing => {
    // Search term filter
    if (searchTerm && !listing.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !listing.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Price range filter
    const price = parseFloat(listing.price.toString());
    if (price < priceRange[0] || price > priceRange[1]) {
      return false;
    }
    
    // Minimum skins filter
    if (minSkins > 0 && (!listing.skins || listing.skins < minSkins)) {
      return false;
    }
    
    // Rarity filter
    if (rarity !== 'all' && listing.rarity?.toLowerCase() !== rarity.toLowerCase()) {
      return false;
    }
    
    // Battle pass filter
    if (hasBattlePass && !listing.battle_pass) {
      return false;
    }
    
    // Date filter
    if (dateRange > 0) {
      const listingDate = new Date(listing.created_at);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - dateRange);
      
      if (listingDate < cutoffDate) {
        return false;
      }
    }
    
    return true;
  });
  
  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseFloat(a.price.toString()) - parseFloat(b.price.toString());
      case 'price-high':
        return parseFloat(b.price.toString()) - parseFloat(a.price.toString());
      case 'most-skins':
        return (b.skins || 0) - (a.skins || 0);
      case 'newest':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Fortnite Accounts Marketplace</title>
        <meta name="description" content="Browse and buy verified Fortnite accounts with rare skins, battle passes, and more." />
      </Helmet>
      
      <MarketplaceHeader 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <MarketplaceFilters 
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            sortBy={sortBy}
            setSortBy={setSortBy}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            resetFilters={resetFilters}
            minSkins={minSkins}
            setMinSkins={setMinSkins}
            rarity={rarity}
            setRarity={setRarity}
            hasBattlePass={hasBattlePass}
            setHasBattlePass={setHasBattlePass}
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
          
          <div className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-bold">Available Accounts</h2>
              <p className="text-sm text-gray-500">{sortedListings.length} account(s) found</p>
            </div>
            
            <ListingGrid 
              listings={sortedListings}
              loading={loading}
              resetFilters={resetFilters}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
