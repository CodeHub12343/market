import { useState, useCallback } from 'react';

/**
 * Custom hook for managing request form state
 */
export const useRequestForm = (initialRequest = null, userCampus = null) => {
  const [formData, setFormData] = useState({
    title: initialRequest?.title || '',
    description: initialRequest?.description || '',
    category: initialRequest?.category || '', // Empty string for category selection
    budget: {
      min: initialRequest?.budget?.min || initialRequest?.desiredPrice?.min || '',
      max: initialRequest?.budget?.max || initialRequest?.desiredPrice?.max || ''
    },
    location: initialRequest?.location || {
      address: '',
      campus: userCampus || ''
    },
    requiredDate: initialRequest?.requiredDate || '',
    documents: initialRequest?.documents || [],
    tags: initialRequest?.tags || [],
    specifications: initialRequest?.specifications || '',
    whatsappNumber: initialRequest?.whatsappNumber || ''
  });

  const [errors, setErrors] = useState({});
  const [tag, setTag] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
    // Clear error
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const addTag = useCallback(() => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
      setTag('');
    }
  }, [tag, formData.tags]);

  const removeTag = useCallback((tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tagToRemove)
    }));
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.budget.min || formData.budget.min <= 0) {
      newErrors.budgetMin = 'Minimum budget is required and must be positive';
    }

    if (!formData.budget.max || formData.budget.max <= 0) {
      newErrors.budgetMax = 'Maximum budget is required and must be positive';
    }

    if (formData.budget.min && formData.budget.max && parseFloat(formData.budget.min) > parseFloat(formData.budget.max)) {
      newErrors.budgetMax = 'Maximum budget must be greater than minimum budget';
    }

    if (!formData.location.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.location.campus) {
      newErrors.campus = 'Campus is required';
    }

    if (!formData.requiredDate) {
      newErrors.requiredDate = 'Required date is required';
    } else {
      const selectedDate = new Date(formData.requiredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.requiredDate = 'Required date must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'general',
      budget: { min: '', max: '' },
      location: { address: '', campus: userCampus || '' },
      requiredDate: '',
      documents: [],
      tags: [],
      specifications: '',
      whatsappNumber: ''
    });
    setTag('');
    setErrors({});
  };

  return {
    formData,
    handleInputChange,
    handleNestedChange,
    validateForm,
    errors,
    resetForm,
    tag,
    setTag,
    addTag,
    removeTag
  };
};

export default useRequestForm;