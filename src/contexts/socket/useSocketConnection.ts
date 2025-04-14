
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { SOCKET_SERVER_URL } from './socketConfig';
import { User } from '@/types';

export const useSocketConnection = (user: User | null) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const initializeSocket = () => {
      if (user) {
        const newSocket = io(SOCKET_SERVER_URL, {
          query: {
            userId: user.id,
            username: user.username
          },
          transports: ['websocket'],
          upgrade: false
        });

        newSocket.on('connect', () => {
          console.log('Socket connected:', newSocket.id);
          setConnected(true);
        });

        newSocket.on('disconnect', () => {
          console.log('Socket disconnected');
          setConnected(false);
        });

        newSocket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          setConnected(false);
        });

        setSocket(newSocket);
      }
    };

    if (user) {
      initializeSocket();
    } else {
      setSocket(null);
      setConnected(false);
    }

    return () => {
      socket?.disconnect();
    };
  }, [user]);

  return { socket, connected };
};
