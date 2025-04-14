import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, AlertCircle, CheckCircle2, ExternalLink, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useUser } from '@/contexts/UserContext';
import { Transaction } from '@/types';

interface CryptoCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onError?: (error: string) => void;
}

interface Currency {
  currency: string;
  name: string;
  logo?: string;
}

// Supported cryptocurrencies (including LTC now)
const SUPPORTED_CURRENCIES = ['btc', 'eth', 'usdt', 'ltc'];

const CryptoCheckout: React.FC<CryptoCheckoutProps> = ({ isOpen, onClose, transaction, onError }) => {
  const { user } = useUser();
  const [cryptoCurrencies, setCryptoCurrencies] = useState<Currency[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('btc');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkInterval, setCheckInterval] = useState<NodeJS.Timeout | null>(null);

  const fetchCryptoCurrencies = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Use direct fetch with proper error handling
      const functionUrl = `${process.env.SUPABASE_URL || 'https://hrhhezrllnjcclcepedz.supabase.co'}/functions/v1/nowpayments`;
      
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      
      if (!token) {
        throw new Error('Authentication token not available');
      }
      
      const response = await fetch(`${functionUrl}/currencies`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch cryptocurrencies');
      }
      
      const data = await response.json();

      // Filter for only supported currencies
      const formattedCurrencies = SUPPORTED_CURRENCIES
        .filter(currency => data.currencies.map((c: string) => c.toLowerCase()).includes(currency))
        .map(currency => ({
          currency: currency.toLowerCase(),
          name: getCurrencyName(currency),
        }));

      setCryptoCurrencies(formattedCurrencies);
    } catch (error: any) {
      console.error('Error fetching cryptocurrencies:', error);
      const errorMsg = 'Failed to load payment options. Please try again.';
      setError(errorMsg);
      if (onError) onError(errorMsg);
      toast.error('Failed to load payment options');
    } finally {
      setIsLoading(false);
    }
  };

  const checkExistingPayment = async () => {
    if (!transaction?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('crypto_payments')
        .select('*')
        .eq('transaction_id', transaction.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking existing payment:', error);
        return;
      }
      
      if (data && data.nowpayments_invoice_id) {
        setPaymentId(data.id);
        setPaymentStatus(data.payment_status);
        setSelectedCurrency(data.crypto_currency);
        
        if (data.payment_status === 'waiting') {
          setInvoiceUrl(`https://nowpayments.io/payment/?iid=${data.nowpayments_invoice_id}`);
          setInvoiceId(data.nowpayments_invoice_id);
        }
      }
    } catch (err) {
      console.error('Error checking existing payment:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCryptoCurrencies();
      checkExistingPayment();
    } else {
      setInvoiceUrl(null);
      setInvoiceId(null);
      setError(null);
      
      // Clear any interval when closing
      if (checkInterval) {
        clearInterval(checkInterval);
        setCheckInterval(null);
      }
    }
  }, [isOpen, transaction]);
  
  // Periodically check payment status
  useEffect(() => {
    if (isOpen && paymentId && (paymentStatus === 'waiting' || paymentStatus === 'confirming')) {
      // Clear any existing interval first
      if (checkInterval) {
        clearInterval(checkInterval);
      }
      
      const intervalId = setInterval(async () => {
        try {
          const functionUrl = `${process.env.SUPABASE_URL || 'https://hrhhezrllnjcclcepedz.supabase.co'}/functions/v1/nowpayments`;
          
          const { data: sessionData } = await supabase.auth.getSession();
          const token = sessionData?.session?.access_token;
          
          if (!token) {
            throw new Error('Authentication token not available');
          }
          
          const response = await fetch(`${functionUrl}/payment-status?paymentId=${paymentId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to check payment status');
          }
          
          const data = await response.json();
          
          if (data?.payment) {
            setPaymentStatus(data.payment.payment_status);
            
            if (['confirmed', 'finished'].includes(data.payment.payment_status)) {
              clearInterval(intervalId);
              toast.success('Payment confirmed! The transaction is now in escrow.');
              onClose();
            } else if (['failed', 'expired'].includes(data.payment.payment_status)) {
              clearInterval(intervalId);
              const errorMsg = 'Payment failed or expired. Please try again.';
              setError(errorMsg);
              if (onError) onError(errorMsg);
            }
          }
        } catch (err) {
          console.error('Error checking payment status:', err);
        }
      }, 10000);
      
      setCheckInterval(intervalId);
      
      return () => {
        if (intervalId) clearInterval(intervalId);
      };
    }
  }, [isOpen, paymentId, paymentStatus, onClose, onError]);

  const getCurrencyName = (code: string): string => {
    const names: Record<string, string> = {
      'btc': 'Bitcoin',
      'eth': 'Ethereum',
      'usdt': 'Tether USD',
      'ltc': 'Litecoin',
    };
    return names[code.toLowerCase()] || code.toUpperCase();
  };

  const handleCreateInvoice = async () => {
    if (!transaction?.id || !selectedCurrency) {
      toast.error('Missing required information');
      return;
    }

    setIsCreatingInvoice(true);
    setError(null);
    
    try {
      console.log('Creating invoice for transaction:', transaction.id, 'with currency:', selectedCurrency);
      
      const functionUrl = `${process.env.SUPABASE_URL || 'https://hrhhezrllnjcclcepedz.supabase.co'}/functions/v1/nowpayments`;
      
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      
      if (!token) {
        throw new Error('Authentication token not available');
      }
      
      const response = await fetch(`${functionUrl}/create-invoice`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transactionId: transaction.id,
          cryptoCurrency: selectedCurrency,
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Failed to create payment invoice');
      }
      
      const data = await response.json();

      if (data.success && data.invoice) {
        setInvoiceUrl(data.invoice.invoice_url);
        setInvoiceId(data.invoice.id);
        setPaymentId(data.payment.id);
        setPaymentStatus('waiting');
        toast.success('Invoice created successfully');
      } else {
        throw new Error('Failed to create invoice: ' + (data.error || 'Unknown error'));
      }
    } catch (error: any) {
      console.error('Error creating invoice:', error);
      const errorMsg = `Failed to create payment invoice: ${error.message}`;
      setError(errorMsg);
      if (onError) onError(errorMsg);
      toast.error('Failed to create payment invoice');
    } finally {
      setIsCreatingInvoice(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    if (onError) onError('');
    fetchCryptoCurrencies();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crypto Payment</DialogTitle>
          <DialogDescription>
            Pay with your preferred cryptocurrency to complete your purchase
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading payment options...</span>
          </div>
        ) : error ? (
          <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
            <Button 
              onClick={handleRetry} 
              variant="outline" 
              className="w-full"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        ) : invoiceUrl ? (
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                  {['confirmed', 'finished'].includes(paymentStatus || '') ? (
                    <>
                      <CheckCircle2 className="h-16 w-16 text-green-500" />
                      <h3 className="text-xl font-bold">Payment Confirmed!</h3>
                      <p>Your transaction is now in escrow.</p>
                    </>
                  ) : ['failed', 'expired'].includes(paymentStatus || '') ? (
                    <>
                      <AlertCircle className="h-16 w-16 text-red-500" />
                      <h3 className="text-xl font-bold">Payment Failed</h3>
                      <p>Your payment could not be processed. Please try again.</p>
                      <Button 
                        onClick={() => {
                          setInvoiceUrl(null);
                          setInvoiceId(null);
                          setPaymentId(null);
                          setPaymentStatus(null);
                          setError(null);
                          if (onError) onError('');
                        }} 
                        variant="outline"
                      >
                        Try Again
                      </Button>
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg font-medium">Your invoice is ready</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Click the button below to complete your payment with {getCurrencyName(selectedCurrency)}
                      </p>
                      <div className="flex flex-col items-center space-y-2 w-full">
                        <Button 
                          className="w-full" 
                          onClick={() => window.open(invoiceUrl, '_blank')}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Pay Now
                        </Button>
                        <p className="text-xs text-gray-500">
                          Invoice ID: {invoiceId?.substring(0, 10)}...
                        </p>
                      </div>
                      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md text-sm text-yellow-800 dark:text-yellow-200">
                        <p>Keep this window open until your payment is confirmed. You'll be redirected once completed.</p>
                        <p className="mt-2 text-xs">Status: <span className="font-medium capitalize">{paymentStatus || 'pending'}</span></p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="crypto">Select Cryptocurrency</Label>
              <Select
                value={selectedCurrency}
                onValueChange={setSelectedCurrency}
                disabled={isCreatingInvoice || cryptoCurrencies.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Cryptocurrency" />
                </SelectTrigger>
                <SelectContent>
                  {cryptoCurrencies.length > 0 ? (
                    cryptoCurrencies.map((currency) => (
                      <SelectItem key={currency.currency} value={currency.currency}>
                        {currency.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>No currencies available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            {transaction && (
              <div className="pt-4 pb-2">
                <div className="rounded-md bg-gray-50 dark:bg-gray-800 p-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Payment Summary</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${transaction.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform Fee:</span>
                      <span>${(transaction.platformFee || 0).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1 pt-1"></div>
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>${transaction.amount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        <DialogFooter className="flex-col sm:flex-col gap-2">
          {!invoiceUrl && !error && cryptoCurrencies.length > 0 && (
            <Button 
              onClick={handleCreateInvoice} 
              disabled={isCreatingInvoice || !selectedCurrency || cryptoCurrencies.length === 0}
              className="w-full"
            >
              {isCreatingInvoice && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Proceed to Payment
            </Button>
          )}
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            {invoiceUrl ? 'Close' : 'Cancel'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CryptoCheckout;
