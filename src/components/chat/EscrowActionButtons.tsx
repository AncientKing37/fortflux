
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, X, Mail, Eye } from 'lucide-react';
import { useSocket } from '@/contexts/SocketContext';
import { Transaction } from '@/types';
import { toast } from 'sonner';

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
    if (transaction.status !== 'in_escrow') {
      toast.error('Transaction is not in escrow status');
      return;
    }
    await releaseFunds(transaction.id);
  };

  const handleRefundBuyer = async () => {
    if (transaction.status !== 'in_escrow') {
      toast.error('Transaction is not in escrow status');
      return;
    }
    await refundBuyer(transaction.id);
  };

  const handleSendReminder = async () => {
    await sendReminderToParties(transaction.id, buyerId, sellerId);
  };

  const handleViewListing = () => {
    if (transaction.accountId) {
      window.open(`/listing/${transaction.accountId}`, '_blank');
    } else {
      toast.error('Listing ID not available');
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-2 escrow-actions">
      <Button 
        size="sm" 
        className="bg-green-500 hover:bg-green-600"
        onClick={handleReleaseFunds}
        disabled={transaction.status !== 'in_escrow'}
      >
        <ArrowRight className="h-4 w-4 mr-1" />
        Release Funds
      </Button>
      
      <Button 
        size="sm" 
        variant="destructive"
        onClick={handleRefundBuyer}
        disabled={transaction.status !== 'in_escrow'}
      >
        <X className="h-4 w-4 mr-1" />
        Cancel & Refund
      </Button>
      
      <Button 
        size="sm" 
        variant="outline"
        onClick={handleSendReminder}
      >
        <Mail className="h-4 w-4 mr-1" />
        Send Reminder
      </Button>
      
      <Button 
        size="sm" 
        variant="outline"
        onClick={handleViewListing}
      >
        <Eye className="h-4 w-4 mr-1" />
        View Listing
      </Button>
    </div>
  );
};

export default EscrowActionButtons;
