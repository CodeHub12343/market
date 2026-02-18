import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import * as requestService from '@/services/requests';

const STALE_TIME = 2 * 60 * 1000; // 2 minutes (requests change frequently)
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

/**
 * Hook to fetch paginated requests with automatic campus filtering
 * By default, only shows requests from user's campus
 * Can optionally show all campuses with allCampuses flag
 */
export const useRequests = (page = 1, limit = 12, filters = {}) => {
  const { user } = useAuth();

  // Auto-add campus filtering
  const enhancedFilters = {
    ...filters,
    // Campus filtering is enforced by backend for authenticated users
  };

  // Create a stable query key by converting filters to a string for comparison
  const filterString = JSON.stringify(enhancedFilters);

  return useQuery({
    queryKey: ['requests', page, limit, filterString],
    queryFn: () => requestService.fetchRequestsPaginated(page, limit, enhancedFilters),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    enabled: !!user // Only fetch if authenticated
  });
};

/**
 * Hook to fetch single request by ID
 */
export const useRequest = (id) => {
  return useQuery({
    queryKey: ['request', id],
    queryFn: () => requestService.fetchRequestById(id),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    enabled: !!id
  });
};

/**
 * Hook to fetch user's own requests
 */
export const useMyRequests = () => {
  return useQuery({
    queryKey: ['myRequests'],
    queryFn: requestService.fetchMyRequests,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME
  });
};

/**
 * Hook to search requests
 */
export const useSearchRequests = (query, filters = {}) => {
  return useQuery({
    queryKey: ['searchRequests', query, filters],
    queryFn: () => requestService.searchRequests(query, filters),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    enabled: !!query
  });
};

/**
 * Hook to fetch trending requests
 */
export const useTrendingRequests = () => {
  return useQuery({
    queryKey: ['trendingRequests'],
    queryFn: requestService.getTrendingRequests,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME
  });
};

/**
 * Hook to fetch offers on a request
 */
export const useRequestOffers = (requestId) => {
  return useQuery({
    queryKey: ['requestOffers', requestId],
    queryFn: () => requestService.fetchRequestOffers(requestId),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    enabled: !!requestId
  });
};

/**
 * Hook to create a request
 */
export const useCreateRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestData) => requestService.createRequest(requestData),
    onSuccess: () => {
      // Invalidate all request-related queries to ensure list updates
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['myRequests'] });
      queryClient.invalidateQueries({ queryKey: ['trendingRequests'] });
      queryClient.invalidateQueries({ queryKey: ['searchRequests'] });
    }
  });
};

/**
 * Hook to update a request
 */
export const useUpdateRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updateData }) => requestService.updateRequest(id, updateData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['request', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['myRequests'] });
    }
  });
};

/**
 * Hook to delete a request
 */
export const useDeleteRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => requestService.deleteRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['myRequests'] });
    }
  });
};

/**
 * Hook to close a request
 */
export const useCloseRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, closureData }) => requestService.closeRequest(id, closureData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['request', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['myRequests'] });
    }
  });
};

/**
 * Hook to reopen a request
 */
export const useReopenRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => requestService.reopenRequest(id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['request', variables] });
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['myRequests'] });
    }
  });
};

/**
 * Hook to toggle favorite request
 */
export const useToggleFavoriteRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => requestService.toggleFavoriteRequest(id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['request', variables] });
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    }
  });
};

/**
 * Hook to accept a request offer
 */
export const useAcceptRequestOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, offerId }) => requestService.acceptRequestOffer(requestId, offerId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['request', variables.requestId] });
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['myRequests'] });
      queryClient.invalidateQueries({ queryKey: ['requestOffers', variables.requestId] });
    }
  });
};

/**
 * Hook to reject a request offer
 */
export const useRejectRequestOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, offerId }) => requestService.rejectRequestOffer(requestId, offerId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['request', variables.requestId] });
      queryClient.invalidateQueries({ queryKey: ['requestOffers', variables.requestId] });
    }
  });
};

export default {
  useRequests,
  useRequest,
  useMyRequests,
  useSearchRequests,
  useTrendingRequests,
  useRequestOffers,
  useCreateRequest,
  useUpdateRequest,
  useDeleteRequest,
  useCloseRequest,
  useReopenRequest,
  useToggleFavoriteRequest,
  useAcceptRequestOffer,
  useRejectRequestOffer
};
