
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import AccountCard from '@/components/AccountCard';
import { supabase } from '@/integrations/supabase/client';
import { User, FortniteAccount, SupabaseVouch } from '@/types';
import { Star, MessageSquare, ShoppingBag, Calendar, AlertTriangle } from 'lucide-react';
import { mockAccounts } from '@/data/mockData';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SellerRankBadge from '@/components/seller/SellerRankBadge';
import VouchDisplay from '@/components/vouch/VouchDisplay';

const SellerProfile = () => {
  const { username } = useParams<{ username: string }>();
  const [seller, setSeller] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<FortniteAccount[]>([]);
  const [vouches, setVouches] = useState<SupabaseVouch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSellerProfile = async () => {
      try {
        // Fetch seller profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .eq('role', 'seller')
          .single();
          
        if (profileError) {
          throw new Error('Seller not found');
        }
        
        if (!profileData) {
          throw new Error('Seller not found');
        }
        
        // Transform to User type
        const sellerData: User = {
          id: profileData.id,
          username: profileData.username,
          email: '', // We don't expose email publicly
          role: 'seller',
          avatar: profileData.avatar_url,
          createdAt: new Date(profileData.created_at),
          vouchCount: profileData.vouch_count || 0,
          balance: 0, // We don't expose balance publicly
          description: profileData.description || ''
        };
        
        setSeller(sellerData);
        
        // Fetch accounts
        const { data: accountsData, error: accountsError } = await supabase
          .from('fortnite_accounts')
          .select('*')
          .eq('seller_id', profileData.id)
          .eq('status', 'available');
          
        if (!accountsError && accountsData) {
          // Transform to our FortniteAccount type
          setAccounts(accountsData.map(account => ({
            id: account.id,
            sellerId: account.seller_id,
            title: account.title,
            description: account.description || '',
            price: account.price,
            images: account.images || [],
            rarity: account.rarity as any || 'common',
            skins: account.skins || 0,
            vBucks: account.v_bucks || 0,
            battlePass: account.battle_pass || false,
            level: account.level || 0,
            featured: account.featured || false,
            status: account.status as any || 'available',
            createdAt: new Date(account.created_at)
          })));
        } else {
          // Fallback to mock data if error
          setAccounts(mockAccounts.filter(a => a.sellerId === sellerData.id && a.status === 'available'));
        }
        
        // Fetch vouches
        const { data: vouchesData, error: vouchesError } = await supabase
          .from('vouches')
          .select('*')
          .eq('to_user_id', profileData.id);
          
        if (!vouchesError && vouchesData) {
          setVouches(vouchesData);
        }
        
      } catch (err: any) {
        console.error('Error fetching seller profile:', err);
        setError(err.message || 'Failed to load seller profile');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSellerProfile();
  }, [username]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading seller profile...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !seller) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center max-w-md p-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Seller Not Found</h2>
            <p className="text-gray-500 mb-6">
              {error || "The seller profile you're looking for doesn't exist or has been removed."}
            </p>
            <Button asChild>
              <Link to="/marketplace">Browse Marketplace</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Calculate the average rating from vouches
  const averageRating = vouches.length > 0
    ? vouches.reduce((sum, v) => sum + v.rating, 0) / vouches.length
    : 0;

  // Transform Supabase vouches to our Vouch type for the VouchDisplay component
  const formattedVouches = vouches.map(v => ({
    id: v.id,
    fromUserId: v.from_user_id,
    toUserId: v.to_user_id,
    transactionId: v.transaction_id,
    rating: v.rating,
    comment: v.comment || '',
    createdAt: new Date(v.created_at)
  }));

  return (
    <>
      <Navbar />
      <div className="container py-8">
        <div className="max-w-6xl mx-auto">
          {/* Seller profile header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-white/30">
                <AvatarImage src={seller.avatar} alt={seller.username} />
                <AvatarFallback className="text-3xl bg-white/20">
                  {seller.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{seller.username}</h1>
                  {seller.vouchCount > 0 && (
                    <SellerRankBadge dealCount={seller.vouchCount} />
                  )}
                </div>
                
                <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-3">
                  <div className="flex items-center bg-white/20 px-3 py-1 rounded-full text-sm">
                    <Star className="w-4 h-4 mr-1" />
                    <span>{averageRating.toFixed(1)} ({seller.vouchCount} vouches)</span>
                  </div>
                  
                  <div className="flex items-center bg-white/20 px-3 py-1 rounded-full text-sm">
                    <ShoppingBag className="w-4 h-4 mr-1" />
                    <span>{accounts.length} listings</span>
                  </div>
                  
                  <div className="flex items-center bg-white/20 px-3 py-1 rounded-full text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Joined {seller.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>
                
                <p className="line-clamp-2 md:line-clamp-none">
                  {seller.description || "This seller hasn't added a description yet."}
                </p>
              </div>
              
              <Button className="bg-white text-indigo-600 hover:bg-white/90 hover:text-indigo-700">
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Seller
              </Button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Seller accounts */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Fortnite Accounts ({accounts.length})</CardTitle>
                  <CardDescription>Accounts currently listed by this seller</CardDescription>
                </CardHeader>
                <CardContent>
                  {accounts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {accounts.map(account => (
                        <AccountCard key={account.id} account={account} compact />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">This seller has no listings right now</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Reviews and ratings */}
            <div>
              <VouchDisplay vouches={formattedVouches} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SellerProfile;
