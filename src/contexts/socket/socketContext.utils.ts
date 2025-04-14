
import { Socket } from 'socket.io-client';
import { User } from '@/types';
import { 
  joinRoom, 
  leaveRoom, 
  requestEscrow, 
  releaseFunds, 
  refundBuyer, 
  sendReminderToParties,
  sendSupportMessage,
  sendSupportTypingIndicator,
  checkSupportAvailability,
  createVouch
} from './socketActions';

// Socket utility functions with proper typing
export const socketUtils = {
  joinRoom: (socket: Socket | null, connected: boolean, roomId: string) => {
    joinRoom(socket, connected, roomId);
  },
  
  leaveRoom: (socket: Socket | null, connected: boolean, roomId: string) => {
    leaveRoom(socket, connected, roomId);
  },
  
  requestEscrow: async (
    socket: Socket | null, 
    connected: boolean, 
    user: User | null, 
    transactionId: string, 
    listingId: string, 
    sellerUsername: string
  ): Promise<boolean> => {
    return await requestEscrow(socket, connected, user, transactionId, listingId, sellerUsername);
  },
  
  releaseFunds: async (
    socket: Socket | null, 
    connected: boolean, 
    user: User | null, 
    transactionId: string
  ): Promise<boolean> => {
    return await releaseFunds(socket, connected, user, transactionId);
  },
  
  refundBuyer: async (
    socket: Socket | null, 
    connected: boolean, 
    user: User | null, 
    transactionId: string
  ): Promise<boolean> => {
    return await refundBuyer(socket, connected, user, transactionId);
  },
  
  sendReminderToParties: async (
    socket: Socket | null,
    connected: boolean,
    user: User | null,
    transactionId: string,
    buyerId: string,
    sellerId: string
  ): Promise<boolean> => {
    return await sendReminderToParties(socket, connected, user, transactionId, buyerId, sellerId);
  },
  
  sendSupportMessage: async (
    socket: Socket | null,
    connected: boolean,
    user: User | null,
    message: string,
    roomId: string
  ): Promise<boolean> => {
    return await sendSupportMessage(socket, connected, user, message, roomId);
  },
  
  sendSupportTypingIndicator: (
    socket: Socket | null,
    connected: boolean,
    user: User | null,
    isTyping: boolean,
    roomId: string
  ): void => {
    sendSupportTypingIndicator(socket, connected, user, isTyping, roomId);
  },
  
  checkSupportAvailability: (
    socket: Socket | null,
    connected: boolean
  ): void => {
    checkSupportAvailability(socket, connected);
  },
  
  createVouch: async (
    user: User | null,
    transactionId: string,
    sellerId: string,
    rating: number,
    comment: string
  ): Promise<boolean> => {
    return await createVouch(user, transactionId, sellerId, rating, comment);
  }
};
