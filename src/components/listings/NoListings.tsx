
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const NoListings: React.FC = () => {
  return (
    <Card className="text-center p-10">
      <CardContent className="pt-10">
        <h3 className="text-xl font-medium mb-2">No Listings Yet</h3>
        <p className="text-muted-foreground mb-6">
          You haven't created any account listings yet. Start selling by creating your first listing.
        </p>
        <Link to="/dashboard/create-listing">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Your First Listing
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default NoListings;
