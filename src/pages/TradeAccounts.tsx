import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';
import MarketplaceFilters from '@/components/marketplace/MarketplaceFilters';
import ListingGrid from '@/components/marketplace/ListingGrid';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type FortniteAccount = Database['public']['Tables']['fortnite_accounts']['Row'];
type AccountStatus = 'available' | 'pending' | 'sold' | 'trading';

const TradeAccounts: React.FC = () => {
  const [listings, setListings] = useState<FortniteAccount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [minSkins, setMinSkins] = useState<number>(0);
  const [rarity, setRarity] = useState<string>('all');
  const [hasBattlePass, setHasBattlePass] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<number>(0);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('fortnite_accounts')
        .select()
        .eq('status', 'available' as AccountStatus)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setListings(data || []);
    } catch (error: any) {
      console.error('Error fetching trade listings:', error);
      toast.error('Failed to load trade listings');
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
        !listing.description?.toLowerCase()?.includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Price range filter
    const price = listing.price;
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
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'most-skins':
        return (b.skins || 0) - (a.skins || 0);
      case 'newest':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  return (
    <div className="min-h-screen bg-black">
      <Helmet>
        <title>Trade Fortnite Accounts | FortFlux</title>
        <meta name="description" content="Trade your Fortnite accounts securely with other players." />
      </Helmet>
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-black text-white py-16 px-4 relative overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl font-bold mb-4 text-black">Fortnite Account Trading</h1>
          <p className="text-lg mb-8 max-w-3xl mx-auto text-gray-900 font-medium">
            Trade your Fortnite accounts securely with other players on our trusted platform.
          </p>
          
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
            <Input
              type="search"
              placeholder="Search accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-6 bg-white text-gray-900 rounded-lg border-2 border-yellow-400 focus:border-yellow-500 focus:ring-yellow-500 shadow-lg"
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:sticky md:top-4 h-fit">
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
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Available for Trade</h2>
              <p className="text-sm text-yellow-400">{sortedListings.length} account(s) found</p>
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

export default TradeAccounts; 