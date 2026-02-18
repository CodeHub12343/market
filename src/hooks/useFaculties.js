import { useQuery } from '@tanstack/react-query';
import * as facultyService from '@/services/faculties';

const FACULTIES_QUERY_KEY = 'faculties';
const DEPARTMENTS_QUERY_KEY = 'departments';

/**
 * Fetch all faculties
 */
export const useFaculties = (enabled = true) => {
  return useQuery({
    queryKey: [FACULTIES_QUERY_KEY],
    queryFn: () => facultyService.fetchFaculties(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled,
  });
};

/**
 * Fetch departments by faculty ID
 */
export const useDepartmentsByFaculty = (facultyId, enabled = true) => {
  return useQuery({
    queryKey: [DEPARTMENTS_QUERY_KEY, facultyId],
    queryFn: () => facultyService.fetchDepartmentsByFaculty(facultyId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: enabled && !!facultyId,
  });
};

export default {
  useFaculties,
  useDepartmentsByFaculty,
};
