import { useQuery } from '@tanstack/react-query';
import { getCampuses } from '@/services/campus';

/**
 * Hook for fetching all campuses
 */
export const useCampuses = () => {
  return useQuery({
    queryKey: ['campuses'],
    queryFn: async () => {
      try {
        const response = await getCampuses();
        console.log('useCampuses - Full response:', response);
        
        const data = response.data;
        console.log('useCampuses - data:', data);
        
        // If response has data.campuses array
        if (data.campuses && Array.isArray(data.campuses)) {
          console.log('useCampuses - Returning data.campuses:', data.campuses);
          return data.campuses;
        }
        
        // If response has data.categories array (from categories endpoint)
        if (data.categories && Array.isArray(data.categories)) {
          console.log('useCampuses - Returning data.categories:', data.categories);
          return data.categories;
        }
        
        // If response is directly an array
        if (Array.isArray(data)) {
          console.log('useCampuses - Returning direct array:', data);
          return data;
        }
        
        console.log('useCampuses - No valid array found, returning empty array');
        return [];
      } catch (error) {
        console.error('useCampuses - Error fetching campuses:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
    retry: 1,
  });
};

/**
 * Alias hook for consistency with other listing-based hooks
 * Provides all available campuses for filtering UI
 */
export const useAllCampuses = () => {
  return useCampuses();
};

export default useCampuses;
