
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CheckCircle2, Shield, DollarSign } from 'lucide-react';

const SellAccount: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Sell Your Fortnite Account | EL1TE MARKETPLACE</title>
        <meta name="description" content="Sell your Fortnite account safely and securely. Get the best price for your rare skins and items." />
      </Helmet>
      
      <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Sell Your Fortnite Account</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Turn your gaming investment into real money. Sell your Fortnite account securely with our trusted escrow service.
          </p>
          <div className="mt-8">
            <Link to="/dashboard/create-listing">
              <Button size="lg" className="bg-marketplace-neon hover:bg-marketplace-neon/90 text-white">
                Create Your Listing
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Sell With Us?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <Shield className="h-12 w-12 mx-auto text-marketplace-neon mb-4" />
            <h3 className="text-xl font-bold mb-2">Secure Escrow</h3>
            <p className="text-gray-600">
              Our escrow system protects both buyers and sellers, ensuring safe transactions every time.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <DollarSign className="h-12 w-12 mx-auto text-marketplace-neon mb-4" />
            <h3 className="text-xl font-bold mb-2">Best Market Value</h3>
            <p className="text-gray-600">
              Set your own price and reach buyers willing to pay what your account is truly worth.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <CheckCircle2 className="h-12 w-12 mx-auto text-marketplace-neon mb-4" />
            <h3 className="text-xl font-bold mb-2">Fast & Easy</h3>
            <p className="text-gray-600">
              Create listings in minutes with our user-friendly interface and get paid quickly.
            </p>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-6">How It Works</h2>
          
          <div className="max-w-3xl mx-auto">
            <div className="flex items-start mb-8">
              <div className="flex-shrink-0 bg-marketplace-neon text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">1</div>
              <div className="text-left">
                <h3 className="text-xl font-bold mb-2">Create Your Listing</h3>
                <p className="text-gray-600">Sign up, take screenshots of your account details, and create a detailed listing.</p>
              </div>
            </div>
            
            <div className="flex items-start mb-8">
              <div className="flex-shrink-0 bg-marketplace-neon text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">2</div>
              <div className="text-left">
                <h3 className="text-xl font-bold mb-2">Find a Buyer</h3>
                <p className="text-gray-600">Wait for interested buyers to purchase your account through our secure platform.</p>
              </div>
            </div>
            
            <div className="flex items-start mb-8">
              <div className="flex-shrink-0 bg-marketplace-neon text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">3</div>
              <div className="text-left">
                <h3 className="text-xl font-bold mb-2">Transfer Account</h3>
                <p className="text-gray-600">Use our secure escrow system to safely transfer the account to the buyer.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-marketplace-neon text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">4</div>
              <div className="text-left">
                <h3 className="text-xl font-bold mb-2">Get Paid</h3>
                <p className="text-gray-600">Once the buyer confirms they've received the account, payment is released to you.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <Link to="/dashboard/create-listing">
            <Button size="lg" className="bg-marketplace-neon hover:bg-marketplace-neon/90 text-white">
              Start Selling Today
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SellAccount;
