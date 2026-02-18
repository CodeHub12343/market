import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { chatAPI } from '@/lib/api';
import { debounce } from 'lodash';

export const useSearchUsers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const debouncedSearch = useCallback(
    debounce((query) => {
      setDebouncedQuery(query);
    }, 300),
    []
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['searchUsers', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery || debouncedQuery.trim().length < 2) {
        return [];
      }
      const response = await chatAPI.searchUsers(debouncedQuery);
      return response.data.data || [];
    },
    enabled: debouncedQuery.trim().length >= 2,
  });

  return {
    searchQuery,
    setSearchQuery: handleSearch,
    users: data || [],
    isLoading,
    error,
  };
};
