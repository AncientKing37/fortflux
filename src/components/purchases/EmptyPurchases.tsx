
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const EmptyPurchases: React.FC = () => {
  return (
    <Card className="text-center p-10">
      <CardContent className="pt-10">
        <h3 className="text-xl font-medium mb-2">No Purchase History</h3>
        <p className="text-muted-foreground mb-6">
          You haven't purchased any Fortnite accounts yet.
        </p>
        <Link to="/marketplace">
          <Button>Browse Marketplace</Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default EmptyPurchases;
