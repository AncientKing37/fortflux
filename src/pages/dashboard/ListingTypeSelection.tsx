import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, RefreshCcw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ListingTypeSelection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<'sell' | 'trade' | null>(null);

  const handleContinue = () => {
    if (selectedType) {
      navigate(`/dashboard/create-listing/${selectedType}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Create New Listing</h1>
      <p className="text-gray-600 mb-8">Choose how you want to list your Fortnite account</p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Sell Account Option */}
        <div 
          onClick={() => setSelectedType('sell')}
          className={`cursor-pointer bg-white rounded-lg p-6 transition-all ${
            selectedType === 'sell' 
              ? 'border-2 border-yellow-500 bg-yellow-50/50' 
              : 'border border-gray-200 hover:border-yellow-500 hover:bg-yellow-50/50'
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-semibold">Sell Account</h2>
          </div>
          <p className="text-gray-600 mb-6">List your account for sale</p>
          
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Set your own price</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Secure payment through escrow</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Instant payment upon sale</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Listed in marketplace</span>
            </li>
          </ul>
        </div>

        {/* Trade Account Option */}
        <div 
          onClick={() => setSelectedType('trade')}
          className={`cursor-pointer bg-white rounded-lg p-6 transition-all ${
            selectedType === 'trade' 
              ? 'border-2 border-yellow-500 bg-yellow-50/50' 
              : 'border border-gray-200 hover:border-yellow-500 hover:bg-yellow-50/50'
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <RefreshCcw className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-semibold">Trade Account</h2>
          </div>
          <p className="text-gray-600 mb-6">List your account for trading</p>
          
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Specify trade preferences</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Secure trading through escrow</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Trade verification system</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Listed in trade section</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleContinue}
          disabled={!selectedType}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-2 rounded-lg font-medium"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default ListingTypeSelection; 