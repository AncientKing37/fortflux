import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface VouchFormProps {
  userId: string;
  onVouchSubmitted?: () => void;
}

const VouchForm: React.FC<VouchFormProps> = ({ userId, onVouchSubmitted }) => {
  const { user } = useUser();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
      toast.error('You must be logged in to vouch for someone');
      return;
    }

    if (!message.trim()) {
      toast.error('Please enter a vouch message');
      return;
    }

    try {
      setIsSubmitting(true);

      // Create the vouch record
      const { error } = await supabase
        .from('vouches')
        .insert({
          from_user_id: user.id,
          to_user_id: userId,
          message: message.trim(),
        });

      if (error) throw error;

      toast.success('Vouch submitted successfully!');
      setMessage('');
      onVouchSubmitted?.();

    } catch (error) {
      console.error('Error submitting vouch:', error);
      toast.error('Failed to submit vouch');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Vouch</CardTitle>
        <CardDescription>Share your experience with this user</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Write your vouch message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[100px]"
        />
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={isSubmitting || !message.trim() || !user}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Vouch'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VouchForm;
