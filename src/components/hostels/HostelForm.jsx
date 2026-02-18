'use client';

import { useHostelForm } from '@/hooks/useHostelForm';
import { useCreateHostel, useUpdateHostel } from '@/hooks/useHostels';
import { useAuth } from '@/hooks/useAuth';
import { useHostelCategories } from '@/hooks/useCategories';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorAlert from '@/components/common/ErrorAlert';
import styled from 'styled-components';
import { Home, MapPin, DollarSign, Users, Type, Phone, Globe, Plus, X, Upload, AlertCircle } from 'lucide-react';

// ===== FORM STYLES =====
const FormContainer = styled.form`
  width: 100%;
  background: transparent;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 768px) {
    gap: 20px;
  }

  @media (min-width: 1024px) {
    gap: 24px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (min-width: 768px) {
    font-size: 18px;
    margin-bottom: 16px;
  }
`;

const SectionDivider = styled.div`
  height: 1px;
  background: #f0f0f0;
  margin: 24px 0 16px 0;

  @media (min-width: 768px) {
    margin: 32px 0 20px 0;
  }
`;

// ===== FORM GROUP =====
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const LabelWithIcon = styled(Label)`
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    width: 14px;
    height: 14px;
    color: #666;
  }
`;

// ===== INPUT STYLES =====
const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 16px;
  pointer-events: none;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 16px 50px 16px 50px;
  border: none;
  background: #f8f8f8;
  border-radius: 12px;
  font-size: 14px;
  color: #333;
  outline: none;
  transition: all 0.2s ease;
  font-family: inherit;

  &::placeholder {
    color: #aaa;
  }

  &:focus {
    background: #ffffff;
    border: 2px solid #1a1a1a;
    padding-left: 48px;
    padding-right: 48px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (min-width: 768px) {
    padding: 18px 50px 18px 50px;
    font-size: 15px;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 16px;
  border: none;
  background: #f8f8f8;
  border-radius: 12px;
  font-size: 14px;
  color: #333;
  outline: none;
  transition: all 0.2s ease;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;

  &::placeholder {
    color: #aaa;
  }

  &:focus {
    background: #ffffff;
    border: 2px solid #1a1a1a;
  }

  @media (min-width: 768px) {
    padding: 18px;
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
  font-size: 14px;
  color: #333;
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  appearance: none;

  option {
    background: white;
    color: #333;
  }

  &:focus {
    background: #ffffff;
    border: 2px solid #1a1a1a;
    padding-left: 48px;
    padding-right: 48px;
  }

  @media (min-width: 768px) {
    padding: 18px 50px 18px 50px;
    font-size: 15px;
  }
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #991b1b;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 12px;
  border: 1px solid #fca5a5;
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }

  @media (min-width: 768px) {
    padding: 12px 14px;
    font-size: 13px;
  }
`;

// ===== GRID STYLES =====
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  @media (min-width: 1024px) {
    gap: 24px;
  }
`;

// ===== AMENITIES STYLES =====
const AmenityInputContainer = styled.div`
  display: flex;
  gap: 8px;

  @media (min-width: 768px) {
    gap: 10px;
  }
`;

const AmenityInput = styled(Input)`
  flex: 1;
  padding: 14px 16px;
`;

const AmenityButton = styled.button`
  padding: 14px 16px;
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-weight: 600;
  font-size: 13px;
  transition: all 0.2s ease;

  svg {
    width: 16px;
    height: 16px;
  }

  &:active {
    transform: scale(0.95);
  }

  @media (min-width: 768px) {
    padding: 16px 18px;
    font-size: 14px;

    &:hover {
      background: #000;
    }
  }
`;

const AmenitiesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  @media (min-width: 768px) {
    gap: 10px;
  }
`;

const AmenityTag = styled.div`
  background: #f0f9ff;
  border: 1px solid #e0f2fe;
  color: #0369a1;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;

  button {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    svg {
      width: 14px;
      height: 14px;
    }

    &:hover {
      color: #0c4a6e;
    }
  }

  @media (min-width: 768px) {
    padding: 10px 14px;
    font-size: 13px;
  }
`;

// ===== IMAGE UPLOAD STYLES =====
const ImageUploadArea = styled.div`
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 24px 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #fafafa;

  &:hover {
    border-color: #1a1a1a;
    background: #f5f5f5;
  }

  input {
    display: none;
  }

  @media (min-width: 768px) {
    padding: 32px 24px;
  }
`;

const UploadIcon = styled.div`
  font-size: 32px;
  margin-bottom: 8px;

  svg {
    width: 32px;
    height: 32px;
    color: #999;
  }

  @media (min-width: 768px) {
    font-size: 40px;

    svg {
      width: 40px;
      height: 40px;
    }
  }
`;

const UploadText = styled.p`
  font-size: 13px;
  color: #666;
  margin: 0;
  font-weight: 500;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const UploadSubtext = styled.p`
  font-size: 11px;
  color: #999;
  margin: 4px 0 0 0;

  @media (min-width: 768px) {
    font-size: 12px;
  }
`;

const ImagePreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  margin-top: 16px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 16px;
    margin-top: 20px;
  }
`;

const ImagePreviewItem = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 10px;
  overflow: hidden;
  background: #f3f4f6;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const RemoveImageBtn = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 28px;
  height: 28px;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  svg {
    width: 14px;
    height: 14px;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`;

// ===== ACTION BUTTONS =====
const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 24px;

  @media (min-width: 768px) {
    gap: 16px;
    margin-top: 32px;
  }

  @media (min-width: 1024px) {
    gap: 20px;
  }
`;

const SubmitButton = styled.button`
  padding: 16px 24px;
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 30px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  svg {
    width: 16px;
    height: 16px;
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  @media (min-width: 768px) {
    padding: 18px 28px;
    font-size: 15px;

    &:hover:not(:disabled) {
      background: #000;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    }
  }
`;

const CancelButton = styled.button`
  padding: 16px 24px;
  background: #f3f4f6;
  color: #1a1a1a;
  border: 1px solid #e5e7eb;
  border-radius: 30px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:active {
    transform: scale(0.95);
  }

  @media (min-width: 768px) {
    padding: 18px 28px;
    font-size: 15px;

    &:hover {
      background: #e5e7eb;
      border-color: #d1d5db;
    }
  }
`;

const AlertBox = styled.div`
  background: #fee2e2;
  border: 1px solid #fca5a5;
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  gap: 10px;
  align-items: flex-start;

  svg {
    width: 18px;
    height: 18px;
    color: #991b1b;
    flex-shrink: 0;
    margin-top: 1px;
  }

  @media (min-width: 768px) {
    padding: 16px 18px;
  }
`;

const AlertText = styled.p`
  font-size: 13px;
  color: #991b1b;
  margin: 0;
  font-weight: 500;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

// ===== COMPONENT =====
export default function HostelForm({ hostel = null, isEditing = false }) {
  const router = useRouter();
  const { user } = useAuth();
  const { data: categories = [], isLoading: categoriesLoading } = useHostelCategories();
  
  // Debug log categories
  useEffect(() => {
    console.log('🏷️ Categories loaded:', {
      count: categories.length,
      loading: categoriesLoading,
      categories: categories.map(c => ({ id: c._id, name: c.name }))
    });
  }, [categories, categoriesLoading]);

  const {
    formData,
    errors,
    previewImage,
    handleChange,
    handleImageChange,
    removeImage,
    addAmenity,
    removeAmenity,
    setFormErrors,
  } = useHostelForm(hostel);

  const createMutation = useCreateHostel();
  const updateMutation = useUpdateHostel();
  const [amenityInput, setAmenityInput] = useState('');

  // ✅ Suggested amenities (users can type custom ones too)
  const suggestedAmenities = [
    'WiFi',
    'Power Supply',
    'Laundry Service',
    'Kitchen',
    'TV',
    'AC',
    'Fan',
    'Parking',
    'Water Supply',
    'CCTV',
    'Security Gate',
    'Common Area',
    'Study Room',
    'Gym',
    'Library',
    'Cafeteria',
    'Generator',
    'Solar Power',
    'Balcony',
    'Shared Bathroom',
    'Private Bathroom'
  ];

  useEffect(() => {
    if (!isEditing && user?.campus && !formData.campus) {
      const campusValue = typeof user.campus === 'object' ? user.campus.name : user.campus;
      handleChange({
        target: { name: 'campus', value: campusValue }
      });
    }
  }, [user, isEditing, formData.campus, handleChange]);

  const isLoading = createMutation.isPending || updateMutation.isPending;
  const error = createMutation.error || updateMutation.error;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Hostel name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.campus) newErrors.campus = 'Campus is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.roomType) newErrors.roomType = 'Room type is required';
    if (!formData.capacity || parseInt(formData.capacity) <= 0) newErrors.capacity = 'Valid capacity is required';
    if (!formData.category) newErrors.category = 'Category is required';
    
    if (!isEditing && !formData.image) {
      newErrors.image = 'At least one hostel image is required';
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Build contact object with all contact fields
      const submitData = { 
        ...formData,
        contact: {
          phoneNumber: formData.phoneNumber,
          alternatePhoneNumber: formData.alternatePhoneNumber || null,
          email: formData.email || null,
          whatsappNumber: formData.whatsappNumber || null,
        }
      };

      console.log('📋 Submitting hostel form data:', {
        name: submitData.name,
        category: submitData.category,
        categoryType: typeof submitData.category,
        contact: submitData.contact,
        allKeys: Object.keys(submitData)
      });

      if (isEditing) {
        await updateMutation.mutateAsync({
          id: hostel._id,
          hostelData: submitData,
          image: formData.image instanceof File ? formData.image : null,
        });
      } else {
        await createMutation.mutateAsync({
          hostelData: submitData,
          image: formData.image,
        });
      }

      router.push('/hostels');
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      {error && (
        <AlertBox>
          <AlertCircle />
          <AlertText>{error.message || 'An error occurred. Please try again.'}</AlertText>
        </AlertBox>
      )}

      {/* BASIC INFORMATION SECTION */}
      <div>
        <SectionTitle>Basic Information</SectionTitle>
        
        <FormGroup>
          <LabelWithIcon>
            <Home /> Hostel Name *
          </LabelWithIcon>
          <InputWrapper>
            <IconWrapper>🏠</IconWrapper>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Campus Haven Hostel"
            />
          </InputWrapper>
          {errors.name && <ErrorMessage><AlertCircle /> {errors.name}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <LabelWithIcon>Description *</LabelWithIcon>
          <TextArea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your hostel features, amenities, and what makes it unique..."
          />
          {errors.description && <ErrorMessage><AlertCircle /> {errors.description}</ErrorMessage>}
        </FormGroup>
      </div>

      <SectionDivider />

      {/* LOCATION SECTION */}
      <div>
        <SectionTitle>Location</SectionTitle>

        <GridContainer>
          <FormGroup>
            <LabelWithIcon>
              <MapPin /> Address *
            </LabelWithIcon>
            <InputWrapper>
              <IconWrapper>📍</IconWrapper>
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address"
              />
            </InputWrapper>
            {errors.address && <ErrorMessage><AlertCircle /> {errors.address}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <LabelWithIcon>
              🎓 Campus *
            </LabelWithIcon>
            <InputWrapper>
              <IconWrapper>🏫</IconWrapper>
              <Input
                type="text"
                name="campus"
                value={formData.campus}
                onChange={handleChange}
                placeholder="e.g., FUTO Campus"
              />
            </InputWrapper>
            {errors.campus && <ErrorMessage><AlertCircle /> {errors.campus}</ErrorMessage>}
          </FormGroup>
        </GridContainer>
      </div>

      <SectionDivider />

      {/* PRICING & CAPACITY SECTION */}
      <div>
        <SectionTitle>Pricing & Capacity</SectionTitle>

        <GridContainer>
          <FormGroup>
            <LabelWithIcon>
              <DollarSign /> Price per Month *
            </LabelWithIcon>
            <InputWrapper>
              <IconWrapper>₦</IconWrapper>
              <Input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="1000"
                placeholder="0"
              />
            </InputWrapper>
            {errors.price && <ErrorMessage><AlertCircle /> {errors.price}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <LabelWithIcon>
              <Users /> Capacity *
            </LabelWithIcon>
            <InputWrapper>
              <IconWrapper>#</IconWrapper>
              <Input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                min="1"
                placeholder="Number of rooms/beds"
              />
            </InputWrapper>
            {errors.capacity && <ErrorMessage><AlertCircle /> {errors.capacity}</ErrorMessage>}
          </FormGroup>
        </GridContainer>

        <FormGroup>
          <LabelWithIcon>
            <Type /> Room Type *
          </LabelWithIcon>
          <InputWrapper>
            <IconWrapper>🛏️</IconWrapper>
            <Select
              name="roomType"
              value={formData.roomType}
              onChange={handleChange}
            >
              <option value="">Select room type</option>
              <option value="single">Single Room</option>
              <option value="double">Double Room</option>
              <option value="triple">Triple Room</option>
              <option value="quad">Quad Room</option>
              <option value="dormitory">Dormitory</option>
            </Select>
          </InputWrapper>
          {errors.roomType && <ErrorMessage><AlertCircle /> {errors.roomType}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <LabelWithIcon>
            🏷️ Category *
          </LabelWithIcon>
          <InputWrapper>
            <IconWrapper>📂</IconWrapper>
            <Select
              name="category"
              value={formData.category}
              onChange={(e) => {
                console.log('🏷️ Category changed:', {
                  selectedValue: e.target.value,
                  formDataBefore: formData.category
                });
                handleChange(e);
              }}
              disabled={categoriesLoading}
            >
              <option value="">
                {categoriesLoading ? 'Loading categories...' : 'Select a category'}
              </option>
              {Array.isArray(categories) && categories.length > 0 ? (
                categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))
              ) : (
                <option disabled>No categories available</option>
              )}
            </Select>
          </InputWrapper>
          {errors.category && <ErrorMessage><AlertCircle /> {errors.category}</ErrorMessage>}
        </FormGroup>
      </div>

      <SectionDivider />

      {/* CONTACT INFORMATION SECTION */}
      <div>
        <SectionTitle>Contact Information</SectionTitle>

        <GridContainer>
          <FormGroup>
            <LabelWithIcon>
              <Phone /> Phone Number
            </LabelWithIcon>
            <InputWrapper>
              <IconWrapper>📱</IconWrapper>
              <Input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter contact number"
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <LabelWithIcon>
              <Phone /> WhatsApp Number (Optional)
            </LabelWithIcon>
            <InputWrapper>
              <IconWrapper>💬</IconWrapper>
              <Input
                type="tel"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleChange}
                placeholder="e.g., +2348012345678 or 08012345678"
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <LabelWithIcon>
              <Globe /> Website
            </LabelWithIcon>
            <InputWrapper>
              <IconWrapper>🌐</IconWrapper>
              <Input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </InputWrapper>
          </FormGroup>
        </GridContainer>
      </div>

      <SectionDivider />

      {/* AMENITIES SECTION */}
      <div>
        <SectionTitle>Amenities</SectionTitle>

        <FormGroup>
          <AmenityInputContainer>
            <AmenityInput
              type="text"
              value={amenityInput}
              onChange={(e) => setAmenityInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (amenityInput.trim() && !formData.amenities?.includes(amenityInput.trim())) {
                    addAmenity(amenityInput.trim());
                    setAmenityInput('');
                  }
                }
              }}
              placeholder="e.g., WiFi, Hot Water, Cleaning Service, or select below"
              list="amenity-suggestions"
            />
            <datalist id="amenity-suggestions">
              {suggestedAmenities
                .filter(amenity => !formData.amenities?.includes(amenity))
                .map(amenity => (
                  <option key={amenity} value={amenity} />
                ))}
            </datalist>
            <AmenityButton 
              type="button" 
              onClick={() => {
                if (amenityInput.trim() && !formData.amenities?.includes(amenityInput.trim())) {
                  addAmenity(amenityInput.trim());
                  setAmenityInput('');
                }
              }}
            >
              <Plus /> Add
            </AmenityButton>
          </AmenityInputContainer>

          {formData.amenities && formData.amenities.length > 0 && (
            <AmenitiesList>
              {formData.amenities.map((amenity) => (
                <AmenityTag key={amenity}>
                  {amenity}
                  <button
                    type="button"
                    onClick={() => removeAmenity(amenity)}
                  >
                    <X />
                  </button>
                </AmenityTag>
              ))}
            </AmenitiesList>
          )}
        </FormGroup>
      </div>

      <SectionDivider />

      {/* RULES & POLICIES SECTION */}
      <div>
        <SectionTitle>Rules & Policies</SectionTitle>

        <FormGroup>
          <TextArea
            name="rules"
            value={formData.rules}
            onChange={handleChange}
            placeholder="List any rules or policies (e.g., visiting hours, guest policies, check-in/check-out times)..."
          />
        </FormGroup>
      </div>

      <SectionDivider />

      {/* IMAGES SECTION */}
      <div>
        <SectionTitle>Hostel Images {!isEditing && '*'}</SectionTitle>

        <ImageUploadArea onClick={() => document.querySelector('input[type="file"]')?.click()}>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
          <UploadIcon>
            <Upload />
          </UploadIcon>
          <UploadText>Click to upload images or drag and drop</UploadText>
          <UploadSubtext>PNG, JPG, GIF up to 10MB</UploadSubtext>
        </ImageUploadArea>

        {errors.image && <ErrorMessage><AlertCircle /> {errors.image}</ErrorMessage>}

        {previewImage && (Array.isArray(previewImage) ? previewImage.length > 0 : previewImage) && (
          <ImagePreviewGrid>
            {Array.isArray(previewImage)
              ? previewImage.map((preview, idx) => (
                  <ImagePreviewItem key={idx}>
                    <img src={preview} alt={`Preview ${idx + 1}`} />
                    <RemoveImageBtn
                      type="button"
                      onClick={() => removeImage(idx)}
                    >
                      <X />
                    </RemoveImageBtn>
                  </ImagePreviewItem>
                ))
              : (
                  <ImagePreviewItem>
                    <img src={previewImage} alt="Preview" />
                    <RemoveImageBtn
                      type="button"
                      onClick={removeImage}
                    >
                      <X />
                    </RemoveImageBtn>
                  </ImagePreviewItem>
                )}
          </ImagePreviewGrid>
        )}
      </div>

      {/* ACTION BUTTONS */}
      <ButtonGroup>
        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading && <span>⏳</span>}
          {isLoading
            ? 'Processing...'
            : isEditing
            ? 'Update Hostel'
            : 'Create Hostel'}
        </SubmitButton>
        <CancelButton
          type="button"
          onClick={() => router.back()}
        >
          Cancel
        </CancelButton>
      </ButtonGroup>
    </FormContainer>
  );
}
