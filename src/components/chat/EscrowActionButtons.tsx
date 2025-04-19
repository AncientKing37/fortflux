import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, X, Mail, Eye } from 'lucide-react';
import { useSocket } from '@/contexts/SocketContext';
import { Transaction } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface EscrowActionButtonsProps {
  transaction: Transaction;
  isEscrow: boolean;
  buyerId: string;
  sellerId: string;
}

const EscrowActionButtons: React.FC<EscrowActionButtonsProps> = ({ 
  transaction,
  isEscrow,
  buyerId,
  sellerId
}) => {
  const { releaseFunds, refundBuyer, sendReminderToParties } = useSocket();

  if (!isEscrow) return null;

  const handleReleaseFunds = async () => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', transaction.id);

      if (error) throw error;
      
      toast.success('Funds released successfully');
    } catch (error) {
      console.error('Error releasing funds:', error);
      toast.error('Failed to release funds');
    }
  };

  const handleRefundBuyer = async () => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ 
          status: 'refunded',
          refunded_at: new Date().toISOString()
        })
        .eq('id', transaction.id);

      if (error) throw error;
      
      toast.success('Refund processed successfully');
    } catch (error) {
      console.error('Error processing refund:', error);
      toast.error('Failed to process refund');
    }
  };

  const handleSendReminder = async () => {
    try {
      // Send notification to both parties
      await Promise.all([
        supabase.from('notifications').insert({
          user_id: buyerId,
          type: 'escrow_reminder',
          title: 'Transaction Reminder',
          content: `Reminder about your pending transaction #${transaction.id}`,
          transaction_id: transaction.id
        }),
        supabase.from('notifications').insert({
          user_id: sellerId,
          type: 'escrow_reminder',
          title: 'Transaction Reminder',
          content: `Reminder about your pending transaction #${transaction.id}`,
          transaction_id: transaction.id
        })
      ]);
      
      toast.success('Reminder sent to both parties');
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast.error('Failed to send reminder');
    }
  };

  const handleViewListing = () => {
    if (transaction.accountId) {
      window.open(`