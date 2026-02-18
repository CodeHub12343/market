import { useState, useEffect } from 'react';

/**
 * Hook for managing event form state
 */
export const useEventForm = (initialEvent = null, userCampus = null) => {
  // Extract campus ID from userCampus (could be object or string)
  const campusId = typeof userCampus === 'object' ? userCampus?._id : userCampus;

  const [formData, setFormData] = useState({
    title: initialEvent?.title || '',
    description: initialEvent?.description || '',
    date: initialEvent?.date ? new Date(initialEvent.date).toISOString().slice(0, 16) : '',
    endDate: initialEvent?.endDate ? new Date(initialEvent.endDate).toISOString().slice(0, 16) : '',
    location: initialEvent?.location || '',
    campus: initialEvent?.campus?._id || initialEvent?.campus || campusId || '',
    category: initialEvent?.category || 'academic',
    visibility: initialEvent?.visibility || 'public',
    capacity: initialEvent?.capacity || '',
    tags: initialEvent?.tags || [],
    registrationRequired: initialEvent?.registrationRequired || false,
    registrationDeadline: initialEvent?.registrationDeadline ? new Date(initialEvent.registrationDeadline).toISOString().slice(0, 16) : '',
    requirements: initialEvent?.requirements || '',
    contactInfo: {
      email: initialEvent?.contactInfo?.email || '',
      phone: initialEvent?.contactInfo?.phone || '',
      website: initialEvent?.contactInfo?.website || ''
    },
    settings: {
      allowComments: initialEvent?.settings?.allowComments ?? true,
      allowRatings: initialEvent?.settings?.allowRatings ?? true,
      allowSharing: initialEvent?.settings?.allowSharing ?? true,
      sendReminders: initialEvent?.settings?.sendReminders ?? true,
      reminderDays: initialEvent?.settings?.reminderDays || 2,
      autoArchive: initialEvent?.settings?.autoArchive ?? true,
      archiveAfterDays: initialEvent?.settings?.archiveAfterDays || 30
    },
    timezone: initialEvent?.timezone || 'UTC'
  });

  const [previewBanner, setPreviewBanner] = useState(initialEvent?.bannerUrl || null);
  const [bannerFile, setBannerFile] = useState(null);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleTagsChange = (e) => {
    const value = e.target.value;
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setFormData(prev => ({
      ...prev,
      tags
    }));
  };

  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewBanner(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBanner = () => {
    setBannerFile(null);
    setPreviewBanner(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.date) {
      newErrors.date = 'Event date is required';
    }

    if (formData.endDate && new Date(formData.endDate) <= new Date(formData.date)) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.campus) {
      newErrors.campus = 'Campus is required';
    }

    if (formData.registrationRequired && !formData.registrationDeadline) {
      newErrors.registrationDeadline = 'Registration deadline is required when registration is enabled';
    }

    if (formData.registrationDeadline && new Date(formData.registrationDeadline) >= new Date(formData.date)) {
      newErrors.registrationDeadline = 'Registration deadline must be before event date';
    }

    if (formData.capacity && formData.capacity < 1) {
      newErrors.capacity = 'Capacity must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      endDate: '',
      location: '',
      campus: '',
      category: 'academic',
      visibility: 'public',
      capacity: '',
      tags: [],
      registrationRequired: false,
      registrationDeadline: '',
      requirements: '',
      contactInfo: {
        email: '',
        phone: '',
        website: ''
      },
      settings: {
        allowComments: true,
        allowRatings: true,
        allowSharing: true,
        sendReminders: true,
        reminderDays: 2,
        autoArchive: true,
        archiveAfterDays: 30
      },
      timezone: 'UTC'
    });
    setBannerFile(null);
    setPreviewBanner(null);
    setErrors({});
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    handleNestedChange,
    handleTagsChange,
    previewBanner,
    bannerFile,
    handleBannerChange,
    removeBanner,
    validateForm,
    errors,
    setErrors,
    resetForm
  };
};
