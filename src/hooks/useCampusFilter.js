'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

/**
 * Hook to manage campus filtering across listings
 * Provides:
 * - Current user's campus
 * - Campus toggle state (show only user's campus vs all campuses)
 * - Campus parameter for API calls
 * - All available campuses list
 */
export const useCampusFilter = () => {
  const { user } = useAuth();
  const [showAllCampuses, setShowAllCampuses] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState(null);

  // Initialize with user's campus
  useEffect(() => {
    if (user?.campus?._id) {
      setSelectedCampus(user.campus._id);
    }
  }, [user?.campus?._id]);

  /**
   * Get filter parameters for API calls
   * @returns {Object} Filter object with allCampuses and campus parameters
   */
  const getFilterParams = () => {
    if (showAllCampuses) {
      return {
        allCampuses: 'true',
        // Only include campus if user explicitly selected one (optional)
        ...(selectedCampus && { campus: selectedCampus })
      };
    }
    
    // When NOT showing all campuses, DON'T send campus param
    // Let backend use req.user.campus from JWT authentication
    return {
      allCampuses: 'false'
      // ❌ DO NOT include campus here - backend will filter by req.user.campus
    };
  };

  /**
   * Toggle between showing only user's campus vs all campuses
   */
  const toggleAllCampuses = () => {
    setShowAllCampuses(!showAllCampuses);
  };

  /**
   * Change selected campus filter when viewing all campuses
   */
  const handleCampusChange = (campusId) => {
    setSelectedCampus(campusId);
  };

  return {
    userCampus: user?.campus,
    showAllCampuses,
    selectedCampus,
    toggleAllCampuses,
    handleCampusChange,
    getFilterParams,
    campusName: user?.campus?.name || 'Unknown Campus'
  };
};

export default useCampusFilter;
