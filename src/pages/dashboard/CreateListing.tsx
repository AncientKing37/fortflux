import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import ListingForm from '@/components/listings/ListingForm';

const CreateListing: React.FC = () => {
  const { type } = useParams();

  if (!type || (type !== 'sell' && type !== 'trade')) {
    return <Navigate to="/dashboard/create-listing" replace />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {type === 'sell' ? 'Sell Your Account' : 'Trade Your Account'}
      </h1>
      <ListingForm listingType={type} />
    </div>
  );
};

export default CreateListing;
