// src/hooks/useServiceForm.js

import { useState, useCallback } from 'react';
import { useUpdateService, useCreateService } from './useServices';

/**
 * Hook for managing service form state and submission
 */
export const useServiceForm = (initialService = null, onSuccess = null) => {
  // Normalize and enrich service data when editing
  const normalizedService = initialService ? {
    ...initialService,
    // Normalize category to just ID if it's an object
    category: typeof initialService.category === 'object' && initialService.category?._id 
      ? initialService.category._id 
      : (initialService.category || ''),
    // Ensure all nested objects have proper defaults
    availability: {
      days: initialService.availability?.days || [],
      startTime: initialService.availability?.startTime || '09:00',
      endTime: initialService.availability?.endTime || '17:00'
    },
    settings: {
      allowInstantBooking: initialService.settings?.allowInstantBooking ?? false,
      requireApproval: initialService.settings?.requireApproval ?? false,
      cancellationPolicy: initialService.settings?.cancellationPolicy || 'flexible'
    },
    bookingType: initialService.bookingType || 'available',
    maxBookings: initialService.maxBookings || 10,
    durationUnit: initialService.durationUnit || 'hour',
    // Parse tags if they exist
    tags: initialService.tags || [],
    // Initialize empty arrays for images (API returns URLs, not File objects)
    images: [],
    imagePreviews: initialService.images || [],
    image: null,
    imagePreview: initialService.images?.[0] || null,
    allowOffers: initialService.allowOffers ?? true,
    allowMessages: initialService.allowMessages ?? true
  } : null;

  const [formData, setFormData] = useState(
    normalizedService || {
      title: '',
      description: '',
      category: '',
      price: '',
      duration: '',
      durationUnit: 'hour', // hour, day, week, month
      bookingType: 'available', // on-demand, available, by-appointment
      maxBookings: 10,
      location: '',
      whatsappNumber: '',
      // Availability schedule (days and times)
      availability: {
        days: [],
        startTime: '09:00',
        endTime: '17:00'
      },
      // Service settings
      settings: {
        allowInstantBooking: false,
        requireApproval: false,
        cancellationPolicy: 'flexible' // flexible, moderate, strict
      },
      images: [],
      imagePreviews: [],
      image: null,
      imagePreview: null,
      tags: [],
      allowOffers: true,
      allowMessages: true
    }
  );

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const createServiceMutation = useCreateService();
  const updateServiceMutation = useUpdateService();

  /**
   * Handle input changes (supports nested fields like availability.startTime)
   */
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => {
      // Handle nested fields (e.g., "availability.days", "settings.allowInstantBooking")
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: type === 'checkbox' ? checked : value
          }
        };
      }
      
      // Handle regular fields
      return {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };
    });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  }, [errors]);

  /**
   * Handle image selection (single or multiple)
   */
  const handleImageChange = useCallback((e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages = [];
    const newPreviews = [];
    let hasError = false;

    // Process each selected file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          image: `Invalid format for ${file.name}. Use JPEG, PNG, WebP, or GIF.`
        }));
        hasError = true;
        break;
      }

      // Validate file size (5MB max per image)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: `${file.name} is too large. Max 5MB per image.`
        }));
        hasError = true;
        break;
      }

      newImages.push(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        newPreviews.push(event.target.result);
        
        // Update form data once all files are read
        if (newPreviews.length === newImages.length) {
          setFormData(prev => ({
            ...prev,
            images: newImages,
            imagePreviews: newPreviews,
            // Also keep first image in legacy fields for backward compatibility
            image: newImages[0] || null,
            imagePreview: newPreviews[0] || null
          }));
        }
      };
      reader.readAsDataURL(file);
    }

    if (!hasError) {
      setErrors(prev => ({
        ...prev,
        image: null
      }));
    }
  }, []);

  /**
   * Remove image from multiple uploads
   */
  const handleRemoveImage = useCallback((index) => {
    setFormData(prev => {
      const newImages = prev.images.filter((_, i) => i !== index);
      const newPreviews = prev.imagePreviews.filter((_, i) => i !== index);
      
      return {
        ...prev,
        images: newImages,
        imagePreviews: newPreviews,
        // Update legacy fields
        image: newImages[0] || null,
        imagePreview: newPreviews[0] || null
      };
    });
  }, []);

  /**
   * Clear all images
   */
  const handleClearImages = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      images: [],
      imagePreviews: [],
      image: null,
      imagePreview: null
    }));
    setErrors(prev => ({
      ...prev,
      image: null
    }));
  }, []);

  /**
   * Handle tag input
   */
  const handleAddTag = useCallback((tag) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  }, [formData.tags]);

  /**
   * Remove tag
   */
  const handleRemoveTag = useCallback((tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  }, []);

  /**
   * Handle availability day selection
   */
  const handleDayToggle = useCallback((day) => {
    setFormData(prev => {
      const days = prev.availability.days || [];
      const newDays = days.includes(day)
        ? days.filter(d => d !== day)
        : [...days, day];
      
      return {
        ...prev,
        availability: {
          ...prev.availability,
          days: newDays
        }
      };
    });
  }, []);

  /**
   * Validate form
   */
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Service title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    } else if (formData.description.length > 2000) {
      newErrors.description = 'Description must be less than 2000 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    } else if (parseFloat(formData.price) > 999999) {
      newErrors.price = 'Price is too high';
    }

    if (!formData.duration) {
      newErrors.duration = 'Duration is required';
    } else if (isNaN(formData.duration) || parseInt(formData.duration) <= 0) {
      newErrors.duration = 'Duration must be a positive number';
    }

    if (!formData.durationUnit) {
      newErrors.durationUnit = 'Duration unit is required';
    }

    if (!initialService && formData.images.length === 0 && !formData.image) {
      newErrors.image = 'At least one image is required for new services';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, initialService]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      // Prepare form data with image as multipart
      const formDataToSubmit = new FormData();
      
      // Add basic fields
      formDataToSubmit.append('title', formData.title);
      formDataToSubmit.append('description', formData.description);
      formDataToSubmit.append('category', formData.category);
      formDataToSubmit.append('price', parseFloat(formData.price));
      formDataToSubmit.append('duration', parseInt(formData.duration));
      formDataToSubmit.append('durationUnit', formData.durationUnit);
      formDataToSubmit.append('bookingType', formData.bookingType);
      formDataToSubmit.append('maxBookings', parseInt(formData.maxBookings));
      formDataToSubmit.append('whatsappNumber', formData.whatsappNumber);
      formDataToSubmit.append('location.address', formData.location);
      formDataToSubmit.append('tags', JSON.stringify(formData.tags));
      
      // Add nested availability object
      if (formData.availability) {
        // Add days as separate array items for FormData
        const days = formData.availability.days || [];
        days.forEach(day => {
          formDataToSubmit.append('availability.days', day);
        });
        formDataToSubmit.append('availability.startTime', formData.availability.startTime || '09:00');
        formDataToSubmit.append('availability.endTime', formData.availability.endTime || '17:00');
      }
      
      // Add nested settings object
      if (formData.settings) {
        formDataToSubmit.append('settings.allowInstantBooking', formData.settings.allowInstantBooking);
        formDataToSubmit.append('settings.requireApproval', formData.settings.requireApproval);
        formDataToSubmit.append('settings.cancellationPolicy', formData.settings.cancellationPolicy);
      }
      
      formDataToSubmit.append('allowOffers', formData.allowOffers);
      formDataToSubmit.append('allowMessages', formData.allowMessages);
      
      // Add multiple images if present
      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((image) => {
          formDataToSubmit.append('images', image);
        });
      } else if (formData.image) {
        // Fallback to single image for backward compatibility
        formDataToSubmit.append('images', formData.image);
      }

      if (initialService) {
        // Update existing service
        await updateServiceMutation.mutateAsync({
          id: initialService._id,
          updates: formDataToSubmit
        });
      } else {
        // Create new service
        const newService = await createServiceMutation.mutateAsync(formDataToSubmit);
        // Call success callback if provided
        if (onSuccess) {
          onSuccess(newService);
        }
      }
    } catch (error) {
      setErrors({
        submit: error.message || 'Failed to save service'
      });
    } finally {
      setSubmitting(false);
    }
  }, [formData, initialService, validateForm, createServiceMutation, updateServiceMutation, onSuccess]);

  /**
   * Reset form
   */
  const resetForm = useCallback(() => {
    setFormData(
      normalizedService || {
        title: '',
        description: '',
        category: '',
        price: '',
        duration: '',
        durationUnit: 'hour',
        bookingType: 'available',
        maxBookings: 10,
        location: '',
        whatsappNumber: '',
        availability: {
          days: [],
          startTime: '09:00',
          endTime: '17:00'
        },
        settings: {
          allowInstantBooking: false,
          requireApproval: false,
          cancellationPolicy: 'flexible'
        },
        images: [],
        imagePreviews: [],
        image: null,
        imagePreview: null,
        tags: [],
        allowOffers: true,
        allowMessages: true
      }
    );
    setErrors({});
  }, [normalizedService]);

  return {
    formData,
    errors,
    submitting,
    isCreating: createServiceMutation.isPending,
    isUpdating: updateServiceMutation.isPending,
    handleInputChange,
    handleImageChange,
    handleRemoveImage,
    handleClearImages,
    handleAddTag,
    handleRemoveTag,
    handleDayToggle,
    handleSubmit,
    resetForm,
    setFormData,
    setErrors
  };
};

export default useServiceForm;
