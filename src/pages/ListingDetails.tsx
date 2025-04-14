
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ListingHeader from '@/components/listing/ListingHeader';
import ListingImageGallery from '@/components/listing/ListingImageGallery';
import ListingDescription from '@/components/listing/ListingDescription';
import PurchasePanel from '@/components/listing/PurchasePanel';
import SellerInfoPanel from '@/components/listing/SellerInfoPanel';
import FavoriteButton from '@/components/listing/FavoriteButton';
import { Helmet } from 'react-helmet-async';

interface Listing {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  status: string;
  created_at: string;
  rarity?: string;
  skins?: number;
  v_bucks?: number;
  battle_pass?: boolean;
  level?: number;
}

interface SellerProfile {
  id: string;
  username: string;
  avatar_url: string | null;
  vouch_count: number;
  role: string;
}

const ListingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchListing(id);
      if (user) {
        checkExistingTransaction(id);
      }
    }
  }, [id, user]);

  const fetchListing = async (listingId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('fortnite_accounts')
        .select('*')
        .eq('id', listingId)
        .single();
        
      if (error) {
        throw error;
      }
      
      if (data) {
        setListing(data as Listing);
        await fetchSellerProfile(data.seller_id);
      }
    } catch (error: any) {
      console.error('Error fetching listing:', error);
      toast.error('Failed to load listing details');
    } finally {
      setLoading(false);
    }
  };

  const fetchSellerProfile = async (sellerId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, vouch_count, role')
        .eq('id', sellerId)
        .single();
        
      if (error) {
        throw error;
      }
      
      if (data) {
        setSeller(data);
      }
    } catch (error: any) {
      console.error('Error fetching seller profile:', error);
    }
  };

  const checkExistingTransaction = async (accountId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('id, status')
        .eq('account_id', accountId)
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking transactions:', error);
        return;
      }

      if (data) {
        setTransaction(data.id);
      }
    } catch (error) {
      console.error('Error in checkExistingTransaction:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Helmet>
          <title>Listing Not Found | Fortnite Marketplace</title>
          <meta name="description" content="The requested Fortnite account listing was not found." />
        </Helmet>
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Listing Not Found</h2>
          <p className="mb-6">The listing you're looking for doesn't exist or has been sold.</p>
          <Button asChild>
            <Link to="/marketplace">
              Back to Marketplace
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Helmet>
        <title>{listing.title} | Fortnite Marketplace</title>
        <meta name="description" content={`${listing.title} - ${listing.description?.substring(0, 160)}`} />
        <meta property="og:title" content={`${listing.title} | Fortnite Marketplace`} />
        <meta property="og:description" content={listing.description?.substring(0, 160)} />
        {listing.images && listing.images.length > 0 && (
          <meta property="og:image" content={listing.images[0]} />
        )}
      </Helmet>
      
      <ListingHeader />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 mb-2">{listing.title}</h1>
            <FavoriteButton listingId={listing.id} className="mt-2" />
          </div>
          
          <ListingImageGallery 
            images={listing.images} 
            title={listing.title} 
          />
          
          <ListingDescription 
            description={listing.description} 
            createdAt={listing.created_at} 
          />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            {listing.rarity && (
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Rarity</p>
                <p className="font-semibold capitalize">{listing.rarity}</p>
              </div>
            )}
            {typeof listing.skins === 'number' && (
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Skins</p>
                <p className="font-semibold">{listing.skins}+</p>
              </div>
            )}
            {typeof listing.v_bucks === 'number' && (
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">V-Bucks</p>
                <p className="font-semibold">{listing.v_bucks}</p>
              </div>
            )}
            {typeof listing.level === 'number' && (
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Level</p>
                <p className="font-semibold">{listing.level}</p>
              </div>
            )}
            {typeof listing.battle_pass === 'boolean' && (
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Battle Pass</p>
                <p className="font-semibold">{listing.battle_pass ? 'Yes' : 'No'}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          <PurchasePanel 
            transaction={transaction}
            listing={listing}
            sellerUsername={seller?.username || ''}
          />
          
          <SellerInfoPanel seller={seller} />
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
