
import React, { createContext, useContext, ReactNode } from 'react';
import { useUser } from './UserContext';
import { SocketContextType } from './socket/socketTypes';
import { useSocketConnection } from './socket/useSocketConnection';
import { socketUtils } from './socket/socketContext.utils';

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  const { socket, connected } = useSocketConnection(user);

  const socketJoinRoom = (roomId: string) => {
    socketUtils.joinRoom(socket, connected, roomId);
  };

  const socketLeaveRoom = (roomId: string) => {
    socketUtils.leaveRoom(socket, connected, roomId);
  };

  const socketRequestEscrow = async (transactionId: string, listingId: string, sellerUsername: string) => {
    return await socketUtils.requestEscrow(socket, connected, user, transactionId, listingId, sellerUsername);
  };

  const socketReleaseFunds = async (transactionId: string) => {
    return await socketUtils.releaseFunds(socket, connected, user, transactionId);
  };

  const socketRefundBuyer = async (transactionId: string) => {
    return await socketUtils.refundBuyer(socket, connected, user, transactionId);
  };

  const socketSendReminderToParties = async (transactionId: string, buyerId: string, sellerId: string) => {
    return await socketUtils.sendReminderToParties(socket, connected, user, transactionId, buyerId, sellerId);
  };

  const socketSendSupportMessage = async (message: string, roomId: string) => {
    return await socketUtils.sendSupportMessage(socket, connected, user, message, roomId);
  };

  const socketSendSupportTypingIndicator = (isTyping: boolean, roomId: string) => {
    socketUtils.sendSupportTypingIndicator(socket, connected, user, isTyping, roomId);
  };

  const socketCheckSupportAvailability = () => {
    socketUtils.checkSupportAvailability(socket, connected);
  };

  return (
    <SocketContext.Provider value={{ 
      socket, 
      connected, 
      joinRoom: socketJoinRoom, 
      leaveRoom: socketLeaveRoom,
      requestEscrow: socketRequestEscrow,
      releaseFunds: socketReleaseFunds,
      refundBuyer: socketRefundBuyer,
      sendReminderToParties: socketSendReminderToParties,
      sendSupportMessage: socketSendSupportMessage,
      sendSupportTypingIndicator: socketSendSupportTypingIndicator,
      checkSupportAvailability: socketCheckSupportAvailability
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
