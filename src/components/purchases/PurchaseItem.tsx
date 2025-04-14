
import React, { useState } from 'react';
import { SupabaseTransactionWithRelations } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, Clock, X, MessageSquare, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import TransactionChat from '@/components/chat/TransactionChat';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import SellerRankBadge from '@/components/seller/SellerRankBadge';
import EscrowRankBadge from '@/components/escrow/EscrowRankBadge';
import VouchForm from '@/components/vouch/VouchForm';

interface PurchaseItemProps {
  transaction: SupabaseTransactionWithRelations;
  hasVouch: boolean;
  onRelease: () => void;
  onVouchCreated: () => void;
}

const PurchaseItem: React.FC<PurchaseItemProps> = ({ 
  transaction, 
  hasVouch, 
  onRelease,
  onVouchCreated
}) => {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeVouchDialogId, setActiveVouchDialogId] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'in_escrow':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'cancelled':
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_escrow':
        return 'In Escrow';
      case 'cancelled':
        return 'Cancelled';
      case 'disputed':
        return 'Disputed';
      case 'pending':
        return 'Pending';
      default:
        return status;
    }
  };

  const handleReleaseFunds = async () => {
    try {
      const { data, error } = await supabase.rpc('release_funds', {
        p_transaction_id: transaction.id,
        p_user_id: transaction.buyer_id
      });
      
      if (error) throw error;
      
      // Robust null and type checking
      const responseData = data as any;
      if (responseData && typeof responseData === 'object' && 'success' in responseData && responseData.success === true) {
        toast.success('Funds released successfully');
        onRelease();
      } else {
        const errorMessage = 
          responseData && 
          typeof responseData === 'object' && 
          'message' in responseData ? 
            responseData.message : 
            'Failed to release funds';
            
        toast.error(errorMessage);
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleVouchCreated = () => {
    setActiveVouchDialogId(null);
    onVouchCreated();
  };

  return (
    <Card key={transaction.id}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{transaction.account?.title || 'Fortnite Account'}</CardTitle>
            <CardDescription>
              Transaction ID: {transaction.id.substring(0, 8)}...
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="font-bold text-lg">${transaction.amount.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">
              {transaction.crypto_amount} {transaction.crypto_type}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between border-t pt-4">
          <div className="flex items-center space-x-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              transaction.status === 'completed' 
                ? 'bg-green-100' 
                : transaction.status === 'in_escrow'
                ? 'bg-yellow-100'
                : 'bg-gray-100'
            }`}>
              {getStatusIcon(transaction.status)}
            </div>
            <div>
              <div className="flex items-center">
                <span className="font-medium mr-2">Status:</span>
                <span className="capitalize">{getStatusText(transaction.status)}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {new Date(transaction.created_at).toLocaleDateString()} at {new Date(transaction.created_at).toLocaleTimeString()}
              </div>
              
              {transaction.seller && !transaction.seller.error && (
                <div className="flex items-center mt-1">
                  <Avatar className="h-5 w-5 mr-1">
                    <AvatarImage src={transaction.seller.avatar_url} />
                    <AvatarFallback>{transaction.seller.username ? transaction.seller.username.substring(0, 2).toUpperCase() : 'SE'}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm mr-2">Seller: {transaction.seller.username}</span>
                  {transaction.seller.vouch_count > 0 && (
                    <SellerRankBadge dealCount={transaction.seller.vouch_count} size="sm" />
                  )}
                </div>
              )}
              
              {transaction.escrow && !transaction.escrow.error && (
                <div className="flex items-center mt-1">
                  <Avatar className="h-5 w-5 mr-1">
                    <AvatarImage src={transaction.escrow.avatar_url} />
                    <AvatarFallback>{transaction.escrow.username ? transaction.escrow.username.substring(0, 2).toUpperCase() : 'ES'}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm mr-2">Escrow: {transaction.escrow.username}</span>
                  {transaction.escrow.vouch_count > 0 && (
                    <EscrowRankBadge dealCount={transaction.escrow.vouch_count} size="sm" />
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            {transaction.status === 'in_escrow' && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleReleaseFunds}
              >
                Release Funds
              </Button>
            )}
            
            {transaction.status === 'completed' && !hasVouch && transaction.seller && (
              <Dialog open={activeVouchDialogId === transaction.id} onOpenChange={(open) => {
                if (!open) setActiveVouchDialogId(null);
              }}>
                <DialogTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setActiveVouchDialogId(transaction.id)}
                  >
                    <Star className="mr-2 h-4 w-4" />
                    Leave Feedback
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Rate Your Transaction</DialogTitle>
                  </DialogHeader>
                  <VouchForm 
                    transactionId={transaction.id}
                    sellerId={transaction.seller_id}
                    sellerUsername={transaction.seller?.username || 'Seller'}
                    onVouchCreated={handleVouchCreated}
                  />
                </DialogContent>
              </Dialog>
            )}
            
            <Dialog open={activeChatId === transaction.id} onOpenChange={(open) => {
              if (!open) setActiveChatId(null);
            }}>
              <DialogTrigger asChild>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setActiveChatId(transaction.id)}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Chat
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] h-[80vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle>Transaction Chat</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-hidden">
                  <TransactionChat transactionId={transaction.id} />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PurchaseItem;
