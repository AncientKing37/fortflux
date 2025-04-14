
import React from 'react';
import { Listing, rarityStyles } from './types';
import { formatDate } from './ListingUtils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from 'lucide-react';

interface ListingTableProps {
  listings: Listing[];
  handleViewListing: (listing: Listing) => void;
  handleApproveListing: (listingId: string) => void;
  handleOpenRejectDialog: (listing: Listing) => void;
}

const ListingTable: React.FC<ListingTableProps> = ({
  listings,
  handleViewListing,
  handleApproveListing,
  handleOpenRejectDialog
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Seller</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Rarity</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No pending listings found
              </TableCell>
            </TableRow>
          ) : (
            listings.map((listing) => (
              <TableRow key={listing.id}>
                <TableCell className="font-medium">{listing.title}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <img 
                      src={listing.seller.avatar} 
                      alt={listing.seller.username} 
                      className="w-6 h-6 rounded-full"
                    />
                    <span>{listing.seller.username}</span>
                  </div>
                </TableCell>
                <TableCell>${listing.price.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge 
                    className={rarityStyles[listing.rarity]?.color || rarityStyles.Default.color + " text-white"}
                  >
                    {listing.rarity}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(listing.createdAt.toString())}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleViewListing(listing)}
                    >
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      variant="default"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleApproveListing(listing.id)}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleOpenRejectDialog(listing)}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ListingTable;
