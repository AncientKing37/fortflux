
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface RejectionDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  rejectionReason: string;
  setRejectionReason: (reason: string) => void;
  handleRejectListing: () => void;
}

const RejectionDialog: React.FC<RejectionDialogProps> = ({
  open,
  setOpen,
  rejectionReason,
  setRejectionReason,
  handleRejectListing
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Listing</DialogTitle>
          <DialogDescription>
            Provide a reason for rejecting this listing. This will be sent to the seller.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label htmlFor="rejection-reason" className="text-sm font-medium">
              Rejection Reason
            </label>
            <Textarea 
              id="rejection-reason"
              placeholder="Enter the reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive"
            onClick={handleRejectListing}
            disabled={!rejectionReason.trim()}
          >
            Reject Listing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectionDialog;
