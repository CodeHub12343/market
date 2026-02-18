import { useState, useCallback } from 'react';

/**
 * Hook for managing hostel form state
 */
export const useHostelForm = (initialData = null) => {
  const [formData, setFormData] = useState(
    initialData || {
      name: '',
      description: '',
      address: '',
      campus: '',
      price: '',
      roomType: 'shared', // shared, single, double
      capacity: '',
      category: '', // ← Added category field
      amenities: [],
      image: null,
      phoneNumber: '',
      whatsappNumber: '',
      website: '',
      rules: '',
      verificationStatus: 'pending',
    }
  );

  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(
    initialData?.images || initialData?.image || null
  );

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
    const files = e.target.files;
    if (files && files.length > 0) {
      // Store all files
      const fileArray = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        image: fileArray, // Store as array
      }));

      // Create previews for all images
      const previews = fileArray.map(file => URL.createObjectURL(file));
      setPreviewImage(previews);
    }
  }, []);

  const removeImage = useCallback((indexOrCallback) => {
    // Handle both index (for multiple) and no param (for single)
    if (typeof indexOrCallback === 'number') {
      // Multiple images - remove by index
      if (Array.isArray(previewImage)) {
        const newPreviews = previewImage.filter((_, idx) => idx !== indexOrCallback);
        newPreviews.forEach(preview => {
          if (preview.startsWith('blob:')) {
            URL.revokeObjectURL(preview);
          }
        });
        setPreviewImage(newPreviews.length > 0 ? newPreviews : null);
        
        setFormData((prev) => {
          if (Array.isArray(prev.image)) {
            const newImages = prev.image.filter((_, idx) => idx !== indexOrCallback);
            return {
              ...prev,
              image: newImages.length > 0 ? newImages : null,
            };
          }
          return prev;
        });
      }
    } else {
      // Single image - remove all
      if (previewImage) {
        if (Array.isArray(previewImage)) {
          previewImage.forEach(preview => {
            if (preview.startsWith('blob:')) {
              URL.revokeObjectURL(preview);
            }
          });
        } else if (previewImage.startsWith('blob:')) {
          URL.revokeObjectURL(previewImage);
        }
      }
      setFormData((prev) => ({
        ...prev,
        image: null,
      }));
      setPreviewImage(null);
    }
  }, [previewImage]);

  const addAmenity = useCallback((amenity) => {
    if (amenity && !formData.amenities.includes(amenity)) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, amenity],
      }));
    }
  }, [formData.amenities]);

  const removeAmenity = useCallback((amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((a) => a !== amenity),
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
        address: '',
        campus: '',
        price: '',
        roomType: 'shared',
        capacity: '',
        category: '',
        amenities: [],
        image: null,
        phoneNumber: '',
        website: '',
        rules: '',
        verificationStatus: 'pending',
      }
    );
    setErrors({});
    if (previewImage && previewImage.startsWith('blob:')) {
      URL.revokeObjectURL(previewImage);
    }
    setPreviewImage(null);
  }, [initialData, previewImage]);

  return {
    formData,
    errors,
    previewImage,
    handleChange,
    handleImageChange,
    removeImage,
    addAmenity,
    removeAmenity,
    setFormErrors,
    resetForm,
    setFormData,
  };
};
