import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Purchase {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled' | 'disputed';
  created_at: string;
  updated_at: string;
  listing: {
    title: string;
    price: number;
    seller: {
      username: string;
    };
  };
}

const PurchasePanel: React.FC = () => {
  const { user } = useUser();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchPurchases();
      // Set up real-time subscription
      const subscription = supabase
        .channel('purchases')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'purchases',
            filter: `buyer_id=eq.${user.id}`
          }, 
          (payload) => {
            console.log('Purchase update:', payload);
            fetchPurchases(); // Refresh purchases on any change
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('purchases')
        .select(`
          *,
          listing:listings (
            title,
            price,
            seller:users (
              username
            )
          )
        `)
        .eq('buyer_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPurchases(data || []);
    } catch (err) {
      console.error('Error fetching purchases:', err);
      setError('Failed to load purchases');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: Purchase['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'disputed':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status: Purchase['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'disputed':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {purchases.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No purchases found</p>
        </div>
      ) : (
        purchases.map((purchase) => (
          <div
            key={purchase.id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{purchase.listing.title}</h3>
                <p className="text-sm text-gray-500">
                  Seller: {purchase.listing.seller.username}
                </p>
                <p className="text-sm text-gray-500">
                  Amount: ${purchase.amount.toFixed(2)}
                </p>
                <p className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(purchase.created_at), { addSuffix: true })}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(purchase.status)}
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(purchase.status)}`}>
                  {purchase.status}
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PurchasePanel; 