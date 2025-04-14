import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useUser } from './UserContext';
import { socketUtils } from './socket/socketContext.utils';

interface SocketContextType {
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

const SocketContext = createContext<SocketContextType>({
  socket: null,
  connected: false,
  joinRoom: () => {},
  leaveRoom: () => {},
  requestEscrow: async () => false,
  releaseFunds: async () => false,
  refundBuyer: async () => false,
  sendReminderToParties: async () => false,
  sendSupportMessage: async () => false,
  sendSupportTypingIndicator: () => {},
  checkSupportAvailability: () => {},
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      autoConnect: true,
      reconnection: true,
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected');
      setConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const socketJoinRoom = (roomId: string) => {
    if (socket && connected) {
      socket.emit('join_room', roomId);
    }
  };

  const socketLeaveRoom = (roomId: string) => {
    if (socket && connected) {
      socket.emit('leave_room', roomId);
    }
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

export default SocketProvider;
