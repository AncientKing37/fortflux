
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Shield, Star, DollarSign, BadgeCheck, Loader2 } from 'lucide-react';

const BecomeASeller: React.FC = () => {
  const { user, becomeASeller } = useUser();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // If the user is already a seller, redirect to the dashboard
  if (user?.role === 'seller') {
    navigate('/dashboard');
    return null;
  }

  const handleBecomeASeller = async () => {
    setIsLoading(true);
    try {
      const success = await becomeASeller();
      if (success) {
        navigate('/dashboard/profile');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Become a Seller</h1>
      
      <Card className="mb-6 border-2 border-primary/10">
        <CardHeader>
          <CardTitle>Join Our Seller Community</CardTitle>
          <CardDescription>
            Start selling your Fortnite accounts on our marketplace and earn money
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <p className="text-lg">
              As a seller on our platform, you'll gain access to:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <div className="bg-primary/10 p-2 rounded-full">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Earn Money</h3>
                  <p className="text-sm text-muted-foreground">Sell your accounts and get paid directly to your wallet</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Secure Transactions</h3>
                  <p className="text-sm text-muted-foreground">Our escrow system protects both buyers and sellers</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Star className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Build Reputation</h3>
                  <p className="text-sm text-muted-foreground">Earn vouches and become a trusted seller in the community</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <div className="bg-primary/10 p-2 rounded-full">
                  <BadgeCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Verified Profile</h3>
                  <p className="text-sm text-muted-foreground">Get a verified seller badge and stand out from others</p>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <h3 className="font-medium text-yellow-800 mb-2">Seller Guidelines</h3>
              <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                <li>List only accounts that you legally own</li>
                <li>Provide accurate information about your accounts</li>
                <li>Respond to buyer inquiries promptly</li>
                <li>Transfer account details only after escrow confirmation</li>
                <li>Maintain a professional attitude with buyers</li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full"
            size="lg"
            onClick={handleBecomeASeller}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing
              </>
            ) : (
              'Become a Seller Now'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BecomeASeller;
