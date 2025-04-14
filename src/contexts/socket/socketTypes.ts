
import { Socket } from 'socket.io-client';

// Define socket event types
export type SocketEventType = 
  | 'join_room' 
  | 'leave_room' 
  | 'request_escrow' 
  | 'release_funds' 
  | 'refund_buyer' 
  | 'funds_released' 
  | 'buyer_refunded' 
  | 'send_message'
  | 'send_reminder'
  | 'support_message'
  | 'support_typing'
  | 'check_support_availability'
  | 'set_support_availability'
  | 'close_support_chat'
  | 'create_vouch';

// Socket context interface
export interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  requestEscrow: (transactionId: string, listingId: string, sellerUsername: string) => Promise<boolean>;
  releaseFunds: (transactionId: string) => Promise<boolean>;
  refundBuyer: (transactionId: string) => Promise<boolean>;
  sendReminderToParties: (transactionId: string, buyerId: string, sellerId: string) => Promise<boolean>;
  sendSupportMessage: (message: string, roomId: string) => Promise<boolean>;
  sendSupportTypingIndicator: (isTyping: boolean, roomId: string) => void;
  checkSupportAvailability: () => void;
}

// User type for socket functions
export interface SocketUser {
  id: string;
  username: string;
}
