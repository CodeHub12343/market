import { useEffect, useState, useCallback, useRef } from 'react';
import io from 'socket.io-client';

// Strip /api/v1 from the URL for Socket.IO connection
let SOCKET_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000')
  .replace(/\/api\/v\d+\/?$/, '');

/**
 * Custom hook for Socket.IO connection
 */
export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});
  const socketRef = useRef(null);

  useEffect(() => {
    // If socket already exists, don't create a new one (prevents double-invoke issues)
    if (socketRef.current) {
      console.log('🔧 Socket already exists, reusing:', socketRef.current.id);
      setSocket(socketRef.current);
      return;
    }

    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      console.warn('⚠️ No token found in localStorage');
      return;
    }

    console.log('🔧 useSocket initializing with token:', token.substring(0, 20) + '...');

    try {
      // Create socket connection with proper configuration
      const socketInstance = io(SOCKET_URL, {
        auth: {
          token
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
        transports: ['websocket', 'polling'],
        forceNew: false,
        secure: SOCKET_URL.startsWith('https')
      });

      console.log('🔧 Socket instance created, id:', socketInstance.id);

      // Connection events
      socketInstance.on('connect', () => {
        console.log('✅ Socket connected:', socketInstance.id);
        console.log('🔧 Setting isConnected to true');
        setIsConnected(true);
      });

      socketInstance.on('disconnect', (reason) => {
        console.log('❌ Socket disconnected:', reason);
        console.log('🔧 Setting isConnected to false');
        setIsConnected(false);
      });

      socketInstance.on('connect_error', (error) => {
        console.error('⚠️ Socket connection error:', error.message);
      });

      socketInstance.on('error', (error) => {
        console.error('⚠️ Socket error:', error);
      });

      // Store in ref to prevent recreation
      socketRef.current = socketInstance;
      setSocket(socketInstance);
      console.log('🔧 Socket instance set, waiting for connect event...');

      return () => {
        // Only disconnect on actual component unmount
        // Note: In dev mode with React StrictMode, this will be called but socketRef will preserve the socket
        console.log('🔧 useSocket cleanup called');
      };
    } catch (error) {
      console.error('❌ Failed to initialize socket:', error);
      setIsConnected(false);
    }
  }, []);

  // Join chat room
  const joinChat = useCallback((chatId) => {
    if (socket?.connected) {
      socket.emit('joinChat', chatId);
    }
  }, [socket]);

  // Leave chat room
  const leaveChat = useCallback((chatId) => {
    if (socket?.connected) {
      socket.emit('leaveChat', chatId);
    }
  }, [socket]);

  // Send message
  const sendMessage = useCallback((chatId, messageData) => {
    if (socket?.connected) {
      socket.emit('sendMessage', {
        chatId,
        ...messageData
      });
    }
  }, [socket]);

  // Set typing status
  const setTypingStatus = useCallback((chatId, isTyping) => {
    if (socket?.connected) {
      socket.emit('typing', { chatId, isTyping });
    }
  }, [socket]);

  // Add reaction
  const addReaction = useCallback((messageId, chatId, emoji) => {
    if (socket?.connected) {
      socket.emit('addReaction', { messageId, chatId, emoji });
    }
  }, [socket]);

  // Remove reaction
  const removeReaction = useCallback((messageId, chatId, emoji) => {
    if (socket?.connected) {
      socket.emit('removeReaction', { messageId, chatId, emoji });
    }
  }, [socket]);

  return {
    socket,
    isConnected,
    typingUsers,
    setTypingUsers,
    joinChat,
    leaveChat,
    sendMessage,
    setTypingStatus,
    addReaction,
    removeReaction
  };
};

export default useSocket;