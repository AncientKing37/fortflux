
import React, { useState, useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarDateRangePicker } from '@/components/ui/date-range-picker';
import { format, addDays } from 'date-fns';
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from '@/components/ui/select';
import { DateRange } from 'react-day-picker';
import { Transaction } from '@/types';

// Import the missing component references
import StatsCards from '@/components/admin/fees/StatsCards';
import OverviewTab from '@/components/admin/fees/OverviewTab';
import TransactionsTab from '@/components/admin/fees/TransactionsTab';
import EscrowTab from '@/components/admin/fees/EscrowTab';

// Interface for transactions with fee information
interface TransactionWithFees {
  id: string;
  accountId: string;
  sellerId: string;
  buyerId: string;
  escrowId?: string;
  amount: number;
  status: 'pending' | 'in_escrow' | 'completed' | 'cancelled' | 'disputed';
  cryptoType: string;
  cryptoAmount: number;
  escrowFee?: number;
  platformFee?: number;
  createdAt: Date;
  updatedAt: Date;
  // Additional properties
  seller?: {
    username: string;
    avatar?: string;
  };
  buyer?: {
    username: string;
    avatar?: string;
  };
  escrow?: {
    username: string;
    avatar?: string;
  };
  formattedDate?: string;
}

// Utility function to format dates
const formatDate = (date: Date | string): string => {
  return format(new Date(date), 'MMM dd, yyyy');
};

// Utility function to calculate total fees
const calculateTotalFees = (transactions: TransactionWithFees[]): number => {
  return transactions.reduce((total, transaction) => {
    return total + (transaction.platformFee || 0) + (transaction.escrowFee || 0);
  }, 0);
};

// Utility function to calculate total earnings
const calculateTotalEarnings = (transactions: TransactionWithFees[]): number => {
  return transactions.reduce((total, transaction) => {
    return total + transaction.amount;
  }, 0);
};

// Utility function to group transactions by date
const groupTransactionsByDate = (transactions: TransactionWithFees[]) => {
  return transactions.reduce((groups: { [key: string]: TransactionWithFees[] }, transaction) => {
    const date = formatDate(transaction.createdAt);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {});
};

// Utility function to process transaction data for components
const processTransactionData = (transactions: TransactionWithFees[]) => {
  const totalTransactions = transactions.length;
  const totalVolume = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const totalPlatformFees = transactions.reduce((sum, tx) => sum + (tx.platformFee || 0), 0);
  const totalEscrowFees = transactions.reduce((sum, tx) => sum + (tx.escrowFee || 0), 0);
  const totalFees = totalPlatformFees + totalEscrowFees;
  
  // Calculate percentages and rates
  const platformFeePercentage = totalFees > 0 ? (totalPlatformFees / totalFees) * 100 : 0;
  const escrowFeePercentage = totalFees > 0 ? (totalEscrowFees / totalFees) * 100 : 0;
  const avgTransactionSize = totalTransactions > 0 ? totalVolume / totalTransactions : 0;
  const platformFeeRate = totalVolume > 0 ? (totalPlatformFees / totalVolume) * 100 : 0;
  
  // Daily fee data for charts
  const dailyData = Object.entries(groupTransactionsByDate(transactions)).map(([date, txs]) => {
    const dailyVolume = txs.reduce((sum, tx) => sum + tx.amount, 0);
    const dailyFees = txs.reduce((sum, tx) => sum + ((tx.platformFee || 0) + (tx.escrowFee || 0)), 0);
    return {
      date,
      totalVolume: dailyVolume,
      totalFees: dailyFees,
    };
  });
  
  // Create fee sources data
  const feeSourcesData = [
    { name: "Account Sales", value: 85 },
    { name: "Item Trades", value: 10 },
    { name: "Account Rentals", value: 3 },
    { name: "Other", value: 2 },
  ];
  
  // Create monthly earnings data
  const currentYear = new Date().getFullYear();
  const monthlyEarningsData = [
    { month: "Jan", fees: 2450 },
    { month: "Feb", fees: 3100 },
    { month: "Mar", fees: 4200 },
    { month: "Apr", fees: 3800 },
    { month: "May", fees: 5100 },
    { month: "Jun", fees: 4800 },
    { month: "Jul", fees: 6200 },
    { month: "Aug", fees: 5400 },
    { month: "Sep", fees: 6800 },
    { month: "Oct", fees: 7500 },
    { month: "Nov", fees: 8200 },
    { month: "Dec", fees: 0 },
  ];
  
  // Recent transactions for table display
  const recentTransactionsData = transactions
    .filter(tx => tx.status === 'completed')
    .slice(0, 10)
    .map(tx => ({
      id: tx.id.substring(0, 8),
      date: formatDate(tx.createdAt),
      amount: tx.amount,
      platformFee: tx.platformFee || 0,
      escrowFee: tx.escrowFee || 0,
      buyer: tx.buyer?.username || 'Unknown',
      seller: tx.seller?.username || 'Unknown',
      escrowAgent: tx.escrow?.username || 'System',
      listing: `Account #${tx.accountId.substring(0, 6)}`
    }));
  
  // Escrow agent data
  const escrowAgentData = [
    {
      id: "1",
      name: "Alex Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      earnings: 1250,
      transactions: 48,
      responseTime: 15,
      successRate: 99.2,
      rank: "Platinum"
    },
    {
      id: "2",
      name: "Sarah Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      earnings: 980,
      transactions: 32,
      responseTime: 22,
      successRate: 98.5,
      rank: "Gold"
    },
    {
      id: "3",
      name: "Miguel Lopez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Miguel",
      earnings: 720,
      transactions: 29,
      responseTime: 18,
      successRate: 97.8,
      rank: "Gold"
    },
    {
      id: "4",
      name: "Jordan Patel",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
      earnings: 550,
      transactions: 21,
      responseTime: 25,
      successRate: 96.5,
      rank: "Silver"
    },
  ];
  
  return {
    totalTransactions,
    totalVolume,
    totalPlatformFees,
    totalEscrowFees,
    totalFees,
    platformFeePercentage,
    escrowFeePercentage,
    avgTransactionSize,
    platformFeeRate,
    formattedFeeData: dailyData,
    feeSourcesData,
    monthlyEarningsData,
    recentTransactionsData,
    escrowAgentData
  };
};

const FeesAnalytics: React.FC = () => {
  const { user } = useUser();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [statusFilter, setStatusFilter] = useState<string>('completed');

  // Fetch transaction data from Supabase
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions', dateRange],
    queryFn: async () => {
      const startDate = dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined;
      const endDate = dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined;

      let query = supabase
        .from('transactions')
        .select(`
          id,
          amount,
          crypto_amount,
          crypto_type,
          status,
          platform_fee,
          escrow_fee,
          created_at,
          updated_at,
          account_id,
          seller_id,
          buyer_id,
          escrow_id
        `)
        .order('created_at', { ascending: false });

      // Apply date range filter if provided
      if (startDate && endDate) {
        query = query.gte('created_at', startDate).lte('created_at', endDate);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      // Fetch user information separately to avoid join issues
      const userIds = new Set<string>();
      data?.forEach(tx => {
        if (tx.seller_id) userIds.add(tx.seller_id);
        if (tx.buyer_id) userIds.add(tx.buyer_id);
        if (tx.escrow_id) userIds.add(tx.escrow_id);
      });
      
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', Array.from(userIds));
        
      if (usersError) console.error('Error fetching users:', usersError);
      
      const usersMap = (usersData || []).reduce((map, user) => {
        map[user.id] = { username: user.username, avatar: user.avatar_url };
        return map;
      }, {} as Record<string, { username: string; avatar?: string }>);
      
      // Transform data for use in the component
      const formattedTransactions: TransactionWithFees[] = (data || []).map(tx => ({
        id: tx.id,
        accountId: tx.account_id,
        sellerId: tx.seller_id,
        buyerId: tx.buyer_id,
        escrowId: tx.escrow_id,
        amount: tx.amount,
        status: tx.status as any,
        cryptoType: tx.crypto_type || 'USD',
        cryptoAmount: tx.crypto_amount || tx.amount,
        escrowFee: tx.escrow_fee || 0,
        platformFee: tx.platform_fee || 0,
        createdAt: new Date(tx.created_at),
        updatedAt: new Date(tx.updated_at),
        seller: usersMap[tx.seller_id],
        buyer: usersMap[tx.buyer_id],
        escrow: usersMap[tx.escrow_id],
        formattedDate: format(new Date(tx.created_at), 'MMM dd, yyyy')
      }));
      
      return formattedTransactions;
    }
  });

  // Filter transactions by status
  const filteredTransactions = transactions ? transactions.filter(transaction => {
    return statusFilter === 'all' || transaction.status === statusFilter;
  }) : [];
  
  // Process data for components
  const processedData = useMemo(() => {
    return processTransactionData(filteredTransactions || []);
  }, [filteredTransactions]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Fees & Earnings Analytics</h1>
        <p className="text-muted-foreground">Track platform fees, escrow earnings, and transaction metrics</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <CalendarDateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
        
        <div className="flex gap-2">
          <Select defaultValue="completed" onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_escrow">In Escrow</SelectItem>
              <SelectItem value="disputed">Disputed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <StatsCards 
        totalFees={processedData.totalFees}
        totalVolume={processedData.totalVolume}
        totalPlatformFees={processedData.totalPlatformFees}
        totalEscrowFees={processedData.totalEscrowFees}
        platformFeePercentage={processedData.platformFeePercentage}
        escrowFeePercentage={processedData.escrowFeePercentage}
        avgTransactionSize={processedData.avgTransactionSize}
        platformFeeRate={processedData.platformFeeRate}
      />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="escrow">Escrow Fees</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <OverviewTab 
            formattedFeeData={processedData.formattedFeeData}
            totalPlatformFees={processedData.totalPlatformFees}
            totalEscrowFees={processedData.totalEscrowFees}
            feeSourcesData={processedData.feeSourcesData}
            monthlyEarningsData={processedData.monthlyEarningsData}
          />
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <TransactionsTab 
            recentTransactionsData={processedData.recentTransactionsData}
            formattedFeeData={processedData.formattedFeeData}
            formatDate={formatDate}
          />
        </TabsContent>

        <TabsContent value="escrow" className="space-y-4">
          <EscrowTab 
            escrowAgentData={processedData.escrowAgentData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Add missing import for useUser
import { useUser } from '@/contexts/UserContext';

export default FeesAnalytics;
