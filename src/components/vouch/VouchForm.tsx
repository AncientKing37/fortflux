
import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { createVouch } from '@/contexts/socket/socketActions';
import { toast } from 'sonner';

interface VouchFormProps {
  transactionId: string;
  sellerId: string;
  sellerUsername: string;
  onVouchCreated?: () => void;
}

const VouchForm: React.FC<VouchFormProps> = ({ 
  transactionId, 
  sellerId, 
  sellerUsername,
  onVouchCreated 
}) => {
  const { user } = useUser();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await createVouch(user, transactionId, sellerId, rating, comment);
      
      if (success && onVouchCreated) {
        onVouchCreated();
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Rate your experience with {sellerUsername}</h3>
        <p className="text-sm text-muted-foreground">Your feedback helps other buyers make informed decisions</p>
      </div>
      
      <div className="flex justify-center">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="focus:outline-none"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            >
              <Star
                className={`h-8 w-8 ${
                  (hoverRating ? hoverRating >= star : rating >= star)
                    ? 'text-yellow-500 fill-yellow-500'
                    : 'text-gray-300'
                } transition-colors`}
              />
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <Textarea
          placeholder="Share your experience with the seller (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="min-h-[120px]"
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={isSubmitting || rating === 0}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
};

export default VouchForm;
