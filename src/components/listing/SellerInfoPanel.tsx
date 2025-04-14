
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';

interface SellerInfoPanelProps {
  seller: {
    id: string;
    username: string;
    avatar_url?: string | null;
    vouch_count: number;
  } | null;
}

const SellerInfoPanel: React.FC<SellerInfoPanelProps> = ({ seller }) => {
  if (!seller) return null;

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">Seller Information</h2>
        <div className="flex items-center">
          <Avatar className="h-12 w-12">
            <AvatarImage src={seller.avatar_url || undefined} />
            <AvatarFallback>
              {seller.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="font-medium">{seller.username}</p>
            <div className="flex items-center text-sm text-gray-500">
              <User className="h-3 w-3 mr-1" />
              <span>{seller.vouch_count} vouches</span>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Button variant="outline" asChild className="w-full">
            <Link to={`/seller/${seller.username}`}>
              View Seller Profile
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SellerInfoPanel;
