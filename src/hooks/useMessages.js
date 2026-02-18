import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as messageService from '@/services/messages';
import { useAuth } from './useAuth';

const STALE_TIME = 2 * 60 * 1000; // 2 minutes (messages update frequently)
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

/**
 * Hook to fetch messages for a chat
 */
export const useMessages = (chatId, page = 1, limit = 50, enabled = true) => {
  const { user } = useAuth();
  
  const query = useQuery({
    queryKey: ['messages', user?._id, chatId, page, limit],
    queryFn: () => messageService.fetchMessages(chatId, page, limit),
    staleTime: 0, // Messages are immediately stale - always refetch
    gcTime: CACHE_TIME,
    enabled: !!user?._id && !!chatId && enabled
  });
  
  console.log('🔄 useMessages state for chatId', chatId, ':', {
    isLoading: query.isLoading,
    error: query.error,
    dataLength: Array.isArray(query.data) ? query.data.length : 'not-array',
    userId: user?._id,
    data: query.data
  });
  
  return query;
};

/**
 * Hook to send message
 */
export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({ chatId, messageData }) => messageService.sendMessage(chatId, messageData),
    // Optimistic update - show message immediately
    onMutate: async (variables) => {
      const { chatId, messageData } = variables;
      
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ['messages', user?._id, chatId]
      });
      
      // Get current messages
      const previousMessages = queryClient.getQueryData([
        'messages',
        user?._id,
        chatId,
        1,
        50
      ]);
      
      // Create optimistic message
      const optimisticMessage = {
        _id: `temp_${Date.now()}`,
        chatId,
        content: messageData instanceof FormData 
          ? messageData.get('content') 
          : messageData.content,
        sender: user,
        createdAt: new Date().toISOString(),
        attachments: messageData instanceof FormData 
          ? Array.from(messageData.getAll('attachments') || [])
          : [],
        isOptimistic: true
      };
      
      // Update cache with optimistic message
      queryClient.setQueryData(
        ['messages', user?._id, chatId, 1, 50],
        (old) => {
          const oldMessages = Array.isArray(old) ? old : [];
          return [optimisticMessage, ...oldMessages];
        }
      );
      
      console.log('⚡ Optimistic message added:', optimisticMessage);
      
      return { previousMessages };
    },
    onSuccess: (response, variables) => {
      // response is the full data object: { message, chat }
      const { message, chat } = response;
      console.log('💬 MESSAGE SENT - response:', { message, chat });
      
      // Ensure we have a valid message object
      if (!message || !message._id) {
        console.error('❌ Invalid message in response:', message);
        return;
      }

      // Simply update the cache with the server's message
      // No complex refetching - just add the confirmed message
      console.log('✅ Adding confirmed message to cache');
      queryClient.setQueryData(
        ['messages', user?._id, variables.chatId, 1, 50],
        (old) => {
          const oldMessages = Array.isArray(old) ? old : [];
          // Remove optimistic version, add real message
          const filtered = oldMessages.filter(m => m && !m.isOptimistic);
          return [message, ...filtered];
        }
      );

      // Update chat info
      if (chat) {
        console.log('🔄 Updating chat cache');
        queryClient.setQueryData(['chat', variables.chatId], chat);
        
        // Update chat lists
        queryClient.setQueriesData(
          { queryKey: ['chats', user?._id], exact: false },
          (oldChats) => {
            if (!Array.isArray(oldChats)) return oldChats;
            return oldChats.map(c => c._id === variables.chatId ? chat : c);
          }
        );
      }
    },
    onError: (error, variables, context) => {
      // Revert optimistic update on error
      if (context?.previousMessages) {
        queryClient.setQueryData(
          ['messages', user?._id, variables.chatId, 1, 50],
          context.previousMessages
        );
      }
      console.error('❌ Error sending message:', error);
    }
  });
};

/**
 * Hook to fetch single message
 */
export const useMessage = (messageId, enabled = true) => {
  return useQuery({
    queryKey: ['message', messageId],
    queryFn: () => messageService.fetchMessageById(messageId),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    enabled: !!messageId && enabled
  });
};

/**
 * Hook to edit message
 */
export const useUpdateMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ messageId, updates }) => messageService.updateMessage(messageId, updates),
    onSuccess: (data) => {
      queryClient.setQueryData(['message', data._id], data);
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    }
  });
};

/**
 * Hook to delete message
 */
export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId) => messageService.deleteMessage(messageId),
    onSuccess: (_, messageId) => {
      queryClient.removeQueries({ queryKey: ['message', messageId] });
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    }
  });
};

/**
 * Hook to search messages
 */
export const useSearchMessages = (query, filters = {}, enabled = !!query) => {
  return useQuery({
    queryKey: ['searchMessages', query, filters],
    queryFn: () => messageService.searchMessages(query, filters),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    enabled
  });
};

/**
 * Hook to add reaction
 */
export const useAddReaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ messageId, emoji }) => messageService.addReaction(messageId, emoji),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['message', variables.messageId] });
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    }
  });
};

/**
 * Hook to remove reaction
 */
export const useRemoveReaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ messageId, emoji }) => messageService.removeReaction(messageId, emoji),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['message', variables.messageId] });
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    }
  });
};

/**
 * Hook to get reaction stats
 */
export const useReactionStats = (messageId, enabled = true) => {
  return useQuery({
    queryKey: ['reactionStats', messageId],
    queryFn: () => messageService.getReactionStats(messageId),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    enabled: !!messageId && enabled
  });
};

/**
 * Hook to upload file
 */
export const useUploadFile = () => {
  return useMutation({
    mutationFn: (file) => messageService.uploadMessageFile(file)
  });
};

export default {
  useMessages,
  useSendMessage,
  useMessage,
  useUpdateMessage,
  useDeleteMessage,
  useSearchMessages,
  useAddReaction,
  useRemoveReaction,
  useReactionStats,
  useUploadFile
};

