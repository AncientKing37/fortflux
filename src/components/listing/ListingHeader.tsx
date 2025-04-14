
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const ListingHeader: React.FC = () => {
  return (
    <Link 
      to="/marketplace" 
      className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
    >
      <ChevronLeft className="h-4 w-4 mr-1" />
      Back to Marketplace
    </Link>
  );
};

export default ListingHeader;
