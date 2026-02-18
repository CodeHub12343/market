import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState, useEffect } from 'react';

// ✅ Hook for handling paginated queries with auto-prefetching
export function usePaginatedQuery(
  queryKey,
  fetchFn,
  {
    initialPage = 1,
    pageSize = 10,
    keepPreviousData = true,
    prefetchPages = 1,
    enabled = true,
    ...queryOptions
  } = {}
) {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(initialPage);

  // ✅ Build page-specific query key
  const pageQueryKey = [queryKey, currentPage, pageSize];

  // ✅ Fetch current page
  const query = useQuery({
    queryKey: pageQueryKey,
    queryFn: () => fetchFn({ page: currentPage, pageSize }),
    placeholderData: (previousData) =>
      keepPreviousData ? previousData : undefined,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: enabled && currentPage >= 1,
    ...queryOptions,
  });

  // ✅ Auto-prefetch next pages
  useEffect(() => {
    if (!query.data?.hasNextPage) return;

    for (let i = 1; i <= prefetchPages; i++) {
      const nextPageKey = [queryKey, currentPage + i, pageSize];
      queryClient.prefetchQuery({
        queryKey: nextPageKey,
        queryFn: () => fetchFn({ page: currentPage + i, pageSize }),
        staleTime: 5 * 60 * 1000,
      });
    }
  }, [currentPage, prefetchPages, queryKey, pageSize, queryClient, query.data?.hasNextPage]);

  const goToPage = useCallback((page) => {
    setCurrentPage(Math.max(1, page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    currentPage,
    pageSize,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: query.data?.hasNextPage ?? false,
    hasPrevPage: currentPage > 1,
    totalPages: query.data?.totalPages ?? 1,
  };
}

export default usePaginatedQuery;
