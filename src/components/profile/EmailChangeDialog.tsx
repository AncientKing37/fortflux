import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface EmailChangeDialogProps {
  currentEmail: string;
}

const EmailChangeDialog: React.FC<EmailChangeDialogProps> = ({ currentEmail }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);

  const handleSendVerification = async () => {
    if (!newEmail) {
      toast.error('Please enter a new email address');
      return;
    }

    if (newEmail === currentEmail) {
      toast.error('New email must be different from current email');
      return;
    }

    setLoading(true);
    try {
      // Send verification code to current email
      const { data, error } = await supabase.functions.invoke('send-email-change-code', {
        body: {
          currentEmail,
          newEmail
        }
      });

      if (error) throw error;

      setShowVerification(true);
      toast.success('Verification code sent! Please check your current email.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send verification code');
      setShowVerification(false);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!verificationCode) {
      toast.error('Please enter the verification code');
      return;
    }

    if (verificationCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    try {
      // Verify code and update email
      const { data, error } = await supabase.functions.invoke('verify-email-change', {
        body: {
          currentEmail,
          newEmail,
          code: verificationCode
        }
      });

      if (error) throw error;

      toast.success('Email changed successfully!');
      setIsOpen(false);
      // Reset the form
      setNewEmail('');
      setVerificationCode('');
      setShowVerification(false);
      
      // Refresh the page after a short delay to update the UI
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || 'Failed to verify code');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setNewEmail('');
    setVerificationCode('');
    setShowVerification(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Change Email
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Email Address</DialogTitle>
          <DialogDescription>
            {!showVerification
              ? "Enter your new email address. We will send a verification code to your current email."
              : "Enter the verification code sent to your current email address."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!showVerification ? (
            <div className="space-y-2">
              <Label htmlFor="current-email">Current Email</Label>
              <Input
                id="current-email"
                value={currentEmail}
                disabled
                className="bg-gray-50 dark:bg-gray-800/50"
              />
              
              <Label htmlFor="new-email">New Email</Label>
              <Input
                id="new-email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter new email address"
                disabled={loading}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="verification-code">Verification Code</Label>
              <Input
                id="verification-code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit code"
                maxLength={6}
                disabled={loading}
              />
              <p className="text-sm text-muted-foreground">
                Please check your current email ({currentEmail}) for the 6-digit verification code
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={!showVerification ? handleSendVerification : handleVerifyEmail}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {!showVerification ? "Sending..." : "Verifying..."}
              </>
            ) : (
              !showVerification ? "Send Verification" : "Verify Email"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailChangeDialog; 