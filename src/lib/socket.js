import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';

let socket = null;

export const initializeSocket = () => {
  if (socket) return socket;

  const token = localStorage.getItem('token');
  if (!token) return null;

  socket = io(SOCKET_URL, {
    auth: { token },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected');
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const joinChat = (chatId) => {
  const sock = getSocket();
  if (sock) {
    sock.emit('joinChat', chatId);
  }
};

export const leaveChat = (chatId) => {
  const sock = getSocket();
  if (sock) {
    sock.emit('leaveChat', chatId);
  }
};

export const sendTypingStatus = (chatId, isTyping) => {
  const sock = getSocket();
  if (sock) {
    sock.emit('typing', { chatId, isTyping });
  }
};
