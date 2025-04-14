
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface MarketplaceHeaderProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const MarketplaceHeader: React.FC<MarketplaceHeaderProps> = ({
  searchTerm,
  setSearchTerm
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Fortnite Accounts Marketplace</h1>
        <p className="text-lg mb-8 max-w-3xl mx-auto">
          Secure and verified Fortnite accounts with rare skins, battle passes, and more.
        </p>
        
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Search accounts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 py-6 bg-white text-gray-900 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default MarketplaceHeader;
