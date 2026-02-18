/**
 * useBlocking Hook - Manage blocked users
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as profileService from '@/services/profile';

export const useBlockUser = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: block, isPending: isBlocking } = useMutation({
    mutationFn: (userId) => profileService.blockUser(userId),
    onSuccess: (res, userId) => {
      console.log('✅ User blocked successfully');
      // Invalidate profile data
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
    },
    onError: (error) => {
      console.error('❌ Block failed:', error?.response?.data?.message);
    }
  });

  const { mutateAsync: unblock, isPending: isUnblocking } = useMutation({
    mutationFn: (userId) => profileService.unblockUser(userId),
    onSuccess: (res, userId) => {
      console.log('✅ User unblocked successfully');
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
    },
    onError: (error) => {
      console.error('❌ Unblock failed:', error?.response?.data?.message);
    }
  });

  return {
    block,
    unblock,
    isBlocking,
    isUnblocking
  };
};
