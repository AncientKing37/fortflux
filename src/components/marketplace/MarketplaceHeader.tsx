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
    <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-black text-white py-16 px-4 relative overflow-hidden">
      <div className="container mx-auto text-center relative z-10">
        <h1 className="text-4xl font-bold mb-4 text-black">Fortnite Accounts Marketplace</h1>
        <p className="text-lg mb-8 max-w-3xl mx-auto text-gray-900 font-medium">
          Secure and verified Fortnite accounts with rare skins, battle passes, and more.
        </p>
        
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
          <Input
            type="search"
            placeholder="Search accounts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 py-6 bg-white text-gray-900 rounded-lg border-2 border-yellow-400 focus:border-yellow-500 focus:ring-yellow-500 shadow-lg"
          />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
    </div>
  );
};

export default MarketplaceHeader;
