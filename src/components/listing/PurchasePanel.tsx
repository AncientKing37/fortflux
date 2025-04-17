import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface PurchasePanelProps {
  listingId: string;
  price: number;
  sellerId: string;
  onPurchaseComplete?: () => void;
}

const PurchasePanel: React.FC<PurchasePanelProps> = ({ listingId, price, sellerId, onPurchaseComplete }) => {
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handlePurchase = async () => {
    if (!user) {
      toast.error('Please log in to make a purchase');
      return;
    }

    if (user.id === sellerId) {
      toast.error('You cannot purchase your own listing');
      return;
    }

    try {
      setIsSubmitting(true);

      // Create a new purchase record
      const { data: purchase, error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          listing_id: listingId,
          buyer_id: user.id,
          seller_id: sellerId,
          amount: price * quantity,
          status: 'pending',
        })
        .select()
        .single();

      if (purchaseError) throw purchaseError;

      // Update the listing status
      const { error: listingError } = await supabase
        .from('listings')
        .update({ status: 'sold' })
        .eq('id', listingId);

      if (listingError) throw listingError;

      toast.success('Purchase successful!');
      onPurchaseComplete?.();

    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Failed to complete purchase');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase Item</CardTitle>
        <CardDescription>Complete your purchase securely</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>
          <div className="space-y-1">
            <Label>Total Price</Label>
            <p className="text-2xl font-bold">${(price * quantity).toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handlePurchase}
          disabled={isSubmitting || !user || user.id === sellerId}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Complete Purchase'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PurchasePanel;
