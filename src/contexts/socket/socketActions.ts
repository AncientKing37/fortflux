
import { Socket } from 'socket.io-client';
import { SocketUser } from './socketTypes';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export const joinRoom = (socket: Socket | null, connected: boolean, roomId: string) => {
  if (socket && connected && roomId) {
    socket.emit('join_room', { roomId });
    console.log(`Joined room: ${roomId}`);
  }
};

export const leaveRoom = (socket: Socket | null, connected: boolean, roomId: string) => {
  if (socket && connected && roomId) {
    socket.emit('leave_room', { roomId });
    console.log(`Left room: ${roomId}`);
  }
};

export const requestEscrow = async (
  socket: Socket | null, 
  connected: boolean, 
  user: User | null, 
  transactionId: string, 
  listingId: string, 
  sellerUsername: string
): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    if (!socket || !connected || !user) {
      console.error('Cannot request escrow: No socket connection or user');
      resolve(false);
      return;
    }

    const socketUser: SocketUser = {
      id: user.id,
      username: user.username
    };

    socket.emit('request_escrow', {
      transactionId,
      listingId,
      sellerUsername,
      buyer: socketUser
    });

    console.log(`Requested escrow for transaction: ${transactionId}`);
    resolve(true);
  });
};

export const releaseFunds = async (
  socket: Socket | null, 
  connected: boolean, 
  user: User | null, 
  transactionId: string
): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    if (!socket || !connected || !user) {
      console.error('Cannot release funds: No socket connection or user');
      resolve(false);
      return;
    }

    const socketUser: SocketUser = {
      id: user.id,
      username: user.username
    };

    socket.emit('release_funds', {
      transactionId,
      user: socketUser
    });

    console.log(`Released funds for transaction: ${transactionId}`);
    resolve(true);
  });
};

export const refundBuyer = async (
  socket: Socket | null, 
  connected: boolean, 
  user: User | null, 
  transactionId: string
): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    if (!socket || !connected || !user) {
      console.error('Cannot refund buyer: No socket connection or user');
      resolve(false);
      return;
    }

    const socketUser: SocketUser = {
      id: user.id,
      username: user.username
    };

    socket.emit('refund_buyer', {
      transactionId,
      user: socketUser
    });

    console.log(`Refunded buyer for transaction: ${transactionId}`);
    resolve(true);
  });
};

export const sendReminderToParties = async (
  socket: Socket | null,
  connected: boolean,
  user: User | null,
  transactionId: string,
  buyerId: string,
  sellerId: string
): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    if (!socket || !connected || !user) {
      console.error('Cannot send reminder: No socket connection or user');
      resolve(false);
      return;
    }

    const socketUser: SocketUser = {
      id: user.id,
      username: user.username
    };

    socket.emit('send_reminder', {
      transactionId,
      buyerId,
      sellerId,
      user: socketUser
    });

    console.log(`Sent reminder for transaction: ${transactionId}`);
    resolve(true);
  });
};

export const sendSupportMessage = async (
  socket: Socket | null,
  connected: boolean,
  user: User | null,
  message: string,
  roomId: string
): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    if (!socket || !connected || !user) {
      console.error('Cannot send support message: No socket connection or user');
      resolve(false);
      return;
    }

    socket.emit('support_message', {
      content: message,
      sender_id: user.id,
      sender_name: user.username,
      sender_avatar: user.avatar,
      timestamp: new Date(),
      is_admin: user.role === 'admin' || user.role === 'escrow',
      roomId
    });

    console.log(`Sent support message to room: ${roomId}`);
    resolve(true);
  });
};

export const sendSupportTypingIndicator = (
  socket: Socket | null,
  connected: boolean,
  user: User | null,
  isTyping: boolean,
  roomId: string
) => {
  if (!socket || !connected || !user) {
    console.error('Cannot send typing indicator: No socket connection or user');
    return;
  }

  socket.emit('support_typing', {
    isTyping,
    userId: user.id,
    roomId
  });
};

export const checkSupportAvailability = (
  socket: Socket | null,
  connected: boolean
) => {
  if (!socket || !connected) {
    console.error('Cannot check support availability: No socket connection');
    return;
  }

  socket.emit('check_support_availability');
};

// Add the createVouch function to create a vouch record
export const createVouch = async (
  user: User | null,
  transactionId: string,
  sellerId: string,
  rating: number,
  comment: string
): Promise<boolean> => {
  if (!user) {
    console.error('Cannot create vouch: No user');
    return false;
  }
  
  try {
    const { error } = await supabase
      .from('vouches')
      .insert({
        from_user_id: user.id,
        to_user_id: sellerId,
        transaction_id: transactionId,
        rating,
        comment
      });
      
    if (error) {
      console.error('Error creating vouch:', error);
      return false;
    }
    
    console.log(`Created vouch for transaction: ${transactionId}`);
    return true;
  } catch (error) {
    console.error('Error creating vouch:', error);
    return false;
  }
};
