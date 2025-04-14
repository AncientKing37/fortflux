
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { FortniteAccount } from '@/types';
import { ShoppingCart, Award, Star } from 'lucide-react';

interface AccountCardProps {
  account: FortniteAccount;
  compact?: boolean;
}

const AccountCard: React.FC<AccountCardProps> = ({ account, compact = false }) => {
  // Helper for rarity colors
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-yellow-500';
      case 'epic': return 'bg-purple-500';
      case 'rare': return 'bg-blue-500';
      case 'uncommon': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  // Helper for status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'sold': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (compact) {
    return (
      <Link to={`/marketplace/${account.id}`} className="block">
        <div className="marketplace-card hover:border-marketplace-blue border-2 border-transparent">
          <div className="flex items-center p-4">
            <div className="w-16 h-16 overflow-hidden rounded-md mr-4">
              <img 
                src={account.images[0]} 
                alt={account.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 truncate">{account.title}</h3>
              <div className="flex items-center justify-between mt-1">
                <Badge variant="outline" className="capitalize">{account.rarity}</Badge>
                <p className="font-bold text-marketplace-blue">${account.price.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="marketplace-card h-full flex flex-col hover:border-marketplace-blue border-2 border-transparent">
      <div className="relative">
        <img 
          src={account.images[0]} 
          alt={account.title} 
          className="w-full h-48 object-cover"
        />
        {account.featured && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-marketplace-blue text-white flex items-center gap-1">
              <Star className="h-3 w-3" /> Featured
            </Badge>
          </div>
        )}
        <Badge 
          className={`absolute top-2 right-2 capitalize ${getRarityColor(account.rarity)} text-white`}
        >
          {account.rarity}
        </Badge>
        <Badge 
          variant="outline"
          className={`absolute bottom-2 right-2 capitalize ${getStatusColor(account.status)}`}
        >
          {account.status}
        </Badge>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">{account.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{account.description}</p>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-gray-100 p-2 rounded text-center">
            <p className="text-xs text-gray-600">Skins</p>
            <p className="font-bold">{account.skins}+</p>
          </div>
          <div className="bg-gray-100 p-2 rounded text-center">
            <p className="text-xs text-gray-600">V-Bucks</p>
            <p className="font-bold">{account.vBucks}</p>
          </div>
          <div className="bg-gray-100 p-2 rounded text-center">
            <p className="text-xs text-gray-600">Battle Pass</p>
            <p className="font-bold">{account.battlePass ? 'Yes' : 'No'}</p>
          </div>
          <div className="bg-gray-100 p-2 rounded text-center">
            <p className="text-xs text-gray-600">Level</p>
            <p className="font-bold">{account.level}</p>
          </div>
        </div>
        
        <div className="mt-auto flex items-center justify-between">
          <p className="text-2xl font-bold text-marketplace-blue">${account.price.toFixed(2)}</p>
          <Link 
            to={`/marketplace/${account.id}`}
            className="bg-marketplace-blue hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center gap-1 transition-colors"
          >
            <ShoppingCart className="h-4 w-4" /> View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccountCard;
