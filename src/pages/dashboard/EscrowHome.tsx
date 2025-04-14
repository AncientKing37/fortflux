
import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Shield, Clock, DollarSign, TrendingUp, Check, X, MessageSquare } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboardService';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const EscrowHome: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  if (!user || user.role !== 'escrow') {
    navigate('/dashboard');
    return null;
  }

  const { data: transactions, isLoading, refetch } = useQuery({
    queryKey: ['escrow-transactions', user.id],
    queryFn: async () => {
      return dashboardService.getUserTransactions(user.id, 'escrow');
    }
  });

  const handleReleaseFunds = async (transactionId: string) => {
    try {
      const { data, error } = await supabase
        .rpc('release_funds', { 
          p_transaction_id: transactionId, 
          p_user_id: user.id 
        });
        
      if (error) throw error;
      
      if (data) {
        toast.success('Funds released successfully');
        refetch();
      } else {
        toast.error('Failed to release funds');
      }
    } catch (error: any) {
      console.error('Error releasing funds:', error);
      toast.error(error.message || 'Failed to release funds');
    }
  };

  const handleRefundBuyer = async (transactionId: string) => {
    try {
      const { data, error } = await supabase
        .rpc('refund_buyer', { 
          p_transaction_id: transactionId, 
          p_user_id: user.id 
        });
        
      if (error) throw error;
      
      if (data) {
        toast.success('Buyer refunded successfully');
        refetch();
      } else {
        toast.error('Failed to refund buyer');
      }
    } catch (error: any) {
      console.error('Error refunding buyer:', error);
      toast.error(error.message || 'Failed to refund buyer');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Escrow Agent Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  const activeEscrows = transactions?.filter(t => t.status === 'in_escrow') || [];
  const completedEscrows = transactions?.filter(t => t.status === 'completed') || [];
  
  const totalEarnings = completedEscrows.reduce((sum, t) => sum + (t.escrowFee || 0), 0);
  const pendingEarnings = activeEscrows.reduce((sum, t) => sum + (t.escrowFee || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Escrow Agent Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-card hover:shadow-card-hover transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Escrows</CardTitle>
            <Shield className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-50">{activeEscrows.length}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Transactions in progress</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-card hover:shadow-card-hover transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Escrows</CardTitle>
            <Check className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-50">{completedEscrows.length}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Successfully completed</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-card hover:shadow-card-hover transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-50">${totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">From completed escrows</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-card hover:shadow-card-hover transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Earnings</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-50">${pendingEarnings.toFixed(2)}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">From active escrows</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900 dark:text-gray-50">Active Escrows</CardTitle>
        </CardHeader>
        <CardContent>
          {activeEscrows.length > 0 ? (
            <div className="space-y-5">
              {activeEscrows.map(escrow => (
                <div key={escrow.id} className="border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:border-primary/30 transition-colors">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-gray-50">{escrow.accountId}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Started: {new Date(escrow.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="md:text-right">
                      <p className="font-bold text-primary">${escrow.amount.toFixed(2)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Fee: ${escrow.escrowFee?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-5">
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Buyer</p>
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarFallback className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                            {escrow.buyerId?.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <p className="font-medium text-gray-900 dark:text-gray-50">{escrow.buyerId}</p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Seller</p>
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarFallback className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            {escrow.sellerId?.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <p className="font-medium text-gray-900 dark:text-gray-50">{escrow.sellerId}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      className="flex-1 bg-green-500 hover:bg-green-600"
                      onClick={() => handleReleaseFunds(escrow.id)}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Release Funds
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="flex-1"
                      onClick={() => handleRefundBuyer(escrow.id)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Refund Buyer
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <Shield className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No active escrows at the moment</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">New transactions will appear here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EscrowHome;
