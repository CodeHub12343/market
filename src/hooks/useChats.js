import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as chatService from '@/services/chat';
import { useAuth } from './useAuth';

const STALE_TIME = 5 * 60 * 1000; // 5 minutes
const CACHE_TIME = 10 * 60 * 1000; // 10 minutes
const CHATS_STALE_TIME = 30 * 1000; // 30 seconds - chats update frequently

/**
 * Hook to fetch all chats
 */
export const useAllChats = (filters = {}, enabled = true) => {
  const { user } = useAuth();
  
  const query = useQuery({
    queryKey: ['chats', user?._id, filters],
    queryFn: () => chatService.fetchMyChats(filters),
    staleTime: CHATS_STALE_TIME,
    gcTime: CACHE_TIME,
    enabled: !!user?._id && enabled
  });
  
  console.log('🔄 useAllChats query state:', { 
    isLoading: query.isLoading, 
    error: query.error, 
    dataLength: query.data?.length,
    userId: user?._id,
    data: query.data 
  });
  
  return query;
};

/**
 * Hook to fetch single chat
 */
export const useChat = (chatId, enabled = true) => {
  const query = useQuery({
    queryKey: ['chat', chatId],
    queryFn: () => chatService.fetchChatById(chatId),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    enabled: !!chatId && enabled
  });
  
  console.log('🔄 useChat result for chatId:', chatId, {
    isLoading: query.isLoading,
    error: query.error,
    hasData: !!query.data,
    hasMembersField: !!query.data?.members,
    membersCount: query.data?.members?.length,
    data: query.data
  });
  
  return query;
};

/**
 * Hook to create or get 1:1 chat
 */
export const useGetOrCreateChat = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (otherUserId) => chatService.getOrCreateOneToOneChat(otherUserId),
    onSuccess: (data) => {
      console.log('💬 NEW 1:1 CHAT CREATED - updating chat list');
      // Immediately refetch chats to show new chat in the list
      queryClient.invalidateQueries({ 
        queryKey: ['chats', user?._id],
        exact: false
      });
      queryClient.refetchQueries({ 
        queryKey: ['chats', user?._id],
        exact: false
      }).then(() => {
        console.log('✅ ChatList updated with new 1:1 chat');
      });
      queryClient.setQueryData(['chat', user?._id, data._id], data);
    }
  });
};

/**
 * Hook to create group chat
 */
export const useCreateGroupChat = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (chatData) => chatService.createGroupChat(chatData),
    onSuccess: (data) => {
      console.log('💬 NEW GROUP CHAT CREATED - updating chat list');
      // Immediately refetch chats to show new chat in the list
      queryClient.invalidateQueries({ 
        queryKey: ['chats', user?._id],
        exact: false
      });
      queryClient.refetchQueries({ 
        queryKey: ['chats', user?._id],
        exact: false
      }).then(() => {
        console.log('✅ ChatList updated with new group chat');
      });
      queryClient.setQueryData(['chat', user?._id, data._id], data);
    }
  });
};

/**
 * Hook to update chat
 */
export const useUpdateChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ chatId, updates }) => chatService.updateChat(chatId, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      queryClient.setQueryData(['chat', data._id], data);
    }
  });
};

/**
 * Hook to delete chat
 */
export const useDeleteChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (chatId) => chatService.deleteChat(chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    }
  });
};

/**
 * Hook to search users
 */
export const useSearchUsers = (query, enabled = !!query) => {
  return useQuery({
    queryKey: ['searchUsers', query],
    queryFn: () => chatService.searchUsers(query),
    staleTime: 2 * 60 * 1000,
    gcTime: CACHE_TIME,
    enabled
  });
};

/**
 * Hook to search chats
 */
export const useSearchChats = (query, filters = {}, enabled = !!query) => {
  return useQuery({
    queryKey: ['searchChats', query, filters],
    queryFn: () => chatService.searchChats(query, filters),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    enabled
  });
};

export default {
  useAllChats,
  useChat,
  useGetOrCreateChat,
  useCreateGroupChat,
  useUpdateChat,
  useDeleteChat,
  useSearchUsers,
  useSearchChats
};
