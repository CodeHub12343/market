import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import * as offerService from '@/services/requestOffers';

const STALE_TIME = 5 * 60 * 1000; // 5 minutes
const CACHE_TIME = 10 * 60 * 1000; // 10 minutes

/**
 * Hook to fetch paginated request-based offers with automatic campus filtering
 * By default, only shows offers from user's campus
 * Can optionally show all campuses with allCampuses flag
 */
export const useRequestOffers = (page = 1, limit = 12, filters = {}) => {
  const { user } = useAuth();

  // Auto-add campus filtering
  const enhancedFilters = {
    ...filters,
    // Campus filtering is enforced by backend for authenticated users
  };

  return useQuery({
    queryKey: ['requestOffers', page, limit, enhancedFilters],
    queryFn: () => offerService.fetchRequestOffersPaginated(page, limit, enhancedFilters),
    staleTime: STALE_TIME,
    cacheTime: CACHE_TIME,
    enabled: !!user // Only fetch if authenticated
  });
};

/**
 * Hook to fetch single request-based offer by ID
 */
export const useRequestOffer = (id) => {
  return useQuery({
    queryKey: ['requestOffer', id],
    queryFn: () => offerService.fetchRequestOfferById(id),
    staleTime: STALE_TIME,
    cacheTime: CACHE_TIME,
    enabled: !!id
  });
};

/**
 * Hook to fetch user's sent offers
 */
export const useMySentOffers = () => {
  return useQuery({
    queryKey: ['mySentOffers'],
    queryFn: offerService.fetchMySentOffers,
    staleTime: STALE_TIME,
    cacheTime: CACHE_TIME
  });
};

/**
 * Hook to fetch offers for a specific request
 */
export const useOffersForRequest = (requestId) => {
  return useQuery({
    queryKey: ['offersForRequest', requestId],
    queryFn: () => offerService.fetchOffersForRequest(requestId),
    staleTime: STALE_TIME,
    cacheTime: CACHE_TIME,
    enabled: !!requestId
  });
};

/**
 * Hook to fetch all offers received by the current user
 */
export const useOffersReceivedByMe = (page = 1, limit = 12, filters = {}) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['offersReceivedByMe', page, limit, filters],
    queryFn: () => offerService.fetchOffersReceivedByMe(page, limit, filters),
    staleTime: STALE_TIME,
    cacheTime: CACHE_TIME,
    enabled: !!user // Only fetch if authenticated
  });
};

/**
 * Hook to search request-based offers
 */
export const useSearchRequestOffers = (query, filters = {}) => {
  return useQuery({
    queryKey: ['searchRequestOffers', query, filters],
    queryFn: () => offerService.searchRequestOffers(query, filters),
    staleTime: STALE_TIME,
    cacheTime: CACHE_TIME,
    enabled: !!query
  });
};

/**
 * Hook to fetch trending offers
 */
export const useTrendingRequestOffers = () => {
  return useQuery({
    queryKey: ['trendingRequestOffers'],
    queryFn: offerService.getTrendingRequestOffers,
    staleTime: STALE_TIME,
    cacheTime: CACHE_TIME
  });
};

/**
 * Hook to create a request-based offer
 */
export const useCreateRequestOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (offerData) => offerService.createRequestOffer(offerData),
    onSuccess: (data, variables) => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['requestOffers'] });
      queryClient.invalidateQueries({ queryKey: ['mySentOffers'] });
      queryClient.invalidateQueries({ queryKey: ['offersForRequest', variables.request] });
      
      // Also invalidate the hook from useRequests.js which uses different query key
      queryClient.invalidateQueries({ queryKey: ['requestOffers', variables.request] });
      
      console.log('Cache invalidated for request:', variables.request);
    }
  });
};

/**
 * Hook to update a request-based offer
 */
export const useUpdateRequestOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updateData }) => offerService.updateRequestOffer(id, updateData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['requestOffer', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['requestOffers'] });
      queryClient.invalidateQueries({ queryKey: ['mySentOffers'] });
    }
  });
};

/**
 * Hook to delete a request-based offer
 */
export const useDeleteRequestOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => offerService.deleteRequestOffer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requestOffers'] });
      queryClient.invalidateQueries({ queryKey: ['mySentOffers'] });
    }
  });
};

/**
 * Hook to accept a request-based offer
 */
export const useAcceptRequestOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => offerService.acceptRequestOffer(id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['requestOffer', variables] });
      queryClient.invalidateQueries({ queryKey: ['requestOffers'] });
      queryClient.invalidateQueries({ queryKey: ['mySentOffers'] });
    }
  });
};

/**
 * Hook to reject a request-based offer
 */
export const useRejectRequestOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => offerService.rejectRequestOffer(id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['requestOffer', variables] });
      queryClient.invalidateQueries({ queryKey: ['requestOffers'] });
    }
  });
};

export default {
  useRequestOffers,
  useRequestOffer,
  useMySentOffers,
  useOffersForRequest,
  useSearchRequestOffers,
  useTrendingRequestOffers,
  useCreateRequestOffer,
  useUpdateRequestOffer,
  useDeleteRequestOffer,
  useAcceptRequestOffer,
  useRejectRequestOffer
};
