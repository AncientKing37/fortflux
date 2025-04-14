
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, ArrowUpDown, ExternalLink, Bitcoin, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface PaymentBuyer {
  username?: string;
}

interface PaymentSeller {
  username?: string;
}

interface PaymentAccount {
  title?: string;
}

interface PaymentTransaction {
  buyer?: PaymentBuyer | null;
  seller?: PaymentSeller | null;
  fortnite_account?: PaymentAccount | null;
}

interface Payment {
  id: string;
  transaction_id: string;
  nowpayments_invoice_id: string;
  crypto_currency: string;
  payment_status: string;
  amount: number;
  created_at: string;
  transaction?: PaymentTransaction | null;
}

const statusColors = {
  'waiting': 'bg-yellow-500',
  'confirming': 'bg-blue-500',
  'confirmed': 'bg-green-500',
  'sending': 'bg-purple-500',
  'finished': 'bg-green-700',
  'failed': 'bg-red-500',
  'expired': 'bg-gray-500',
  'refunded': 'bg-orange-500',
  'pending': 'bg-yellow-400'
};

const PaymentsDashboard: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [statsData, setStatsData] = useState({
    totalAmount: 0,
    completedAmount: 0,
    pendingAmount: 0,
    paymentCount: 0,
    successRate: 0
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      // First, fetch all crypto payments
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('crypto_payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (paymentsError) throw paymentsError;

      // Create a map to store additional info for each payment
      const paymentInfoMap = new Map();
      
      if (paymentsData && paymentsData.length > 0) {
        // Get all transaction IDs
        const transactionIds = paymentsData.map(payment => payment.transaction_id);
        
        // Fetch transaction details for all payments
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('transactions')
          .select('id, buyer_id, seller_id, account_id')
          .in('id', transactionIds);
          
        if (transactionsError) throw transactionsError;
        
        if (transactionsData && transactionsData.length > 0) {
          // Create maps for buyer, seller, and account info
          const buyerIds = transactionsData.map(t => t.buyer_id).filter(Boolean);
          const sellerIds = transactionsData.map(t => t.seller_id).filter(Boolean);
          const accountIds = transactionsData.map(t => t.account_id).filter(Boolean);
          
          // Get buyer profiles
          const { data: buyersData } = await supabase
            .from('profiles')
            .select('id, username')
            .in('id', buyerIds);
            
          // Get seller profiles  
          const { data: sellersData } = await supabase
            .from('profiles')
            .select('id, username')
            .in('id', sellerIds);
            
          // Get account info
          const { data: accountsData } = await supabase
            .from('fortnite_accounts')
            .select('id, title')
            .in('id', accountIds);
            
          // Create lookup maps
          const buyerMap = new Map();
          const sellerMap = new Map();
          const accountMap = new Map();
          
          buyersData?.forEach(buyer => buyerMap.set(buyer.id, buyer));
          sellersData?.forEach(seller => sellerMap.set(seller.id, seller));
          accountsData?.forEach(account => accountMap.set(account.id, account));
          
          // For each transaction, collect related data
          transactionsData.forEach(transaction => {
            const buyer = buyerMap.get(transaction.buyer_id);
            const seller = sellerMap.get(transaction.seller_id);
            const account = accountMap.get(transaction.account_id);
            
            paymentInfoMap.set(transaction.id, {
              buyer: buyer ? { username: buyer.username } : { username: 'Unknown' },
              seller: seller ? { username: seller.username } : { username: 'Unknown' },
              fortnite_account: account ? { title: account.title } : { title: 'Unknown' }
            });
          });
        }
      }

      // Map payments with their related info
      const mappedPayments: Payment[] = paymentsData?.map(payment => ({
        id: payment.id,
        transaction_id: payment.transaction_id,
        nowpayments_invoice_id: payment.nowpayments_invoice_id || '',
        crypto_currency: payment.crypto_currency,
        payment_status: payment.payment_status || 'pending',
        amount: payment.amount,
        created_at: payment.created_at,
        transaction: paymentInfoMap.get(payment.transaction_id) || {
          buyer: { username: 'Unknown' },
          seller: { username: 'Unknown' },
          fortnite_account: { title: 'Unknown' }
        }
      })) || [];
      
      setPayments(mappedPayments);
      
      // Calculate statistics
      if (paymentsData) {
        const total = paymentsData.reduce((sum, payment) => sum + payment.amount, 0);
        const completed = paymentsData.filter(payment => 
          ['confirmed', 'finished'].includes(payment.payment_status || '')
        ).reduce((sum, payment) => sum + payment.amount, 0);
        const pending = paymentsData.filter(payment => 
          ['waiting', 'confirming', 'sending'].includes(payment.payment_status || '')
        ).reduce((sum, payment) => sum + payment.amount, 0);
        const successCount = paymentsData.filter(payment => 
          ['confirmed', 'finished'].includes(payment.payment_status || '')
        ).length;
        
        setStatsData({
          totalAmount: total,
          completedAmount: completed,
          pendingAmount: pending,
          paymentCount: paymentsData.length,
          successRate: paymentsData.length > 0 ? (successCount / paymentsData.length) * 100 : 0
        });
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getCurrencyName = (code: string): string => {
    const names: Record<string, string> = {
      'btc': 'Bitcoin',
      'eth': 'Ethereum',
      'ltc': 'Litecoin',
      'doge': 'Dogecoin',
      'usdt': 'Tether USD',
      'usdc': 'USD Coin',
      'xrp': 'Ripple',
      'sol': 'Solana',
      'bnb': 'Binance Coin',
      'ada': 'Cardano',
    };
    return names[code?.toLowerCase()] || code?.toUpperCase() || 'Unknown';
  };

  const filteredPayments = payments
    .filter(payment => {
      const matchesSearch = 
        payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (payment.transaction?.buyer?.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (payment.transaction?.seller?.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (payment.transaction?.fortnite_account?.title || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || payment.payment_status === filterStatus;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let fieldA, fieldB;
      
      if (sortField === 'buyer') {
        fieldA = a.transaction?.buyer?.username?.toLowerCase() || '';
        fieldB = b.transaction?.buyer?.username?.toLowerCase() || '';
      } else if (sortField === 'seller') {
        fieldA = a.transaction?.seller?.username?.toLowerCase() || '';
        fieldB = b.transaction?.seller?.username?.toLowerCase() || '';
      } else if (sortField === 'account') {
        fieldA = a.transaction?.fortnite_account?.title?.toLowerCase() || '';
        fieldB = b.transaction?.fortnite_account?.title?.toLowerCase() || '';
      } else {
        fieldA = a[sortField as keyof Payment];
        fieldB = b[sortField as keyof Payment];
      }
      
      if (sortField === 'created_at') {
        fieldA = new Date(fieldA as string).getTime();
        fieldB = new Date(fieldB as string).getTime();
      }
      
      if (sortField === 'crypto_currency') {
        fieldA = getCurrencyName(fieldA as string).toLowerCase();
        fieldB = getCurrencyName(fieldB as string).toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return fieldA > fieldB ? 1 : -1;
      } else {
        return fieldA < fieldB ? 1 : -1;
      }
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Crypto Payments Dashboard</h1>
        <p className="text-muted-foreground">Monitor crypto payments across the platform</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${statsData.totalAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              All-time payment volume
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed Payments</CardTitle>
            <Bitcoin className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${statsData.completedAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Successfully processed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Loader2 className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${statsData.pendingAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.successRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {statsData.paymentCount} total transactions
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Transactions</CardTitle>
          <CardDescription>
            Monitor all crypto payment transactions across the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payments..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="waiting">Waiting</SelectItem>
                  <SelectItem value="confirming">Confirming</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="sending">Sending</SelectItem>
                  <SelectItem value="finished">Finished</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('created_at')}>
                      <div className="flex items-center gap-1">
                        Date
                        {sortField === 'created_at' && (
                          <ArrowUpDown size={16} className={sortDirection === 'asc' ? 'transform rotate-180' : ''} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('account')}>
                      <div className="flex items-center gap-1">
                        Account
                        {sortField === 'account' && (
                          <ArrowUpDown size={16} className={sortDirection === 'asc' ? 'transform rotate-180' : ''} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('buyer')}>
                      <div className="flex items-center gap-1">
                        Buyer
                        {sortField === 'buyer' && (
                          <ArrowUpDown size={16} className={sortDirection === 'asc' ? 'transform rotate-180' : ''} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('seller')}>
                      <div className="flex items-center gap-1">
                        Seller
                        {sortField === 'seller' && (
                          <ArrowUpDown size={16} className={sortDirection === 'asc' ? 'transform rotate-180' : ''} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('amount')}>
                      <div className="flex items-center gap-1">
                        Amount
                        {sortField === 'amount' && (
                          <ArrowUpDown size={16} className={sortDirection === 'asc' ? 'transform rotate-180' : ''} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('crypto_currency')}>
                      <div className="flex items-center gap-1">
                        Currency
                        {sortField === 'crypto_currency' && (
                          <ArrowUpDown size={16} className={sortDirection === 'asc' ? 'transform rotate-180' : ''} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('payment_status')}>
                      <div className="flex items-center gap-1">
                        Status
                        {sortField === 'payment_status' && (
                          <ArrowUpDown size={16} className={sortDirection === 'asc' ? 'transform rotate-180' : ''} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        No payments found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          {format(new Date(payment.created_at), 'MMM d, yyyy')}
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(payment.created_at), 'h:mm a')}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {payment.transaction_id.substring(0, 8)}...
                        </TableCell>
                        <TableCell className="max-w-[180px] truncate">
                          {payment.transaction?.fortnite_account?.title || 'Unknown'}
                        </TableCell>
                        <TableCell>
                          {payment.transaction?.buyer?.username || 'Unknown'}
                        </TableCell>
                        <TableCell>
                          {payment.transaction?.seller?.username || 'Unknown'}
                        </TableCell>
                        <TableCell className="font-medium">
                          ${payment.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Bitcoin className="h-3 w-3" />
                            {getCurrencyName(payment.crypto_currency)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={statusColors[payment.payment_status as keyof typeof statusColors] || 'bg-gray-500'} 
                            variant="outline"
                          >
                            {payment.payment_status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              if (payment.nowpayments_invoice_id) {
                                window.open(`https://nowpayments.io/payment/?iid=${payment.nowpayments_invoice_id}`, '_blank');
                              }
                            }}
                            disabled={!payment.nowpayments_invoice_id}
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span className="sr-only">View Invoice</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsDashboard;
