
import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import PurchaseItem from '@/components/purchases/PurchaseItem';
import EmptyPurchases from '@/components/purchases/EmptyPurchases';
import { SupabaseTransactionWithRelations } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

const Purchases: React.FC = () => {
  const { user } = useUser();
  
  const { data: transactions, isLoading, refetch } = useQuery({
    queryKey: ['purchases', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          account:account_id(title),
          seller:seller_id(username, avatar_url, role, vouch_count),
          escrow:escrow_id(username, avatar_url, role, vouch_count)
        `)
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return (data as unknown) as SupabaseTransactionWithRelations[] || [];
    },
    enabled: !!user
  });

  const { data: vouches } = useQuery({
    queryKey: ['vouches', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('vouches')
        .select('*')
        .eq('from_user_id', user.id);
        
      if (error) throw error;
      
      return data || [];
    },
    enabled: !!user
  });
  
  const hasVouch = (transactionId: string) => {
    return vouches?.some(vouch => vouch.transaction_id === transactionId);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-50">Purchase History</h2>
        
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="w-full h-48 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-50">Purchase History</h2>
      
      {transactions && transactions.length > 0 ? (
        <div className="space-y-6">
          {transactions.map(transaction => (
            <PurchaseItem 
              key={transaction.id}
              transaction={transaction}
              hasVouch={hasVouch(transaction.id)}
              onRelease={refetch}
              onVouchCreated={refetch}
            />
          ))}
        </div>
      ) : (
        <EmptyPurchases />
      )}
    </div>
  );
};

export default Purchases;
