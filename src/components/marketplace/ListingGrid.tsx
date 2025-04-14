
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import FavoriteButton from '@/components/listing/FavoriteButton';

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
}

interface ListingGridProps {
  listings: Listing[];
  loading: boolean;
  resetFilters: () => void;
}

const ListingGrid: React.FC<ListingGridProps> = ({ listings, loading, resetFilters }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8 text-center shadow-sm">
        <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">No accounts found</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">Try adjusting your filters or search criteria.</p>
        <Button 
          variant="outline"
          onClick={resetFilters}
          className="font-medium"
        >
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <Card key={listing.id} className="grid-card h-full flex flex-col">
          <div className="aspect-video w-full overflow-hidden relative group">
            {listing.images && listing.images.length > 0 ? (
              <img 
                src={listing.images[0]} 
                alt={listing.title} 
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">No image</span>
              </div>
            )}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <FavoriteButton listingId={listing.id} variant="outline" showText={false} className="bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800" />
            </div>
            {listing.rarity && (
              <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs py-1 px-2 rounded capitalize">
                {listing.rarity}
              </div>
            )}
            {listing.skins && (
              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs py-1 px-2 rounded">
                {listing.skins}+ skins
              </div>
            )}
          </div>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-50 line-clamp-1">
              {listing.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
              {listing.description}
            </p>
            <div className="text-xl font-bold text-primary">
              ${parseFloat(listing.price.toString()).toFixed(2)}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-between">
            <Button 
              asChild 
              className="w-3/4 font-medium"
            >
              <Link to={`/marketplace/${listing.id}`}>
                View Details
              </Link>
            </Button>
            <FavoriteButton listingId={listing.id} variant="ghost" showText={false} className="ml-2" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ListingGrid;
