import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as applicationsService from '@/services/roommateApplications'

const STALE_TIME = 3 * 60 * 1000 // 3 minutes
const CACHE_TIME = 10 * 60 * 1000 // 10 minutes

/**
 * Hook to fetch user's roommate applications
 */
export const useMyApplications = (page = 1, limit = 12) => {
  return useQuery({
    queryKey: ['myRoommateApplications', page, limit],
    queryFn: () => applicationsService.fetchMyApplications(page, limit),
    staleTime: STALE_TIME,
    cacheTime: CACHE_TIME
  })
}

/**
 * Hook to apply to roommate listing
 */
export const useApplyToRoommate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ roommateId, applicationData }) =>
      applicationsService.applyToRoommate(roommateId, applicationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myRoommateApplications'] })
    }
  })
}

/**
 * Hook to fetch application details
 */
export const useApplicationDetails = (applicationId) => {
  return useQuery({
    queryKey: ['roommateApplication', applicationId],
    queryFn: () => applicationsService.fetchApplicationById(applicationId),
    staleTime: STALE_TIME,
    cacheTime: CACHE_TIME,
    enabled: !!applicationId
  })
}

/**
 * Hook to update application status
 */
export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ applicationId, status, message }) =>
      applicationsService.updateApplicationStatus(applicationId, status, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roommateApplications'] })
      queryClient.invalidateQueries({ queryKey: ['myRoommateApplications'] })
    }
  })
}

/**
 * Hook to withdraw application
 */
export const useWithdrawApplication = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (applicationId) => applicationsService.withdrawApplication(applicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myRoommateApplications'] })
    }
  })
}

/**
 * Hook to fetch roommate's applications
 */
export const useRoommateApplications = (roommateId, status = 'pending') => {
  return useQuery({
    queryKey: ['roommateApplications', roommateId, status],
    queryFn: () => applicationsService.fetchRoommateApplications(roommateId, status),
    staleTime: STALE_TIME,
    cacheTime: CACHE_TIME,
    enabled: !!roommateId
  })
}

export default {
  useMyApplications,
  useApplyToRoommate,
  useApplicationDetails,
  useUpdateApplicationStatus,
  useWithdrawApplication,
  useRoommateApplications
}
