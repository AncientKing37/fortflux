
import React from 'react';
import { Listing, rarityStyles } from './types';
import { formatDate } from './ListingUtils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Clock, Tag, DollarSign, Gamepad2, ImageIcon } from 'lucide-react';

interface ListingDetailsDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  listing: Listing | null;
  handleApproveListing: (listingId: string) => void;
  handleOpenRejectDialog: () => void;
}

const ListingDetailsDialog: React.FC<ListingDetailsDialogProps> = ({
  open,
  setOpen,
  listing,
  handleApproveListing,
  handleOpenRejectDialog
}) => {
  if (!listing) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{listing.title}</DialogTitle>
          <DialogDescription>
            Listing ID: {listing.id}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
            <TabsTrigger value="images" className="flex-1">Images</TabsTrigger>
            <TabsTrigger value="seller" className="flex-1">Seller Info</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Price</h3>
                  <p className="text-2xl font-bold">${listing.price.toFixed(2)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Rarity</h3>
                  <Badge 
                    className={rarityStyles[listing.rarity]?.color || rarityStyles.Default.color + " text-white"}
                  >
                    {listing.rarity}
                  </Badge>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                  <p className="text-sm">{listing.description}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-muted-foreground">Skins</h3>
                    <p className="flex items-center gap-1">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      {listing.skins}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-muted-foreground">V-Bucks</h3>
                    <p className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      {listing.vBucks || 0}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-muted-foreground">Account Level</h3>
                    <p className="flex items-center gap-1">
                      <Gamepad2 className="h-4 w-4 text-muted-foreground" />
                      {listing.level}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-muted-foreground">Battle Pass</h3>
                    <p className="flex items-center gap-1">
                      {listing.battlePass ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-muted-foreground">Submitted</h3>
                  <p className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {formatDate(listing.createdAt.toString())}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="images" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {listing.images && listing.images.length > 0 ? (
                listing.images.map((image, index) => (
                  <div key={index} className="rounded-lg overflow-hidden border">
                    <img 
                      src={image} 
                      alt={`Listing image ${index + 1}`} 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-muted-foreground flex flex-col items-center">
                  <ImageIcon className="h-16 w-16 mb-2 opacity-20" />
                  <p>No images available for this listing</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="seller" className="space-y-4 pt-4">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center">
                <img 
                  src={listing.seller.avatar} 
                  alt={listing.seller.username} 
                  className="w-24 h-24 rounded-full mb-2"
                />
                <h3 className="text-lg font-bold">{listing.seller.username}</h3>
                <p className="text-sm text-muted-foreground">ID: {listing.seller.id}</p>
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Sold</h3>
                    <p className="flex items-center gap-1">
                      {listing.seller.totalSold || 0} listings
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-muted-foreground">Joined</h3>
                    <p className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {listing.seller.joinedDate ? formatDate(listing.seller.joinedDate) : 'Unknown'}
                    </p>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-blue-600"
                  >
                    View Seller Profile
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <div className="flex flex-1 gap-2">
            <Button 
              variant="destructive" 
              className="flex-1 sm:flex-none"
              onClick={handleOpenRejectDialog}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => handleApproveListing(listing.id)}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ListingDetailsDialog;
