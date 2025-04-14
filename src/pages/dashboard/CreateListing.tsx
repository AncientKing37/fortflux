
import React from 'react';
import ListingForm from '@/components/listings/ListingForm';

const CreateListing: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Fortnite Account Listing</h1>
      <ListingForm />
    </div>
  );
};

export default CreateListing;
