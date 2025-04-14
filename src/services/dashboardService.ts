
import { supabase } from '@/integrations/supabase/client';
import { User, FortniteAccount, Listing, Transaction, Vouch, SupabaseTransaction, SupabaseTransactionWithRelations } from '@/types';

export const dashboardService = {
  // User-related queries
  async getUserProfile(userId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      if (!data) return null;
      
      return {
        id: data.id,
        username: data.username,
        email: '', // Email is not stored in profiles table
        role: data.role as any,
        avatar: data.avatar_url,
        createdAt: new Date(data.created_at),
        vouchCount: data.vouch_count || 0,
        balance: data.balance || 0,
        description: data.description,
        wallet_address: data.wallet_address,
        ltc_wallet_address: data.ltc_wallet_address,
        preferred_crypto: data.preferred_crypto
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  },

  // Listing-related queries
  async getUserListings(userId: string): Promise<FortniteAccount[]> {
    try {
      const { data, error } = await supabase
        .from('fortnite_accounts')
        .select('*')
        .eq('seller_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(item => ({
        id: item.id,
        sellerId: item.seller_id,
        title: item.title,
        description: item.description || '',
        price: item.price,
        images: item.images || [],
        rarity: item.rarity as any || 'common',
        skins: item.skins || 0,
        vBucks: item.v_bucks || 0,
        battlePass: item.battle_pass || false,
        level: item.level || 0,
        featured: item.featured || false,
        status: item.status as any || 'available',
        createdAt: new Date(item.created_at)
      }));
    } catch (error) {
      console.error('Error fetching user listings:', error);
      return [];
    }
  },

  // Transaction-related queries
  async getUserTransactions(userId: string, role: string): Promise<Transaction[]> {
    try {
      let query = supabase
        .from('transactions')
        .select(`
          *,
          account:account_id(title),
          seller:seller_id(username, avatar_url, role, vouch_count),
          escrow:escrow_id(username, avatar_url, role, vouch_count)
        `);

      // Filter based on user role
      if (role === 'buyer') {
        query = query.eq('buyer_id', userId);
      } else if (role === 'seller') {
        query = query.eq('seller_id', userId);
      } else if (role === 'escrow') {
        query = query.eq('escrow_id', userId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      return (data as SupabaseTransactionWithRelations[] || []).map(item => ({
        id: item.id,
        accountId: item.account_id,
        sellerId: item.seller_id,
        buyerId: item.buyer_id,
        escrowId: item.escrow_id,
        amount: item.amount,
        status: item.status as any,
        cryptoType: item.crypto_type || '',
        cryptoAmount: item.crypto_amount || 0,
        escrowFee: item.escrow_fee || 0,
        platformFee: item.platform_fee || 0,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at)
      }));
    } catch (error) {
      console.error('Error fetching user transactions:', error);
      return [];
    }
  },

  // Vouch-related queries
  async getUserVouches(userId: string): Promise<Vouch[]> {
    try {
      const { data, error } = await supabase
        .from('vouches')
        .select('*')
        .eq('to_user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(item => ({
        id: item.id,
        fromUserId: item.from_user_id,
        toUserId: item.to_user_id,
        transactionId: item.transaction_id,
        rating: item.rating,
        comment: item.comment || '',
        createdAt: new Date(item.created_at)
      }));
    } catch (error) {
      console.error('Error fetching user vouches:', error);
      return [];
    }
  },

  // Admin dashboard analytics
  async getDashboardAnalytics() {
    try {
      // Total users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('role', { count: 'exact' });

      // Total listings
      const { data: listingsData, error: listingsError } = await supabase
        .from('fortnite_accounts')
        .select('status', { count: 'exact' });

      // Total transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('status, amount', { count: 'exact' });

      if (usersError || listingsError || transactionsError) {
        throw new Error('Error fetching dashboard analytics');
      }

      // Process users by role
      const usersByRole = usersData?.reduce((acc: Record<string, number>, curr) => {
        acc[curr.role] = (acc[curr.role] || 0) + 1;
        return acc;
      }, {}) || {};

      // Process listings by status
      const listingsByStatus = listingsData?.reduce((acc: Record<string, number>, curr) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1;
        return acc;
      }, {}) || {};

      // Process transactions
      const transactionStats = transactionsData?.reduce((acc: {
        totalValue: number;
        byStatus: Record<string, number>;
      }, curr) => {
        acc.totalValue += curr.amount || 0;
        acc.byStatus[curr.status] = (acc.byStatus[curr.status] || 0) + 1;
        return acc;
      }, { totalValue: 0, byStatus: {} }) || { totalValue: 0, byStatus: {} };

      return {
        users: {
          total: usersData?.length || 0,
          byRole: usersByRole
        },
        listings: {
          total: listingsData?.length || 0,
          byStatus: listingsByStatus
        },
        transactions: {
          total: transactionsData?.length || 0,
          totalValue: transactionStats.totalValue,
          byStatus: transactionStats.byStatus
        }
      };
    } catch (error) {
      console.error('Error fetching dashboard analytics:', error);
      return null;
    }
  },

  // User management for admin/support
  async getAllUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(item => ({
        id: item.id,
        username: item.username,
        email: '', // Email is not stored in profiles table
        role: item.role as any,
        avatar: item.avatar_url,
        createdAt: new Date(item.created_at),
        vouchCount: item.vouch_count || 0,
        balance: item.balance || 0,
        description: item.description
      }));
    } catch (error) {
      console.error('Error fetching all users:', error);
      return [];
    }
  },

  // Support dashboard queries
  async getSupportCases(): Promise<any[]> {
    try {
      // This could be a dedicated table in the future
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          buyer:buyer_id(username),
          seller:seller_id(username)
        `)
        .eq('status', 'disputed')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching support cases:', error);
      return [];
    }
  }
};
