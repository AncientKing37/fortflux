import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, MessageSquare } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Database } from '@/integrations/supabase/types';

type FortniteAccount = Database['public']['Tables']['fortnite_accounts']['Row'];

interface ListingGridProps {
  listings: FortniteAccount[];
  loading?: boolean;
  resetFilters?: () => void;
  onTradeRequest?: (listing: FortniteAccount) => void;
}

export const ListingGrid: React.FC<ListingGridProps> = ({ 
  listings, 
  loading, 
  resetFilters,
  onTradeRequest 
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-64" />
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400 mb-4">No listings found</p>
        {resetFilters && (
          <button
            onClick={resetFilters}
            className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
          >
            Reset filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {listings.map((listing) => (
        <div
          key={listing.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
        >
          <div className="relative aspect-video">
            {listing.images && listing.images.length > 0 ? (
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-gray-400">No image</span>
              </div>
            )}
            {listing.featured && (
              <span className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded-md text-xs">
                Featured
              </span>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              {listing.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
              {listing.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {listing.battle_pass && (
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                  Battle Pass
                </span>
              )}
              {listing.rarity && (
                <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                  {listing.rarity}
                </span>
              )}
              {listing.skins && (
                <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                  {listing.skins} Skins
                </span>
              )}
              {listing.v_bucks && (
                <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                  {listing.v_bucks} V-Bucks
                </span>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                ${listing.price}
              </span>
              {onTradeRequest && (
                <button
                  onClick={() => onTradeRequest(listing)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm transition-colors duration-200"
                >
                  Trade
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListingGrid;
