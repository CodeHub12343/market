'use client';

import { createContext, useContext, useEffect, useState, useRef, useCallback, useMemo } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext(null);

// Strip /api/v1 from the URL for Socket.IO connection
let SOCKET_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000')
  .replace(/\/api\/v\d+\/?$/, '');

// Global socket instance - shared across all components
let globalSocket = null;
let globalSocketInitializing = false;

// Export accessor function for logout and other operations
export function getGlobalSocket() {
  return globalSocket;
}

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [unreadCounts, setUnreadCounts] = useState({});
  const socketSyncedRef = useRef(false); // Track if global socket has been synced to state

  useEffect(() => {
    // Helper to initialize socket instance (can be called on mount or after login)
    const initSocket = async () => {
      // If socket already exists globally, ensure state is synced once
      if (globalSocket && !socketSyncedRef.current) {
        console.log('🔧 [SOCKET PROVIDER] Using existing global socket:', globalSocket.id);
        socketSyncedRef.current = true;
        setSocket(globalSocket);
        setIsConnected(globalSocket.connected);
        return;
      }

      if (socketSyncedRef.current || globalSocketInitializing) {
        if (globalSocketInitializing) console.log('🔧 [SOCKET PROVIDER] Socket initialization already in progress');
        return;
      }

      // Get token from localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        console.warn('⚠️ No token found in localStorage');
        return;
      }

      globalSocketInitializing = true;
      console.log('🔧 [SOCKET PROVIDER] Creating GLOBAL socket instance with token:', token.substring(0, 20) + '...');

      try {
        const socketInstance = io(SOCKET_URL, {
          auth: { token },
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
          transports: ['websocket', 'polling'],
          forceNew: false,
          secure: SOCKET_URL.startsWith('https'),
          autoConnect: false
        });

        console.log('🔧 [SOCKET PROVIDER] Socket instance created (not yet connected)');

        // Presence listener
        socketInstance.on('presenceUpdate', (data) => {
          const { userId, status } = data;
          const normalizedUserId = (userId || '').toString().toLowerCase().trim();
          console.log(`👤 [SOCKET PROVIDER] Presence update: User ${normalizedUserId} is ${status}`);
          setOnlineUsers(prev => {
            const updated = new Set(prev);
            if (status === 'online') {
              updated.add(normalizedUserId);
            } else {
              updated.delete(normalizedUserId);
            }
            return updated;
          });
        });

        // Snapshot listener - server sends authoritative list of online members on connect (CRITICAL for reconciliation)
        socketInstance.on('presenceSnapshot', (data) => {
          try {
            const members = data?.onlineMembers || [];
            console.log(`👥 [SOCKET PROVIDER] Presence snapshot received with ${members.length} members`);
            
            // Build a new set with the snapshot (this is the authoritative state)
            setOnlineUsers(prev => {
              const updated = new Set(prev);
              
              // Normalize and add all members from snapshot
              const validMembers = members.filter(m => m).map(m => 
                (m || '').toString().toLowerCase().trim()
              );
              
              console.log(`👥 [SOCKET PROVIDER] Snapshot members (normalized):`, validMembers);
              
              // Replace with snapshot state
              return new Set(validMembers);
            });
          } catch (err) {
            console.warn('⚠️ [SOCKET PROVIDER] Error handling presenceSnapshot:', err);
          }
        });

        // Listen for unread count updates and persist them in context
        socketInstance.on('unreadCountUpdate', (data) => {
          try {
            const { chatId, unreadCount } = data || {};
            if (!chatId) return;
            console.log(`📊 [SOCKET PROVIDER] unreadCountUpdate for ${chatId}:`, unreadCount);
            setUnreadCounts(prev => ({
              ...prev,
              [chatId]: typeof unreadCount === 'number' ? unreadCount : 0
            }));
          } catch (err) {
            console.warn('⚠️ [SOCKET PROVIDER] Error handling unreadCountUpdate:', err);
          }
        });

        // Connect handler
        socketInstance.on('connect', () => {
          console.log('✅ [SOCKET PROVIDER] Socket CONNECTED:', socketInstance.id);
          setIsConnected(true);

          try {
            const parts = token.split('.');
            if (parts.length === 3) {
              const payload = JSON.parse(atob(parts[1]));
              const userId = payload.id;
              if (userId) {
                const normalizedUserId = userId.toLowerCase().trim();
                
                // The server will send presenceSnapshot immediately after this connection
                // We'll set our own online status
                setOnlineUsers(prev => {
                  const updated = new Set(prev);
                  updated.add(normalizedUserId);
                  return updated;
                });

                console.log(`✅ [SOCKET PROVIDER] Connected as user ${normalizedUserId}. Awaiting presenceSnapshot from server...`);
              }
            }
          } catch (error) {
            console.error('⚠️ Failed to extract user ID from token:', error);
          }
        });

        socketInstance.on('connect_error', (error) => {
          console.error('⚠️ [SOCKET PROVIDER] Socket connection error:', error.message);
        });

        socketInstance.on('error', (error) => {
          console.error('⚠️ [SOCKET PROVIDER] Socket error:', error);
        });

        // Now connect
        socketInstance.connect();

        globalSocket = socketInstance;
        setSocket(socketInstance);
        globalSocketInitializing = false;
        console.log('🔧 [SOCKET PROVIDER] Global socket instance ready');
      } catch (error) {
        console.error('❌ [SOCKET PROVIDER] Failed to initialize socket:', error);
        setIsConnected(false);
        globalSocketInitializing = false;
      }
    };

    // Initialize on mount if token exists
    initSocket();

    // Allow other code to trigger initialization after login
    const onInit = () => initSocket();
    window.addEventListener('app:initSocket', onInit);
    // Expose direct init hook for immediate calls (used by AuthContext for form-login flows)
    try {
      window.__initSocket = initSocket;
    } catch (err) {
      // ignore if window isn't writable
    }

    return () => {
      window.removeEventListener('app:initSocket', onInit);
      try { delete window.__initSocket; } catch (e) {}
    };
  }, []);

  // Join chat room
  const joinChat = useCallback((chatId) => {
    if (socket?.connected) {
      socket.emit('joinChat', chatId, (response) => {
        console.log('✅ Joined chat room:', response);
        
        // Add other online users to the onlineUsers set
        if (response.onlineUsers && Array.isArray(response.onlineUsers)) {
          setOnlineUsers(prev => {
            const updated = new Set(prev);
            response.onlineUsers.forEach(userId => {
              const normalized = (userId || '').toString().toLowerCase().trim();
              updated.add(normalized);
              console.log(`✅ Added ${normalized} from chat room to onlineUsers`);
            });
            console.log(`📊 Total online users now: ${updated.size}`);
            return updated;
          });
        }
      });
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

  // Use useMemo to prevent unnecessary re-renders when onlineUsers Set reference changes
  // Convert Set to sorted array for stable reference - this prevents infinite loops
  const onlineUsersArray = useMemo(() => {
    return Array.from(onlineUsers).sort();
  }, [onlineUsers]);

  const value = useMemo(() => ({
    socket,
    isConnected,
    typingUsers,
    setTypingUsers,
    onlineUsers: onlineUsersArray, // Export as array instead of Set to have stable references
    unreadCounts,
    setUnreadCounts,
    setOnlineUsers,
    joinChat,
    leaveChat,
    sendMessage,
    setTypingStatus,
    addReaction,
    removeReaction
  }), [
    socket,
    isConnected,
    typingUsers,
    onlineUsersArray,
    unreadCounts,
    joinChat,
    leaveChat,
    sendMessage,
    setTypingStatus,
    addReaction,
    removeReaction
  ]);

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
}
