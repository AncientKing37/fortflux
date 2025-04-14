
import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';

interface FavoriteButtonProps {
  listingId: string;
  variant?: 'outline' | 'ghost' | 'default' | 'link';
  className?: string;
  showText?: boolean;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  listingId, 
  variant = 'outline',
  className = '',
  showText = true
}) => {
  const { user } = useUser();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkIfFavorite();
    }
  }, [user, listingId]);

  const checkIfFavorite = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('profiles')
        .select('favorite_listings')
        .eq('id', user.id)
        .single();
        
      if (data?.favorite_listings) {
        setIsFavorite(data.favorite_listings.includes(listingId));
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast.error('You need to be logged in to save favorites');
      return;
    }

    setIsLoading(true);
    
    try {
      // Get current favorites
      const { data } = await supabase
        .from('profiles')
        .select('favorite_listings')
        .eq('id', user.id)
        .single();
      
      let favorites = data?.favorite_listings || [];
      
      // Toggle favorite
      if (isFavorite) {
        favorites = favorites.filter(id => id !== listingId);
        toast.success('Removed from favorites');
      } else {
        favorites = [...favorites, listingId];
        toast.success('Added to favorites');
      }
      
      // Update in database
      await supabase
        .from('profiles')
        .update({ favorite_listings: favorites })
        .eq('id', user.id);
      
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Button
      variant={variant}
      size="sm"
      className={`gap-2 ${className}`}
      onClick={toggleFavorite}
      disabled={isLoading}
    >
      <Heart 
        className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} 
      />
      {showText && (isFavorite ? 'Saved' : 'Save to Favorites')}
    </Button>
  );
};

export default FavoriteButton;
