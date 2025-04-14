
import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useSocket } from '@/contexts/SocketContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Bitcoin, Loader2, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import TransactionChat from '@/components/chat/TransactionChat';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import CryptoCheckout from '@/components/payment/CryptoCheckout';

interface PurchasePanelProps {
  transaction: string | null;
  listing: {
    id: string;
    seller_id: string;
    title: string;
    price: number;
  };
  sellerUsername: string;
}

const PurchasePanel: React.FC<PurchasePanelProps> = ({ 
  transaction, 
  listing, 
  sellerUsername 
}) => {
  const { user } = useUser();
  const { requestEscrow } = useSocket();
  const [showEscrowChat, setShowEscrowChat] = useState(false);
  const [showCryptoCheckout, setShowCryptoCheckout] = useState(false);
  const [transactionData, setTransactionData] = useState<any>(null);
  const [isCreatingTransaction, setIsCreatingTransaction] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  
  const handleBuyNow = async () => {
    if (!user || !listing) {
      toast.error('You must be logged in to make a purchase');
      return;
    }
    
    if (user.id === listing.seller_id) {
      toast.error('You cannot buy your own listing');
      return;
    }
    
    setIsCreatingTransaction(true);
    setPaymentError(null);
    toast.info('Creating transaction...');
    
    try {
      // Get session token for authorization
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      
      if (!token) {
        throw new Error('Authentication token not available');
      }
      
      // Construct the URL for the edge function
      const functionUrl = `${process.env.SUPABASE_URL || 'https://hrhhezrllnjcclcepedz.supabase.co'}/functions/v1/create-transaction`;
      
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          listing_id: listing.id,
          seller_id: listing.seller_id,
          amount: listing.price
        })
      });
      
      const data = await response.json();
        
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create transaction');
      }
      
      if (data && data.success) {
        toast.success('Transaction created successfully');
        window.location.reload();
      } else {
        throw new Error(data?.message || 'Failed to create transaction');
      }
    } catch (error: any) {
      console.error('Error creating transaction:', error);
      toast.error(`Failed to create transaction: ${error.message}`);
    } finally {
      setIsCreatingTransaction(false);
    }
  };

  const handleRequestEscrow = async () => {
    if (!user || !transaction || !listing) {
      toast.error('Missing required information');
      return;
    }
    
    const success = await requestEscrow(
      transaction,
      listing.id,
      sellerUsername
    );
    
    if (success) {
      setShowEscrowChat(true);
    }
  };

  useEffect(() => {
    const fetchTransactionData = async () => {
      if (!transaction) return;
      
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('id', transaction)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setTransactionData(data);
        }
      } catch (error) {
        console.error('Error fetching transaction data:', error);
      }
    };
    
    fetchTransactionData();
  }, [transaction]);

  const handlePayWithCrypto = () => {
    if (!transaction) {
      toast.error('No active transaction found');
      return;
    }
    setPaymentError(null);
    setShowCryptoCheckout(true);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>
        <div className="flex items-center mb-6">
          <DollarSign className="h-6 w-6 text-green-600" />
          <span className="text-3xl font-bold text-green-600">
            ${parseFloat(listing.price.toString()).toFixed(2)}
          </span>
        </div>
        
        {paymentError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 text-red-500" />
            <div>
              <p className="font-medium">Payment Error</p>
              <p>{paymentError}</p>
            </div>
          </div>
        )}
        
        {!transaction ? (
          <Button 
            className="w-full mb-4" 
            size="lg"
            onClick={handleBuyNow}
            disabled={user?.id === listing.seller_id || isCreatingTransaction}
          >
            {isCreatingTransaction ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Transaction...
              </>
            ) : user?.id === listing.seller_id ? (
              'Your Own Listing'
            ) : (
              'Buy Now'
            )}
          </Button>
        ) : transactionData?.status === 'pending' ? (
          <div className="space-y-3">
            <Button 
              className="w-full" 
              size="lg"
              onClick={handlePayWithCrypto}
            >
              <Bitcoin className="mr-2 h-4 w-4" />
              Pay with Crypto
            </Button>
            
            <Button 
              className="w-full" 
              size="lg"
              variant="outline"
              onClick={handleRequestEscrow}
            >
              Request Escrow
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Button 
              className="w-full" 
              size="lg"
              variant="outline"
              onClick={handleRequestEscrow}
            >
              Request Escrow
            </Button>
            
            <Dialog open={showEscrowChat} onOpenChange={setShowEscrowChat}>
              <DialogTrigger asChild>
                <Button className="w-full" variant="secondary">
                  Open Transaction Chat
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] h-[80vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle>Escrow Transaction Chat</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-hidden">
                  {transaction && <TransactionChat transactionId={transaction} />}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
        
        <p className="text-sm text-gray-500 text-center mt-2">
          Protected by our secure escrow service
        </p>
      </CardContent>
      
      <CryptoCheckout 
        isOpen={showCryptoCheckout} 
        onClose={() => {
          setShowCryptoCheckout(false);
          // Refresh transaction data when closing the checkout
          if (transaction) {
            supabase
              .from('transactions')
              .select('*')
              .eq('id', transaction)
              .single()
              .then(({ data }) => {
                if (data) setTransactionData(data);
              });
          }
        }}
        transaction={transactionData}
        onError={(error) => {
          setPaymentError(error);
        }}
      />
    </Card>
  );
};

export default PurchasePanel;
