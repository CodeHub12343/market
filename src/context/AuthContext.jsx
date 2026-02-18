'use client';

import React, { createContext, useState } from 'react';
import * as authService from '@/services/auth';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { setCookie, deleteCookie, getCookie } from '@/lib/cookies';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const [token, setToken] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  });

  /* =====================
     FETCH CURRENT USER
  ====================== */
  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => {
      console.log('🔎 USER QUERY RUNNING - Fetching current user...');
      console.log('   API URL from env:', process.env.NEXT_PUBLIC_API_URL);
      return authService.getCurrentUser().then((res) => {
        console.log('🔎 RAW RESPONSE from /auth/me:', res);
        console.log('🔎 res.data:', res.data);
        console.log('🔎 res.data.data:', res.data.data);
        console.log('🔎 res.data.data.user:', res.data.data.user);
        
        const userData = res.data.data.user;
        console.log('✅ USER QUERY RESULT:', {
          email: userData.email,
          id: userData._id,
          fullName: userData.fullName
        });
        return userData;
      }).catch((err) => {
        console.error('❌ USER QUERY ERROR:', err?.message);
        console.error('   Full error:', err);
        console.error('   Response:', err?.response?.data);
        throw err;
      });
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: false,
  });

  /* =====================
     GOOGLE VERIFY
  ====================== */
  const googleVerifyMutation = useMutation({
    mutationFn: (idToken) => authService.verifyGoogleToken(idToken),
    onSuccess: (res) => {
      console.log('🔐 GOOGLE VERIFY SUCCESS - Email:', res.data.data?.user?.email);
      if (res.data.token) {
        const newToken = res.data.token;
        
        // STEP 1: Cache user data BEFORE setting token
        console.log('🔄 Caching user data from Google verify response');
        const userData = res?.data?.data?.user ?? null;
        if (userData) {
          queryClient.setQueryData(['user'], userData);
          console.log('✅ Google user cached:', userData.email);
        }
        
        // STEP 2: Set token
        console.log('🔐 Setting token for user:', res.data.data?.user?.email);
        setToken(newToken);
        localStorage.setItem('token', newToken);
        setCookie('jwt', newToken);

        // STEP 3: Invalidate cache for new user
        console.log('🗑️ Invalidating cache for new user');
        queryClient.invalidateQueries({ queryKey: ['chats'], exact: false });
        queryClient.invalidateQueries({ queryKey: ['messages'], exact: false });
        queryClient.invalidateQueries({ queryKey: ['chat'], exact: false });
        // Trigger socket initialization now that token is set
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('app:initSocket'));
          if (typeof window.__initSocket === 'function') {
            try { window.__initSocket(); } catch (e) { console.warn('⚠️ Failed to call __initSocket()', e); }
          }
          
          // Hard reload to dashboard after successful login
          console.log('🔄 Hard reloading to dashboard...');
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 500);
        }
      }
    },
  });

  /* =====================
     COMPLETE GOOGLE SIGNUP
  ====================== */
  const completeGoogleMutation = useMutation({
    mutationFn: ({ tempToken, campusId }) =>
      authService.completeGoogleSignup(tempToken, campusId),
    onSuccess: (res) => {
      console.log('🔐 COMPLETE GOOGLE SIGNUP - Email:', res.data.data?.user?.email);
      if (res.data.token) {
        const newToken = res.data.token;
        
        // STEP 1: Cache user data BEFORE setting token
        console.log('🔄 Caching user data from complete Google signup response');
        const userData = res?.data?.data?.user ?? null;
        if (userData) {
          queryClient.setQueryData(['user'], userData);
          console.log('✅ Google signup user cached:', userData.email);
        }
        
        // STEP 2: Set token
        console.log('🔐 Setting token for user:', res.data.data?.user?.email);
        setToken(newToken);
        localStorage.setItem('token', newToken);
        setCookie('jwt', newToken);

        // STEP 3: Invalidate cache for new user
        console.log('🗑️ Invalidating cache for new user');
        queryClient.invalidateQueries({ queryKey: ['chats'], exact: false });
        queryClient.invalidateQueries({ queryKey: ['messages'], exact: false });
        queryClient.invalidateQueries({ queryKey: ['chat'], exact: false });
        // Trigger socket initialization now that token is set
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('app:initSocket'));
          if (typeof window.__initSocket === 'function') {
            try { window.__initSocket(); } catch (e) { console.warn('⚠️ Failed to call __initSocket()', e); }
          }
          
          // Hard reload to dashboard after successful signup
          console.log('🔄 Hard reloading to dashboard...');
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 500);
        }
      }
    },
  });

  /* =====================
     EMAIL SIGNUP
  ====================== */
  const signupMutation = useMutation({
    mutationFn: (data) =>
      authService.signupWithEmail(
        data.fullName,
        data.email,
        data.password,
        data.campus
      ),
    onSuccess: (res) => {
      console.log('🔐 SIGNUP SUCCESS - Email:', res.data.data?.user?.email);
      if (res.data.token) {
        const newToken = res.data.token;
        
        // STEP 1: Cache user data BEFORE setting token
        console.log('🔄 Caching user data from signup response');
        const userData = res?.data?.data?.user ?? null;
        if (userData) {
          queryClient.setQueryData(['user'], userData);
          console.log('✅ User signup cached:', userData.email);
        }
        
        // STEP 2: Set token
        console.log('🔐 Setting token for user:', res.data.data?.user?.email);
        setToken(newToken);
        localStorage.setItem('token', newToken);
        setCookie('jwt', newToken);

        // STEP 3: Invalidate cache for new user
        console.log('🗑️ Invalidating cache for new user');
        queryClient.invalidateQueries({ queryKey: ['chats'], exact: false });
        queryClient.invalidateQueries({ queryKey: ['messages'], exact: false });
        queryClient.invalidateQueries({ queryKey: ['chat'], exact: false });
        // Trigger socket initialization now that token is set
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('app:initSocket'));
          if (typeof window.__initSocket === 'function') {
            try { window.__initSocket(); } catch (e) { console.warn('⚠️ Failed to call __initSocket()', e); }
          }
          
          // Hard reload to dashboard after successful signup
          console.log('🔄 Hard reloading to dashboard...');
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 500);
        }
      }
    },
  });

  /* =====================
     EMAIL LOGIN
  ====================== */
  const loginMutation = useMutation({
    mutationFn: (data) => {
      console.log('🔐 LOGIN ATTEMPT - Email:', data.email);
      console.log('   API URL:', process.env.NEXT_PUBLIC_API_URL);
      return authService.loginWithEmail(data.email, data.password);
    },
    onSuccess: (res) => {
      console.log('🔐 LOGIN SUCCESS - Email:', res.data.data?.user?.email);

      if (res.data?.token) {
        const newToken = res.data.token;
        console.log('🔓 EXTRACTED TOKEN from response:', newToken.substring(0, 30) + '...');

        // STEP 1: Cache user data BEFORE setting token (prevents query refetch with old cache)
        console.log('🔄 Using user data from login response (no extra /auth/me call)');
        const userData = res?.data?.data?.user ?? null;

        if (userData) {
          console.log('✅ GOT USER DATA from login:', userData);
          console.log('✅ User email:', userData.email);
          console.log('✅ User _id:', userData._id);
          
          // Cache the user data immediately BEFORE token changes
          queryClient.setQueryData(['user'], userData);
          console.log('✅ Cached user from login response:', userData.email);
          console.log('✅ User avatar data:', userData.avatar);
          console.log('✅ Complete user object:', userData);
        }

        // STEP 2: Persist token synchronously so axios interceptor can read it
        console.log('🔐 Setting token and saving to storage');
        setToken(newToken);
        localStorage.setItem('token', newToken);
        setCookie('jwt', newToken);

        // STEP 3: Invalidate all chats/messages/data to prevent showing previous user's data
        console.log('🗑️ Invalidating chats and messages cache for new user');
        queryClient.invalidateQueries({ queryKey: ['chats'], exact: false });
        queryClient.invalidateQueries({ queryKey: ['messages'], exact: false });
        queryClient.invalidateQueries({ queryKey: ['chat'], exact: false });
        
        // Trigger socket initialization now that token is set
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('app:initSocket'));
          if (typeof window.__initSocket === 'function') {
            try { window.__initSocket(); } catch (e) { console.warn('⚠️ Failed to call __initSocket()', e); }
          }
          
          // Hard reload to dashboard after successful login
          console.log('🔄 Hard reloading to dashboard...');
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 500);
        }
      }
    },
    onError: (error) => {
      console.error('❌ LOGIN ERROR:', error?.message);
      console.error('   Full error:', error);
      console.error('   Response data:', error?.response?.data);
      console.error('   Status:', error?.response?.status);
    }
  });
  /* =====================
     LOGOUT
  ====================== */
  const logoutMutation = useMutation({
    mutationFn: async () => {
      // CRITICAL: Read token directly from localStorage (don't rely on React state)
      // State might be stale, but localStorage is always current
      const currentToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      console.log('🚪 LOGOUT - Token from localStorage:', !!currentToken);
      
      // Import the getGlobalSocket function to access the socket
      const { getGlobalSocket } = await import('@/context/SocketContext');
      const socket = getGlobalSocket();
      
      console.log('🚪 LOGOUT - Socket check:', {
        socketExists: !!socket,
        isConnected: socket?.connected || false
      });
      
      // STEP 1: Emit logout event to socket before logging out
      // This notifies other users that we're going offline
      if (socket?.connected) {
        console.log('📡 LOGOUT - Emitting userLogout event to socket');
        
        return new Promise((resolve) => {
          let resolved = false; // Flag to prevent double-calling logout
          
          const callLogout = async () => {
            if (resolved) return; // Already resolved
            resolved = true;
            
            console.log('📤 LOGOUT - Calling authService.logout()');
            try {
              await authService.logout();
              resolve();
            } catch (err) {
              console.warn('⚠️ LOGOUT - HTTP logout failed, but continuing:', err?.message);
              resolve(); // Resolve anyway - socket is already disconnected
            }
          };
          
          socket.emit('userLogout', {}, (response) => {
            console.log('✅ LOGOUT - Socket userLogout event acknowledged:', response);
            
            // STEP 2: Disconnect socket after logout is acknowledged
            console.log('🔌 LOGOUT - Disconnecting socket...');
            socket.disconnect();
            console.log('✅ LOGOUT - Socket disconnected');
            
            // STEP 3: Call logout (only once)
            callLogout();
          });
          
          // Timeout fallback - if no response after 500ms, proceed anyway
          setTimeout(() => {
            if (!resolved) {
              console.log('⚠️ LOGOUT - Socket ack timeout, disconnecting and proceeding with logout');
              socket.disconnect();
              callLogout();
            }
          }, 500);
        });
      } else {
        console.log('⚠️ LOGOUT - Socket not connected, proceeding with HTTP logout');
        return authService.logout();
      }
    },
    onSuccess: () => {
      console.log('🚪 LOGOUT - Clearing all data');
      
      setToken(null);
      localStorage.removeItem('token');
      deleteCookie('jwt');
      
      // Clear all cached data to prevent stale data from being shown to next user
      console.log('🗑️ LOGOUT - Removing all React Query cache');
      queryClient.clear();
      
      // Also clear browser storage to be extra safe
      if (typeof window !== 'undefined') {
        console.log('🧹 LOGOUT - Clearing sessionStorage');
        sessionStorage.clear();
        
        // Hard reload to login page
        console.log('🔄 Hard reloading to login...');
        setTimeout(() => {
          window.location.href = '/login';
        }, 300);
      }
      
      console.log('✅ LOGOUT - Complete, all data cleared');
    },
    onError: (error) => {
      console.log('🚪 LOGOUT - Error, but clearing frontend data anyway');
      console.error('LOGOUT ERROR:', error);
      
      // Even if logout fails on backend, clear frontend data and disconnect socket
      const { getGlobalSocket } = require('@/context/SocketContext');
      const socket = getGlobalSocket();
      if (socket?.connected) {
        socket.disconnect();
      }
      
      setToken(null);
      localStorage.removeItem('token');
      deleteCookie('jwt');
      queryClient.clear();
    }
  });

  const value = {
    user: user ?? null,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,

    verifyGoogle: googleVerifyMutation.mutateAsync,
    completeGoogleSignup: completeGoogleMutation.mutateAsync,
    signup: signupMutation.mutateAsync,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutate,

    isVerifyingGoogle: googleVerifyMutation.isPending,
    isCompletingSignup: completeGoogleMutation.isPending,
    isSigningUp: signupMutation.isPending,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,

    googleError: googleVerifyMutation.error,
    signupError: signupMutation.error,
    loginError: loginMutation.error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};