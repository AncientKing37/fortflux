
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye } from 'lucide-react';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  status: string;
  created_at: string;
}

interface ListingCardProps {
  listing: Listing;
  onDelete: (id: string) => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, onDelete }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500 hover:bg-green-600">Available</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
      case 'sold':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Sold</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <Card className="grid-card h-full flex flex-col shadow-card hover:shadow-card-hover">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              {listing.title}
            </CardTitle>
            <CardDescription className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
              {listing.description}
            </CardDescription>
          </div>
          {getStatusBadge(listing.status)}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="aspect-video rounded-md overflow-hidden mb-3 bg-gray-100 dark:bg-gray-800">
          {listing.images && listing.images.length > 0 ? (
            <img 
              src={listing.images[0]} 
              alt={listing.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-400 dark:text-gray-600">No image</span>
            </div>
          )}
        </div>
        <div className="flex justify-between mb-2 text-sm">
          <span className="text-gray-500 dark:text-gray-400">Price:</span>
          <span className="font-medium text-gray-900 dark:text-gray-50">
            ${parseFloat(listing.price.toString()).toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Listed:</span>
          <span className="text-gray-700 dark:text-gray-300">
            {new Date(listing.created_at).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-3 border-t gap-2">
        <Button variant="outline" size="sm" asChild className="flex-1">
          <Link to={`/marketplace/${listing.id}`} className="flex items-center justify-center">
            <Eye className="mr-1 h-4 w-4" />
            View
          </Link>
        </Button>
        <div className="flex gap-2 flex-1">
          <Button variant="outline" size="sm" asChild className="flex-1">
            <Link to={`/dashboard/edit-listing/${listing.id}`} className="flex items-center justify-center">
              <Edit className="mr-1 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            className="flex-1 flex items-center justify-center"
            onClick={() => onDelete(listing.id)}
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ListingCard;
