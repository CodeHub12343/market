'use client';

import styled from 'styled-components';
import { useEffect } from 'react';
import { useRequestForm } from '@/hooks/useRequestForm';
import { useAuth } from '@/hooks/useAuth';
import { useRequestCategories } from '@/hooks/useCategories';
import ErrorAlert from '@/components/common/ErrorAlert';
import SuccessAlert from '@/components/common/SuccessAlert';
import {
  Pencil,
  FileText,
  Tag,
  MapPin,
  Building,
  DollarSign,
  Calendar,
  Zap,
  Plus,
  X,
  Phone
} from 'lucide-react';

// ===== FORM CONTAINER =====
const FormContainer = styled.div`
  padding: 0;
  background: white;
  border-radius: 0;
  box-shadow: none;
`;

const FormContent = styled.div`
  padding: 16px;

  @media (min-width: 640px) {
    padding: 20px;
  }

  @media (min-width: 1024px) {
    padding: 28px;
  }
`;

// ===== ALERTS =====
const AlertContainer = styled.div`
  margin-bottom: 12px;

  @media (min-width: 640px) {
    margin-bottom: 16px;
  }
`;

// ===== FORM SECTION =====
const FormSection = styled.div`
  margin-bottom: 20px;

  &:last-of-type {
    margin-bottom: 0;
  }

  @media (min-width: 640px) {
    margin-bottom: 24px;
  }

  @media (min-width: 1024px) {
    margin-bottom: 28px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 13px;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: #aaa;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (min-width: 640px) {
    font-size: 14px;
    margin-bottom: 14px;
  }

  @media (min-width: 1024px) {
    font-size: 13px;
    margin-bottom: 16px;
  }
`;

// ===== FORM GRID =====
const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  @media (min-width: 1024px) {
    gap: 18px;
  }

  &.full-width {
    grid-template-columns: 1fr;
  }
`;

// ===== FORM GROUP =====
const FormGroup = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;

  &.full-width {
    grid-column: 1 / -1;
  }
`;

// ===== ICON WRAPPER =====
const IconWrapper = styled.div`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #aaa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  pointer-events: none;
  z-index: 1;

  @media (min-width: 640px) {
    left: 16px;
  }

  @media (min-width: 1024px) {
    left: 18px;
  }

  svg {
    width: 16px;
    height: 16px;

    @media (min-width: 640px) {
      width: 18px;
      height: 18px;
    }
  }
`;

// ===== INPUT & SELECT =====
const Input = styled.input`
  width: 100%;
  min-height: 44px;
  padding: 12px 44px;
  background: #f8f8f8;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  font-size: 14px;
  font-family: inherit;
  color: #333;
  transition: all 0.2s ease;

  @media (min-width: 640px) {
    min-height: 48px;
    padding: 14px 50px;
    font-size: 15px;
  }

  @media (min-width: 1024px) {
    min-height: 50px;
    padding: 16px 52px;
  }

  &::placeholder {
    color: #bbb;
  }

  &:focus {
    outline: none;
    background: #ffffff;
    border-color: #333;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: #f5f5f5;
  }
`;

const Select = styled.select`
  width: 100%;
  min-height: 44px;
  padding: 12px 44px;
  background: #f8f8f8;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  font-size: 14px;
  font-family: inherit;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23aaa' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 38px;

  @media (min-width: 640px) {
    min-height: 48px;
    padding: 14px 50px 14px 50px;
    background-position: right 16px center;
    padding-right: 44px;
    font-size: 15px;
  }

  @media (min-width: 1024px) {
    min-height: 50px;
    padding: 16px 52px 16px 52px;
    background-position: right 18px center;
    padding-right: 46px;
  }

  &:focus {
    outline: none;
    background-color: #ffffff;
    border-color: #333;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  }

  option {
    padding: 8px;
    background: white;
    color: #333;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 110px;
  padding: 12px;
  background: #f8f8f8;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  font-size: 14px;
  font-family: inherit;
  color: #333;
  resize: vertical;
  transition: all 0.2s ease;

  @media (min-width: 640px) {
    min-height: 120px;
    padding: 14px;
    font-size: 15px;
  }

  @media (min-width: 1024px) {
    min-height: 130px;
    padding: 16px;
  }

  &::placeholder {
    color: #bbb;
  }

  &:focus {
    outline: none;
    background: #ffffff;
    border-color: #333;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  }
`;

// ===== ERROR & HELPER TEXT =====
const ErrorText = styled.span`
  font-size: 12px;
  color: #ef4444;
  margin-top: 6px;

  @media (min-width: 640px) {
    font-size: 13px;
    margin-top: 8px;
  }
`;

const HelperText = styled.span`
  font-size: 11px;
  color: #999;
  margin-top: 4px;
  font-weight: 500;

  @media (min-width: 640px) {
    font-size: 12px;
    margin-top: 6px;
  }
`;

// ===== TAGS SECTION =====
const TagContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: stretch;

  @media (min-width: 640px) {
    gap: 10px;
  }
`;

const TagInput = styled(Input)`
  flex: 1;
  margin: 0;
  min-height: 44px;

  @media (min-width: 640px) {
    min-height: 48px;
  }

  @media (min-width: 1024px) {
    min-height: 50px;
  }
`;

const TagButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  flex-shrink: 0;

  @media (min-width: 640px) {
    min-width: 48px;
    min-height: 48px;
  }

  @media (min-width: 1024px) {
    min-width: 50px;
    min-height: 50px;
  }

  @media (hover: hover) {
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const TagsList = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;

  @media (min-width: 640px) {
    gap: 10px;
    margin-top: 14px;
  }
`;

const TagItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #f0f0f0;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  color: #333;

  @media (min-width: 640px) {
    padding: 8px 14px;
    font-size: 13px;
  }
`;

const RemoveTag = styled.button`
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  padding: 0;
  margin: -2px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;

  @media (hover: hover) {
    &:hover {
      color: #ef4444;
    }
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

// ===== BUTTONS =====
const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;

  @media (min-width: 640px) {
    gap: 14px;
    margin-top: 24px;
    padding-top: 24px;
  }

  @media (min-width: 1024px) {
    margin-top: 28px;
    padding-top: 28px;
  }
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  @media (min-width: 640px) {
    min-height: 48px;
    padding: 14px 24px;
    font-size: 15px;
  }

  @media (min-width: 1024px) {
    min-height: 50px;
    padding: 16px 28px;
  }

  @media (hover: hover) {
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
    }
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 12px 20px;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  @media (min-width: 640px) {
    min-height: 48px;
    padding: 14px 24px;
    font-size: 15px;
  }

  @media (min-width: 1024px) {
    min-height: 50px;
    padding: 16px 28px;
  }

  @media (hover: hover) {
    &:hover {
      background: #e5e7eb;
    }
  }

  &:active {
    transform: scale(0.98);
  }
`;

// ===== COMPONENT =====
export default function RequestForm({
  initialRequest = null,
  onSubmit,
  isLoading = false,
  error = null,
  success = null,
  onCancel = null
}) {
  const { user } = useAuth();
  const {
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
  } = useRequestForm(initialRequest, user?.campus?._id || user?.campus);
  const { data: categories = [], isLoading: categoriesLoading } = useRequestCategories();

  const campusDisplayName = typeof user?.campus === 'object' ? user?.campus?.name : user?.campus || 'Not assigned';

  // Auto-fill campus from logged-in user for new requests
  useEffect(() => {
    if (!initialRequest && user?.campus) {
      const campusId = typeof user.campus === 'object' ? user.campus._id : user.campus;
      if (campusId && formData.location.campus !== campusId) {
        handleNestedChange('location', 'campus', campusId)({
          target: { name: 'campus', value: campusId }
        });
      }
    }
  }, [user?.campus, initialRequest, handleNestedChange, formData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Prepare data for submission - match backend schema
    const averagePrice = (parseInt(formData.budget.min) + parseInt(formData.budget.max)) / 2;
    
    const submitData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category || undefined,
      campus: formData.location.campus,
      desiredPrice: averagePrice,
      tags: formData.tags && formData.tags.length > 0 ? formData.tags : undefined,
      ...(formData.location.address.trim() && { 
        location: {
          address: formData.location.address.trim()
        }
      }),
      ...(formData.whatsappNumber.trim() && { 
        whatsappNumber: formData.whatsappNumber.trim()
      })
    };

    console.log('Submitting request data:', submitData);
    onSubmit(submitData);
  };

  return (
    <FormContainer>
      <AlertContainer>
        {error && <ErrorAlert message={error} />}
        {success && <SuccessAlert message={success} />}
      </AlertContainer>

      <FormContent>
        <form onSubmit={handleSubmit}>
          {/* WHAT DO YOU NEED? SECTION */}
          <FormSection>
            <SectionTitle>Request Details</SectionTitle>
            
            {/* Title */}
            <FormGrid className="full-width">
              <FormGroup className="full-width">
                <IconWrapper>
                  <Pencil size={16} />
                </IconWrapper>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Request title"
                  required
                />
                {errors.title && <ErrorText>{errors.title}</ErrorText>}
              </FormGroup>
            </FormGrid>

            {/* Description */}
            <FormGrid className="full-width">
              <FormGroup className="full-width">
                <TextArea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Tell sellers what you're looking for in detail..."
                  required
                />
                {errors.description && <ErrorText>{errors.description}</ErrorText>}
              </FormGroup>
            </FormGrid>

            {/* Category */}
            <FormGrid>
              <FormGroup>
                <IconWrapper>
                  <Tag size={16} />
                </IconWrapper>
                <Select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  disabled={categoriesLoading}
                  required
                >
                  <option value="">
                    {categoriesLoading ? 'Loading categories...' : 'Select category'}
                  </option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </Select>
                {errors.category && <ErrorText>{errors.category}</ErrorText>}
              </FormGroup>

              {/* Campus */}
              <FormGroup>
                <IconWrapper>
                  <Building size={16} />
                </IconWrapper>
                <Input
                  id="campus"
                  type="text"
                  value={campusDisplayName}
                  disabled
                />
              </FormGroup>
            </FormGrid>
          </FormSection>

          {/* BUDGET & LOCATION SECTION */}
          <FormSection>
            <SectionTitle>Budget & Location</SectionTitle>

            {/* Budget */}
            <FormGrid>
              <FormGroup>
                <IconWrapper>
                  <DollarSign size={16} />
                </IconWrapper>
                <Input
                  id="budgetMin"
                  type="number"
                  value={formData.budget.min}
                  onChange={(e) => handleNestedChange('budget', 'min', e.target.value)}
                  placeholder="Min budget"
                  min="0"
                  required
                />
                {errors.budgetMin && <ErrorText>{errors.budgetMin}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <IconWrapper>
                  <DollarSign size={16} />
                </IconWrapper>
                <Input
                  id="budgetMax"
                  type="number"
                  value={formData.budget.max}
                  onChange={(e) => handleNestedChange('budget', 'max', e.target.value)}
                  placeholder="Max budget"
                  min="0"
                  required
                />
                {errors.budgetMax && <ErrorText>{errors.budgetMax}</ErrorText>}
              </FormGroup>
            </FormGrid>

            {/* Address */}
            <FormGrid className="full-width">
              <FormGroup className="full-width">
                <IconWrapper>
                  <MapPin size={16} />
                </IconWrapper>
                <Input
                  id="address"
                  type="text"
                  value={formData.location.address}
                  onChange={(e) => handleNestedChange('location', 'address', e.target.value)}
                  placeholder="Location or address"
                  required
                />
                {errors.address && <ErrorText>{errors.address}</ErrorText>}
              </FormGroup>
            </FormGrid>

            {/* WhatsApp Number */}
            <FormGrid className="full-width">
              <FormGroup className="full-width">
                <IconWrapper>
                  <Phone size={16} />
                </IconWrapper>
                <Input
                  id="whatsappNumber"
                  type="tel"
                  value={formData.whatsappNumber}
                  onChange={handleInputChange}
                  placeholder="WhatsApp number (e.g., +1234567890)"
                />
                {errors.whatsappNumber && <ErrorText>{errors.whatsappNumber}</ErrorText>}
                {!errors.whatsappNumber && (
                  <HelperText style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    Enter with country code (optional)
                  </HelperText>
                )}
              </FormGroup>
            </FormGrid>

            {/* Date */}
            <FormGrid className="full-width">
              <FormGroup className="full-width">
                <IconWrapper>
                  <Calendar size={16} />
                </IconWrapper>
                <Input
                  id="requiredDate"
                  type="date"
                  value={formData.requiredDate}
                  onChange={(e) => handleInputChange({ target: { name: 'requiredDate', value: e.target.value } })}
                  required
                />
                {errors.requiredDate && <ErrorText>{errors.requiredDate}</ErrorText>}
              </FormGroup>
            </FormGrid>
          </FormSection>

          {/* TAGS SECTION */}
          <FormSection>
            <SectionTitle>Tags</SectionTitle>
            
            <FormGrid className="full-width">
              <FormGroup className="full-width">
                <TagContainer>
                  <IconWrapper style={{ left: '12px', zIndex: 2 }}>
                    <Plus size={16} />
                  </IconWrapper>
                  <TagInput
                    type="text"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Add tag and press Enter"
                    style={{ paddingLeft: '44px' }}
                  />
                  <TagButton type="button" onClick={addTag}>
                    <Plus size={16} />
                  </TagButton>
                </TagContainer>

                {formData.tags.length > 0 && (
                  <TagsList>
                    {formData.tags.map(t => (
                      <TagItem key={t}>
                        {t}
                        <RemoveTag type="button" onClick={() => removeTag(t)}>
                          <X size={14} />
                        </RemoveTag>
                      </TagItem>
                    ))}
                  </TagsList>
                )}
              </FormGroup>
            </FormGrid>
          </FormSection>

          {/* ADDITIONAL INFO SECTION */}
          <FormSection>
            <SectionTitle>Additional Info</SectionTitle>
            
            <FormGrid className="full-width">
              <FormGroup className="full-width">
                <TextArea
                  id="specifications"
                  value={formData.specifications}
                  onChange={(e) => handleInputChange({ target: { name: 'specifications', value: e.target.value } })}
                  placeholder="Any other details, preferences, or notes..."
                />
              </FormGroup>
            </FormGrid>
          </FormSection>

          {/* ACTION BUTTONS */}
          <ButtonGroup>
            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading ? 'Posting...' : initialRequest ? 'Update' : 'Post Request'}
            </SubmitButton>
            <CancelButton type="button" onClick={onCancel || resetForm}>
              Cancel
            </CancelButton>
          </ButtonGroup>
        </form>
      </FormContent>
    </FormContainer>
  );
}
