import { useState } from 'react';

/**
 * Custom hook for managing request-based offer form state
 */
export const useOfferForm = (initialOffer = null) => {
  const [formData, setFormData] = useState({
    request: initialOffer?.request?._id || '',
    amount: initialOffer?.amount || '',
    message: initialOffer?.message || '',
    availability: initialOffer?.availability || 'immediate'
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || '' : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Request can come from props, so we don't require it in formData
    // if (!formData.request) {
    //   newErrors.request = 'Request selection is required';
    // }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Offer message is required';
    }

    if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    if (formData.message.length > 500) {
      newErrors.message = 'Message cannot exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      request: '',
      amount: '',
      message: '',
      availability: 'immediate'
    });
    setErrors({});
  };

  const messageCharCount = formData.message.length;
  const messageCharLimit = 500;

  return {
    formData,
    handleInputChange,
    validateForm,
    errors,
    resetForm,
    messageCharCount,
    messageCharLimit
  };
};

export default useOfferForm;
