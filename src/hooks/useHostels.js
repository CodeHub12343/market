import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import * as hostelService from '@/services/hostels';

/**
 * Hook for fetching all hostels with automatic campus filtering
 * By default, only shows hostels from user's campus
 * Can optionally show all campuses with allCampuses flag
 */
export const useAllHostels = (filters = {}) => {
  const { user } = useAuth();

  // Auto-add campus filtering
  const enhancedFilters = {
    ...filters,
    // Campus filtering is enforced by backend for authenticated users
  };

  return useQuery({
    queryKey: ['hostels', enhancedFilters],
    queryFn: () => hostelService.fetchHostelsPaginated(
      enhancedFilters.page || 1,
      enhancedFilters.limit || 12,
      enhancedFilters
    ),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!user, // Only fetch if authenticated
  });
};

/**
 * Hook for fetching hostel by ID
 */
export const useHostel = (id, enabled = true) => {
  return useQuery({
    queryKey: ['hostels', id],
    queryFn: async () => {
      try {
        const data = await hostelService.fetchHostelById(id);
        console.log('Fetched hostel data:', data);
        return data;
      } catch (error) {
        console.error('Error in useHostel hook:', error);
        throw error;
      }
    },
    enabled: !!id && enabled,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
  });
};

/**
 * Hook for fetching user's hostels
 */
export const useMyHostels = (params = {}) => {
  return useQuery({
    queryKey: ['myHostels', params],
    queryFn: () => hostelService.fetchMyHostels(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook for creating hostel
 */
export const useCreateHostel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ hostelData, image }) =>
      hostelService.createHostel(hostelData, image),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['hostels'] });
      queryClient.invalidateQueries({ queryKey: ['myHostels'] });
      // Store creator info in localStorage for ownership verification
      if (data._id) {
        const creatorMap = JSON.parse(localStorage.getItem('hostelCreators') || '{}');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user._id) {
          creatorMap[data._id] = user._id;
          localStorage.setItem('hostelCreators', JSON.stringify(creatorMap));
        }
      }
    },
  });
};

/**
 * Hook for updating hostel
 */
export const useUpdateHostel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, hostelData, image }) =>
      hostelService.updateHostel(id, hostelData, image),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['hostels'] });
      queryClient.invalidateQueries({ queryKey: ['hostels', data._id] });
      queryClient.invalidateQueries({ queryKey: ['myHostels'] });
    },
  });
};

/**
 * Hook for deleting hostel
 */
export const useDeleteHostel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => hostelService.deleteHostel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hostels'] });
      queryClient.invalidateQueries({ queryKey: ['myHostels'] });
    },
  });
};

/**
 * Hook for searching hostels
 */
export const useSearchHostels = (query, filters = {}) => {
  return useQuery({
    queryKey: ['searchHostels', query, filters],
    queryFn: () => hostelService.searchHostels(query, filters),
    enabled: !!query,
  });
};

/**
 * Hook for hostel stats
 */
export const useHostelStats = () => {
  return useQuery({
    queryKey: ['hostelStats'],
    queryFn: hostelService.getHostelStats,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};

/**
 * Hook for uploading hostel image
 */
export const useUploadHostelImage = () => {
  return useMutation({
    mutationFn: (file) => hostelService.uploadHostelImage(file),
  });
};
