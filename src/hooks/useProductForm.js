import { useState, useCallback } from 'react';

/**
 * Hook for managing product form state
 */
export const useProductForm = (initialData = null) => {
  const [formData, setFormData] = useState(
    initialData || {
      name: '',
      description: '',
      price: '',
      category: '',
      condition: 'new',
      location: '',
      images: [],
      quantity: 1,
      tags: [],
      specifications: {},
      shop: '', // Add shop field for authorization
    }
  );

  const [errors, setErrors] = useState({});
  const [previewImages, setPreviewImages] = useState([]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  const handleImageChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));

    // Create previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...previews]);
  }, []);

  const removeImage = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setPreviewImages((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const handleSpecificationChange = useCallback((key, value) => {
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value,
      },
    }));
  }, []);

  const addTag = useCallback((tag) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
  }, [formData.tags]);

  const removeTag = useCallback((tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  }, []);

  const setFormErrors = useCallback((newErrors) => {
    setErrors(newErrors);
  }, []);

  const resetForm = useCallback(() => {
    setFormData(
      initialData || {
        name: '',
        description: '',
        price: '',
        category: '',
        condition: 'new',
        location: '',
        images: [],
        quantity: 1,
        tags: [],
        specifications: {},
        shop: '', // Add shop field
      }
    );
    setErrors({});
    setPreviewImages([]);
  }, [initialData]);

  return {
    formData,
    errors,
    previewImages,
    handleChange,
    handleImageChange,
    removeImage,
    handleSpecificationChange,
    addTag,
    removeTag,
    setFormErrors,
    resetForm,
    setFormData,
  };
};