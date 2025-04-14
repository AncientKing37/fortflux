
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Vouch } from '@/types';

interface VouchDisplayProps {
  vouches: Vouch[];
}

const VouchDisplay: React.FC<VouchDisplayProps> = ({ vouches }) => {
  if (vouches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Reviews Yet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Star className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p className="text-gray-500">This seller has not received any reviews yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate average rating
  const averageRating = vouches.reduce((sum, vouch) => sum + vouch.rating, 0) / vouches.length;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Reviews ({vouches.length})</CardTitle>
        <div className="flex items-center">
          <div className="flex items-center mr-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={`w-4 h-4 ${
                  star <= Math.round(averageRating) 
                    ? 'text-yellow-500 fill-yellow-500' 
                    : 'text-gray-300'
                }`} 
              />
            ))}
          </div>
          <span className="font-medium">{averageRating.toFixed(1)}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {vouches.map((vouch) => (
            <div key={vouch.id} className="border-b pb-4 last:border-b-0 last:pb-0">
              <div className="flex justify-between mb-1">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="font-medium">Buyer</div>
                </div>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-4 h-4 ${
                        star <= vouch.rating 
                          ? 'text-yellow-500 fill-yellow-500' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-500 text-sm">
                {new Date(vouch.createdAt).toLocaleDateString()}
              </p>
              {vouch.comment && <p className="mt-2">{vouch.comment}</p>}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default VouchDisplay;
