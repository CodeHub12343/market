// src/components/services/ServiceForm.jsx

import styled from 'styled-components';
import { useServiceCategories } from '@/hooks/useCategories';
import useServiceForm from '@/hooks/useServiceForm';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import { AlertCircle } from 'lucide-react';
import ServiceOptionsForm from './ServiceOptionsForm';

const FormContainer = styled.div`
  padding: 20px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 0;

  @media (min-width: 1024px) {
    background: #ffffff;
    padding: 20px 24px;
    margin: 0 -24px 0 -24px;
    border-bottom: 1px solid #f0f0f0;
  }
`;

const FormStack = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FormGroup = styled.div`
  position: relative;
  margin-bottom: 0;
`;

const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  span {
    color: #c00;
    margin-left: 2px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: none;
  background: #f8f8f8;
  border-radius: 12px;
  font-size: 16px;
  color: #1a1a1a;
  outline: none;
  transition: all 0.2s ease;
  font-family: inherit;

  &::placeholder {
    color: #999;
  }

  &:focus {
    background: #ffffff;
    box-shadow: 0 0 0 2px rgba(26, 26, 26, 0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 14px 16px;
  border: none;
  background: #f8f8f8;
  border-radius: 12px;
  font-size: 16px;
  color: #1a1a1a;
  outline: none;
  transition: all 0.2s ease;
  font-family: inherit;
  cursor: pointer;

  &:focus {
    background: #ffffff;
    box-shadow: 0 0 0 2px rgba(26, 26, 26, 0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  option {
    background: #ffffff;
    color: #1a1a1a;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 14px 16px;
  border: none;
  background: #f8f8f8;
  border-radius: 12px;
  font-size: 16px;
  color: #1a1a1a;
  outline: none;
  transition: all 0.2s ease;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;

  &::placeholder {
    color: #999;
  }

  &:focus {
    background: #ffffff;
    box-shadow: 0 0 0 2px rgba(26, 26, 26, 0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px 16px;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  color: #c00;
  font-size: 14px;
  margin-top: 8px;

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    margin-top: 1px;
  }
`;

const HelperText = styled.p`
  font-size: 12px;
  color: #999;
  margin: 6px 0 0 0;
`;

const GridRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ImageUploadContainer = styled.div`
  border: 2px dashed #e5e5e5;
  border-radius: 12px;
  padding: 24px 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f9f9f9;

  &:hover {
    border-color: #1a1a1a;
    background: #ffffff;
  }

  p {
    margin: 0;
    color: #666;
    font-size: 14px;

    &:first-child {
      font-size: 48px;
      margin-bottom: 8px;
    }

    &:last-child {
      font-size: 12px;
      color: #999;
    }
  }
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  margin-top: 16px;
`;

const FileInput = styled.input`
  display: none;
`;

const TagsContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
  min-height: 32px;
`;

const Tag = styled.div`
  background: #1a1a1a;
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;

  button {
    background: none;
    border: none;
    color: #ffffff;
    cursor: pointer;
    font-size: 16px;
    padding: 0;
    line-height: 1;
    display: flex;
    align-items: center;

    &:hover {
      color: #fcc;
    }
  }
`;

const TagInput = styled.input`
  padding: 10px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 14px;
  flex: 1;
  min-width: 100px;
  color: #1a1a1a;

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 2px rgba(26, 26, 26, 0.05);
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  color: #1a1a1a;

  input {
    cursor: pointer;
    width: 18px;
    height: 18px;
  }
`;

const DayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 8px;
  margin-top: 8px;
`;

const DayCheckbox = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 12px;
  border: 2px solid #e5e5e5;
  border-radius: 8px;
  background: ${props => props.selected ? '#1a1a1a' : '#ffffff'};
  color: ${props => props.selected ? '#ffffff' : '#1a1a1a'};
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
  opacity: ${props => props.disabled ? 0.6 : 1};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};

  &:hover {
    border-color: ${props => props.disabled ? '#e5e5e5' : '#1a1a1a'};
  }

  input {
    display: none;
  }
`;

const TimeInputGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 8px;
`;

const TimeInput = styled(Input)`
  /* inherits from Input styling */
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`;

const Button = styled.button`
  flex: 1;
  padding: 14px 20px;
  background: ${props => props.primary ? '#1a1a1a' : '#f9f9f9'};
  color: ${props => props.primary ? '#ffffff' : '#1a1a1a'};
  border: 1px solid ${props => props.primary ? '#1a1a1a' : '#e5e5e5'};
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background: ${props => props.primary ? '#333333' : '#f0f0f0'};
    border-color: ${props => props.primary ? '#333333' : '#d5d5d5'};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const CharacterCount = styled.span`
  font-size: 12px;
  color: #999;
  display: block;
  margin-top: 4px;
`;

export default function ServiceForm({ initialService = null, onSuccess }) {
  const router = useRouter();
  const { data: categories = [], isLoading: categoriesLoading } = useServiceCategories();
  const form = useServiceForm(initialService, onSuccess);
  const [tagInput, setTagInput] = useState('');
  const fileInputRef = useRef(null);

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      form.handleAddTag(tagInput.trim());
      setTagInput('');
    }
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <FormContainer>
      {form.errors.submit && (
        <ErrorMessage>
          <AlertCircle />
          {form.errors.submit}
        </ErrorMessage>
      )}

      <FormStack onSubmit={form.handleSubmit}>

        {/* Basic Information */}
        <FormSection>
          <SectionTitle>Basic Information</SectionTitle>

          <FormGroup>
            <Label>Service Title <span>*</span></Label>
            <Input
              type="text"
              name="title"
              value={form.formData.title}
              onChange={form.handleInputChange}
              placeholder="e.g., Python Programming Tutoring"
              maxLength="100"
              disabled={form.submitting}
            />
            <CharacterCount>{form.formData.title.length}/100</CharacterCount>
            {form.errors.title && (
              <ErrorMessage>
                <AlertCircle />
                {form.errors.title}
              </ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label>Description <span>*</span></Label>
            <TextArea
              name="description"
              value={form.formData.description}
              onChange={form.handleInputChange}
              placeholder="Describe your service in detail. What will the customer receive? What's your experience?"
              maxLength="2000"
              disabled={form.submitting}
            />
            <CharacterCount>{form.formData.description.length}/2000</CharacterCount>
            {form.errors.description && (
              <ErrorMessage>
                <AlertCircle />
                {form.errors.description}
              </ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label>Category <span>*</span></Label>
            <Select
              name="category"
              value={form.formData.category}
              onChange={form.handleInputChange}
              disabled={categoriesLoading || form.submitting}
            >
              <option value="">
                {categoriesLoading ? 'Loading categories...' : 'Select Category'}
              </option>
              {Array.isArray(categories) && categories.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </Select>
            {form.errors.category && (
              <ErrorMessage>
                <AlertCircle />
                {form.errors.category}
              </ErrorMessage>
            )}
          </FormGroup>
        </FormSection>

        {/* Pricing & Duration */}
        <FormSection>
          <SectionTitle>Pricing & Duration</SectionTitle>

          <GridRow>
            <FormGroup>
              <Label>Price (₦) <span>*</span></Label>
              <Input
                type="number"
                name="price"
                value={form.formData.price}
                onChange={form.handleInputChange}
                placeholder="e.g., 5000"
                step="100"
                min="1"
                disabled={form.submitting}
              />
              {form.errors.price && (
                <ErrorMessage>
                  <AlertCircle />
                  {form.errors.price}
                </ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Duration <span>*</span></Label>
              <Input
                type="number"
                name="duration"
                value={form.formData.duration}
                onChange={form.handleInputChange}
                placeholder="e.g., 1"
                min="1"
                disabled={form.submitting}
              />
              {form.errors.duration && (
                <ErrorMessage>
                  <AlertCircle />
                  {form.errors.duration}
                </ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Duration Unit <span>*</span></Label>
              <Select
                name="durationUnit"
                value={form.formData.durationUnit}
                onChange={form.handleInputChange}
                disabled={form.submitting}
              >
                <option value="minute">Minute(s)</option>
                <option value="hour">Hour(s)</option>
                <option value="day">Day(s)</option>
                <option value="week">Week(s)</option>
                <option value="month">Month(s)</option>
              </Select>
              {form.errors.durationUnit && (
                <ErrorMessage>
                  <AlertCircle />
                  {form.errors.durationUnit}
                </ErrorMessage>
              )}
            </FormGroup>
          </GridRow>
        </FormSection>

        {/* Service Details */}
        <FormSection>
          <SectionTitle>Service Details</SectionTitle>

          <FormGroup>
            <Label>Location</Label>
            <Input
              type="text"
              name="location"
              value={form.formData.location}
              onChange={form.handleInputChange}
              placeholder="e.g., Online or Campus Location"
              disabled={form.submitting}
            />
            <HelperText>Optional - leave blank for online services</HelperText>
          </FormGroup>

          <FormGroup>
            <Label>WhatsApp Number (Optional)</Label>
            <Input
              type="tel"
              name="whatsappNumber"
              value={form.formData.whatsappNumber}
              onChange={form.handleInputChange}
              placeholder="e.g., +2348012345678 or 08012345678"
              disabled={form.submitting}
            />
            <HelperText>Customers can reach you directly via WhatsApp</HelperText>
            {form.errors.whatsappNumber && (
              <ErrorMessage>
                <AlertCircle />
                {form.errors.whatsappNumber}
              </ErrorMessage>
            )}
          </FormGroup>
        </FormSection>

        {/* Booking & Availability */}
        <FormSection>
          <SectionTitle>Booking & Availability</SectionTitle>

          <GridRow>
            <FormGroup>
              <Label>Booking Type <span>*</span></Label>
              <Select
                name="bookingType"
                value={form.formData.bookingType}
                onChange={form.handleInputChange}
                disabled={form.submitting}
              >
                <option value="available">Available Now</option>
                <option value="on-demand">On Demand</option>
                <option value="by-appointment">By Appointment</option>
              </Select>
              <HelperText>How customers can book your service</HelperText>
            </FormGroup>

            <FormGroup>
              <Label>Max Concurrent Bookings</Label>
              <Input
                type="number"
                name="maxBookings"
                value={form.formData.maxBookings}
                onChange={form.handleInputChange}
                min="1"
                max="100"
                disabled={form.submitting}
              />
              <HelperText>Maximum number of simultaneous bookings allowed</HelperText>
            </FormGroup>
          </GridRow>

          <FormGroup>
            <Label>Available Days</Label>
            <DayGrid>
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                <DayCheckbox
                  key={day}
                  selected={form.formData.availability.days.includes(day)}
                  disabled={form.submitting}
                >
                  <input
                    type="checkbox"
                    checked={form.formData.availability.days.includes(day)}
                    onChange={() => form.handleDayToggle(day)}
                    disabled={form.submitting}
                  />
                  {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                </DayCheckbox>
              ))}
            </DayGrid>
            <HelperText>Select the days you're available to provide this service</HelperText>
          </FormGroup>

          <FormGroup>
            <Label>Operating Hours</Label>
            <TimeInputGroup>
              <div>
                <Label style={{ fontSize: '12px', marginBottom: '6px' }}>Start Time</Label>
                <TimeInput
                  type="time"
                  name="availability.startTime"
                  value={form.formData.availability.startTime}
                  onChange={form.handleInputChange}
                  disabled={form.submitting}
                />
              </div>
              <div>
                <Label style={{ fontSize: '12px', marginBottom: '6px' }}>End Time</Label>
                <TimeInput
                  type="time"
                  name="availability.endTime"
                  value={form.formData.availability.endTime}
                  onChange={form.handleInputChange}
                  disabled={form.submitting}
                />
              </div>
            </TimeInputGroup>
          </FormGroup>
        </FormSection>

        {/* Service Settings */}
        <FormSection>
          <SectionTitle>Service Settings</SectionTitle>

          <CheckboxGroup>
            <CheckboxLabel>
              <input
                type="checkbox"
                name="settings.allowInstantBooking"
                checked={form.formData.settings.allowInstantBooking}
                onChange={form.handleInputChange}
                disabled={form.submitting}
              />
              Allow instant booking (no approval needed)
            </CheckboxLabel>

            <CheckboxLabel>
              <input
                type="checkbox"
                name="settings.requireApproval"
                checked={form.formData.settings.requireApproval}
                onChange={form.handleInputChange}
                disabled={form.submitting}
              />
              Require approval before confirming bookings
            </CheckboxLabel>
          </CheckboxGroup>

          <FormGroup>
            <Label>Cancellation Policy</Label>
            <Select
              name="settings.cancellationPolicy"
              value={form.formData.settings.cancellationPolicy}
              onChange={form.handleInputChange}
              disabled={form.submitting}
            >
              <option value="flexible">Flexible - Can cancel anytime</option>
              <option value="moderate">Moderate - Cancel up to 24 hours before</option>
              <option value="strict">Strict - No cancellations allowed</option>
            </Select>
            <HelperText>Define your service's cancellation terms</HelperText>
          </FormGroup>
        </FormSection>

        {/* Image Upload */}
        <FormSection>
          <SectionTitle>Service Images</SectionTitle>

          <FormGroup>
            <Label>Upload Images {!initialService && <span>*</span>}</Label>
            <ImageUploadContainer
              onClick={handleImageUploadClick}
              role="button"
              tabIndex={0}
            >
              {form.formData.imagePreviews && form.formData.imagePreviews.length > 0 ? (
                <>
                  <p>Click to add more images</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px', marginTop: '16px' }}>
                    {form.formData.imagePreviews.map((preview, idx) => (
                      <div key={idx} style={{ position: 'relative' }}>
                        <ImagePreview
                          src={preview}
                          alt={`Preview ${idx + 1}`}
                          style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            form.handleRemoveImage(idx);
                          }}
                          style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            background: '#ff4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            width: '24px',
                            height: '24px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            padding: '0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Remove this image"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: '12px', color: '#999', marginTop: '12px' }}>
                    {form.formData.imagePreviews.length} image{form.formData.imagePreviews.length !== 1 ? 's' : ''} selected
                  </p>
                </>
              ) : (
                <>
                  <p>📸</p>
                  <p>Click to upload service images</p>
                  <p>JPEG, PNG, WebP, or GIF (Max 5MB per image)</p>
                </>
              )}
            </ImageUploadContainer>
            <FileInput
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={form.handleImageChange}
            />
            {form.errors.image && (
              <ErrorMessage>
                <AlertCircle />
                {form.errors.image}
              </ErrorMessage>
            )}
            {form.formData.imagePreviews && form.formData.imagePreviews.length > 0 && (
              <button
                type="button"
                onClick={form.handleClearImages}
                style={{
                  marginTop: '12px',
                  padding: '8px 16px',
                  background: '#f9f9f9',
                  color: '#1a1a1a',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Clear All Images
              </button>
            )}
          </FormGroup>
        </FormSection>

        {/* Service Options/Packages */}
        <ServiceOptionsForm
          options={form.formData.options || []}
          onChange={(options) => {
            form.formData.options = options;
          }}
          disabled={form.submitting}
        />

        {/* Tags */}
        <FormSection>
          <SectionTitle>Tags (Optional)</SectionTitle>

          <FormGroup>
            <Label>Add Tags to Help Customers Find Your Service</Label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <TagInput
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagKeyPress}
                placeholder="Add a tag and press Enter"
                disabled={form.submitting}
              />
              <Button
                type="button"
                onClick={handleAddTag}
                disabled={form.submitting || !tagInput.trim()}
                style={{ flex: '0 0 auto', padding: '10px 16px' }}
              >
                Add
              </Button>
            </div>
            <TagsContainer>
              {form.formData.tags && form.formData.tags.map(tag => (
                <Tag key={tag}>
                  {tag}
                  <button
                    type="button"
                    onClick={() => form.handleRemoveTag(tag)}
                    disabled={form.submitting}
                  >
                    ✕
                  </button>
                </Tag>
              ))}
            </TagsContainer>
          </FormGroup>
        </FormSection>

        {/* Preferences */}
        <FormSection>
          <SectionTitle>Preferences</SectionTitle>

          <CheckboxGroup>
            <CheckboxLabel>
              <input
                type="checkbox"
                name="allowOffers"
                checked={form.formData.allowOffers}
                onChange={form.handleInputChange}
                disabled={form.submitting}
              />
              Allow price offers from customers
            </CheckboxLabel>

            <CheckboxLabel>
              <input
                type="checkbox"
                name="allowMessages"
                checked={form.formData.allowMessages}
                onChange={form.handleInputChange}
                disabled={form.submitting}
              />
              Allow messages from customers
            </CheckboxLabel>
          </CheckboxGroup>
        </FormSection>

        {/* Buttons */}
        <ButtonGroup>
          <Button
            type="button"
            onClick={handleCancel}
            disabled={form.submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            primary
            disabled={form.submitting || form.isCreating || form.isUpdating}
          >
            {form.submitting || form.isCreating || form.isUpdating
              ? 'Creating...'
              : initialService
              ? 'Update Service'
              : 'Create Service'}
          </Button>
        </ButtonGroup>
      </FormStack>
    </FormContainer>
  );
}

