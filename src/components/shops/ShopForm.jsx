'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useCreateShop, useUpdateShop } from '@/hooks/useShops';
import { useAuth } from '@/hooks/useAuth';
import ErrorAlert from '@/components/common/ErrorAlert';
import SuccessAlert from '@/components/common/SuccessAlert';
import { Store, FileText, MapPin, Tag, Building2, MessageSquare, Zap, Loader, Upload, X } from 'lucide-react';

/* ============ FORM CONTAINER ============ */
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (min-width: 768px) {
    gap: 24px;
  }
`;

/* ============ FORM GROUP ============ */
const FormGroup = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: #aaa;
  font-size: 18px;
  display: flex;
  align-items: center;
  pointer-events: none;

  svg {
    width: 18px;
    height: 18px;
  }
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
  display: block;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 16px 50px 16px 50px;
  border: none;
  background: #f8f8f8;
  border-radius: 12px;
  font-size: 15px;
  color: #333;
  outline: none;
  transition: all 0.3s ease;
  font-family: inherit;

  &::placeholder {
    color: #aaa;
  }

  &:focus {
    background: #ffffff;
    box-shadow: 0 0 0 2px rgba(26, 26, 26, 0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (min-width: 768px) {
    padding: 16px 50px 16px 50px;
    font-size: 15px;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 16px 50px 16px 50px;
  border: none;
  background: #f8f8f8;
  border-radius: 12px;
  font-size: 15px;
  color: #333;
  outline: none;
  transition: all 0.3s ease;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;

  &::placeholder {
    color: #aaa;
  }

  &:focus {
    background: #ffffff;
    box-shadow: 0 0 0 2px rgba(26, 26, 26, 0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (min-width: 768px) {
    padding: 16px 50px 16px 50px;
    font-size: 15px;
    min-height: 140px;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 16px 50px 16px 50px;
  border: none;
  background: #f8f8f8;
  border-radius: 12px;
  font-size: 15px;
  color: #333;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;

  option {
    background: white;
    color: #333;
  }

  &:focus {
    background: #ffffff;
    box-shadow: 0 0 0 2px rgba(26, 26, 26, 0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (min-width: 768px) {
    padding: 16px 50px 16px 50px;
    font-size: 15px;
  }
`;

const ErrorText = styled.p`
  color: #dc2626;
  font-size: 12px;
  margin: 0;
  padding-top: 4px;

  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

const CharCount = styled.small`
  color: #999;
  font-size: 11px;
  margin-top: 4px;
  display: block;

  @media (min-width: 768px) {
    font-size: 12px;
  }
`;

/* ============ FIELD GRID ============ */
const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
`;

/* ============ FORM SECTION ============ */
const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (min-width: 768px) {
    gap: 24px;
  }

  & + & {
    padding-top: 20px;
    border-top: 1px solid #f0f0f0;

    @media (min-width: 768px) {
      padding-top: 24px;
    }
  }
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    width: 18px;
    height: 18px;
  }

  @media (min-width: 768px) {
    font-size: 15px;
  }
`;

/* ============ CHECKBOX GROUP ============ */
const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  font-weight: 500;

  input {
    cursor: pointer;
    width: 18px;
    height: 18px;
    accent-color: #1a1a1a;
  }

  &:hover {
    color: #1a1a1a;
  }

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

/* ============ BUTTON GROUP ============ */
const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-top: 12px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-top: 16px;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 16px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background-color: #555;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  svg {
    width: 16px;
    height: 16px;
    animation: spin 1s linear infinite;

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  }

  @media (min-width: 768px) {
    padding: 18px;
    font-size: 15px;
  }
`;

const CancelButton = styled.button`
  width: 100%;
  padding: 16px;
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #e5e5e5;
  border-radius: 30px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background-color: #efefef;
    border-color: #d0d0d0;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (min-width: 768px) {
    padding: 18px;
    font-size: 15px;
  }
`;

/* ============ ALERT MESSAGES ============ */
const AlertContainer = styled.div`
  margin-bottom: 16px;

  @media (min-width: 768px) {
    margin-bottom: 20px;
  }
`;

/* ============ FILE UPLOAD ============ */
const FileInputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 24px 16px;
  background: #f8f8f8;
  border: 2px dashed #e5e5e5;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  color: #666;

  &:hover {
    background: #ffffff;
    border-color: #1a1a1a;
    color: #1a1a1a;
  }

  svg {
    width: 18px;
    height: 18px;
  }

  @media (min-width: 768px) {
    padding: 28px 16px;
  }
`;

const ImagePreviewContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 200px;
  aspect-ratio: 1;
  margin-top: 12px;
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  background: #f5f5f5;
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  background: rgba(220, 38, 38, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #dc2626;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const FileHelpText = styled.small`
  color: #999;
  font-size: 12px;
  display: block;

  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

export default function ShopForm({ initialData, onSuccess, onCancel }) {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    location: initialData?.location || '',
    category: initialData?.category || '',
    campus: initialData?.campus?._id || user?.campus?._id || '',
    whatsappNumber: initialData?.whatsappNumber || '',
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(initialData?.logo || null);

  const createMutation = useCreateShop();
  const updateMutation = useUpdateShop();

  const isLoading = createMutation.isPending || updateMutation.isPending;
  const error = createMutation.error || updateMutation.error;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Shop name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Shop name must be at least 3 characters';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Shop name cannot exceed 100 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }

    if (formData.location && formData.location.length > 200) {
      newErrors.location = 'Location cannot exceed 200 characters';
    }

    // Check campus is provided for new shops
    if (!initialData?._id && (!formData.campus || formData.campus.trim() === '')) {
      newErrors.campus = 'Campus is required. Please ensure you are logged in with a campus assigned.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    
    console.log('handleImageChange called - file:', file ? { name: file.name, type: file.type, size: file.size } : 'none');
    
    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('File selected:', file.name, file.type, file.size);
    console.log('File is File object:', file instanceof File);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error('Invalid file type:', file.type);
      setErrors(prev => ({
        ...prev,
        logo: 'Please select a valid image file (PNG, JPG, GIF)',
      }));
      setLogoFile(null);
      setLogoPreview(null);
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.error('File too large:', file.size);
      setErrors(prev => ({
        ...prev,
        logo: 'Image must be smaller than 5MB',
      }));
      setLogoFile(null);
      setLogoPreview(null);
      return;
    }

    console.log('File validation passed');

    // Clear previous errors
    setErrors(prev => ({
      ...prev,
      logo: '',
    }));

    // Store the file - make sure it's a File object!
    console.log('Setting logoFile:', file.name, 'Type:', file.constructor.name);
    setLogoFile(file);
    console.log('logoFile state updated, file:', file.name);

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      console.log('FileReader onload completed');
      setLogoPreview(event.target?.result);
    };
    reader.onerror = () => {
      console.error('FileReader error');
      setErrors(prev => ({
        ...prev,
        logo: 'Failed to read file',
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Form submit - user:', user, 'formData:', formData);
    console.log('Form submit - logoFile:', logoFile);

    if (!validateForm()) {
      return;
    }

    try {
      if (initialData?._id) {
        // Update existing shop
        console.log('Updating shop...');
        const result = await updateMutation.mutateAsync({
          id: initialData._id,
          shopData: formData,
        });
        console.log('Shop updated successfully:', result);
      } else {
        // Create new shop
        // Ensure logo is NOT in formData - it should only be in logoFile
        const cleanFormData = { ...formData };
        delete cleanFormData.logo; // Remove logo field if it exists
        
        console.log('Creating shop with shopData:', cleanFormData, 'logoFile:', logoFile);
        const result = await createMutation.mutateAsync({
          shopData: cleanFormData,
          logoFile: logoFile,
        });
        console.log('Shop created successfully:', result);
      }

      console.log('Setting showSuccess to true');
      setShowSuccess(true);
      console.log('Calling onSuccess after 2 seconds');
      setTimeout(() => {
        console.log('Calling onSuccess callback');
        onSuccess?.();
      }, 2000);
    } catch (err) {
      console.error('Form submission error:', err);
      setErrors(prev => ({
        ...prev,
        submit: err?.message || 'Failed to create shop. Please try again.'
      }));
    }
  };

  return (
    <>
      {error && (
        <AlertContainer>
          <ErrorAlert $show={!!error}>
            {error?.message || 'An error occurred'}
          </ErrorAlert>
        </AlertContainer>
      )}

      {showSuccess && (
        <AlertContainer>
          <SuccessAlert $show={true}>
            Shop {initialData?._id ? 'updated' : 'created'} successfully!
          </SuccessAlert>
        </AlertContainer>
      )}

      <Form onSubmit={handleSubmit}>
        {/* SHOP DETAILS SECTION */}
        <FormSection>
          <SectionTitle>
            <Store size={18} />
            Shop Details
          </SectionTitle>

          <FormGroup>
            <Label htmlFor="name">Shop Name *</Label>
            <IconWrapper>
              <Store size={18} />
            </IconWrapper>
            <Input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="My Amazing Shop"
              disabled={isLoading}
              maxLength={100}
            />
            {errors.name && <ErrorText>{errors.name}</ErrorText>}
            <CharCount>{formData.name.length}/100 characters</CharCount>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="description">Description *</Label>
            <IconWrapper>
              <FileText size={18} />
            </IconWrapper>
            <TextArea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell customers about your shop. What do you sell? What makes you unique?"
              disabled={isLoading}
              maxLength={500}
            />
            {errors.description && <ErrorText>{errors.description}</ErrorText>}
            <CharCount>{formData.description.length}/500 characters</CharCount>
          </FormGroup>

          <FieldGrid>
            <FormGroup>
              <Label htmlFor="location">Location</Label>
              <IconWrapper>
                <MapPin size={18} />
              </IconWrapper>
              <Input
                id="location"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Campus location or booth number"
                disabled={isLoading}
                maxLength={200}
              />
              {errors.location && <ErrorText>{errors.location}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
              <IconWrapper>
                <MessageSquare size={18} />
              </IconWrapper>
              <Input
                id="whatsappNumber"
                type="text"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleChange}
                placeholder="+234 8012345678"
                disabled={isLoading}
                maxLength={30}
              />
              {errors.whatsappNumber && <ErrorText>{errors.whatsappNumber}</ErrorText>}
              <CharCount>Optional - Buyers can message you on WhatsApp</CharCount>
            </FormGroup>
          </FieldGrid>

          <FieldGrid>
            <FormGroup>
              <Label htmlFor="category">Category</Label>
              <IconWrapper>
                <Tag size={18} />
              </IconWrapper>
              <Select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={isLoading}
              >
                <option value="">Select a category</option>
                <option value="electronics">Electronics</option>
                <option value="books">Books & Stationery</option>
                <option value="fashion">Fashion & Accessories</option>
                <option value="food">Food & Beverages</option>
                <option value="services">Services</option>
                <option value="other">Other</option>
              </Select>
            </FormGroup>
          </FieldGrid>
        </FormSection>

        {/* LOGO SECTION */}
        <FormSection>
          <SectionTitle>
            <Upload size={18} />
            Shop Logo
          </SectionTitle>

          <FormGroup>
            <Label htmlFor="logo">Logo Image</Label>
            <FileInputWrapper>
              <HiddenFileInput
                id="logo"
                name="logo"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isLoading}
              />
              <FileInputLabel htmlFor="logo">
                <Upload size={18} />
                Click to upload or drag and drop
              </FileInputLabel>
              <FileHelpText>PNG, JPG, GIF up to 5MB</FileHelpText>
            </FileInputWrapper>
            {errors.logo && <ErrorText>{errors.logo}</ErrorText>}
            {logoPreview && (
              <ImagePreviewContainer>
                <ImagePreview src={logoPreview} alt="Shop logo preview" />
                <RemoveImageButton
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isLoading}
                >
                  <X size={16} />
                </RemoveImageButton>
              </ImagePreviewContainer>
            )}
          </FormGroup>
        </FormSection>

        {/* CAMPUS SECTION */}
        {!initialData?._id && (
          <FormSection>
            <SectionTitle>
              <Building2 size={18} />
              Campus Information
            </SectionTitle>

            <FormGroup>
              <Label htmlFor="campus">Campus *</Label>
              <IconWrapper>
                <Building2 size={18} />
              </IconWrapper>
              <Input
                id="campus"
                type="text"
                name="campus"
                value={formData.campus}
                disabled={true}
                placeholder="Your campus (auto-filled)"
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
              {errors.campus && <ErrorText>{errors.campus}</ErrorText>}
              <CharCount>Your campus is automatically assigned from your account</CharCount>
            </FormGroup>
          </FormSection>
        )}

        {/* PREFERENCES SECTION */}
        <FormSection>
          <SectionTitle>
            <Zap size={18} />
            Shop Preferences
          </SectionTitle>

          <CheckboxGroup>
            <CheckboxLabel>
              <input
                type="checkbox"
                name="allowOffers"
                checked={formData.allowOffers || false}
                onChange={handleChange}
                disabled={isLoading}
              />
              <div>
                <div>Allow customers to make offers</div>
              </div>
            </CheckboxLabel>
            <CheckboxLabel>
              <input
                type="checkbox"
                name="allowMessages"
                checked={formData.allowMessages || false}
                onChange={handleChange}
                disabled={isLoading}
              />
              <div>
                <div>Allow direct messages</div>
              </div>
            </CheckboxLabel>
          </CheckboxGroup>
        </FormSection>

        {/* BUTTONS */}
        <ButtonGroup>
          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader size={16} />
                {initialData?._id ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              initialData?._id ? 'Update Shop' : 'Create Shop'
            )}
          </SubmitButton>
          <CancelButton
            type="button"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </CancelButton>
        </ButtonGroup>
      </Form>
    </>
  );
}