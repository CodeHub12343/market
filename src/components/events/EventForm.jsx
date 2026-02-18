'use client';

import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useEventForm } from '@/hooks/useEventForm';
import { useAuth } from '@/hooks/useAuth';
import { useEventCategories } from '@/hooks/useCategories';
import { AlertCircle, Check } from 'lucide-react';
import EventTagPicker from './EventTagPicker';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 768px) {
    gap: 20px;
  }
`;

const FormGroup = styled.div`
  position: relative;
  margin-bottom: 0;
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: block;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: none;
  background: #f5f5f5;
  border-radius: 10px;
  font-size: 16px;
  color: #1a1a1a;
  outline: none;
  transition: all 0.2s;

  &::placeholder {
    color: #999;
  }

  &:focus {
    background: #f0f0f0;
    box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: #f0f0f0;
  }

  @media (min-width: 768px) {
    padding: 16px 18px;
    font-size: 15px;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 14px 16px;
  border: none;
  background: #f5f5f5;
  border-radius: 10px;
  font-size: 16px;
  color: #1a1a1a;
  outline: none;
  cursor: pointer;
  transition: all 0.2s;

  option {
    background: white;
    color: #1a1a1a;
  }

  &:focus {
    background: #f0f0f0;
    box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: #f0f0f0;
  }

  @media (min-width: 768px) {
    padding: 16px 18px;
    font-size: 15px;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 14px 16px;
  border: none;
  background: #f5f5f5;
  border-radius: 10px;
  font-size: 16px;
  color: #1a1a1a;
  outline: none;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s;

  &::placeholder {
    color: #999;
  }

  &:focus {
    background: #f0f0f0;
    box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: #f0f0f0;
  }

  @media (min-width: 768px) {
    padding: 16px 18px;
    font-size: 15px;
  }
`;

const FormSection = styled.div`
  border-top: 1px solid #e5e7eb;
  padding-top: 20px;
  margin-top: 20px;

  &:first-of-type {
    border-top: none;
    padding-top: 0;
    margin-top: 0;
  }

  @media (min-width: 768px) {
    padding-top: 24px;
    margin-top: 24px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 16px 0;

  @media (min-width: 768px) {
    font-size: 15px;
    margin-bottom: 18px;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 36px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  user-select: none;
  margin-bottom: 12px;
  transition: color 0.2s;

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  &:hover {
    color: #000;
  }

  &:hover span {
    border-color: #1a1a1a;
    box-shadow: 0 0 0 2px rgba(26, 26, 26, 0.08);
  }

  @media (min-width: 768px) {
    font-size: 15px;
    padding-left: 38px;
    margin-bottom: 14px;
  }
`;

const Checkmark = styled.span`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 22px;
  width: 22px;
  background-color: white;
  border: 2px solid #d1d5db;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  input:checked & {
    background-color: #1a1a1a;
    border-color: #1a1a1a;
    box-shadow: 0 2px 4px rgba(26, 26, 26, 0.15);
  }

  &:after {
    content: "";
    position: absolute;
    display: none;
    width: 6px;
    height: 11px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  input:checked &:after {
    display: block;
  }

  @media (min-width: 768px) {
    height: 24px;
    width: 24px;

    &:after {
      height: 12px;
      width: 7px;
    }
  }
`;

const FileInputContainer = styled.div`
  border: 2px dashed #d1d5db;
  border-radius: 10px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #999;
    background: #f9f9f9;
  }

  @media (min-width: 768px) {
    padding: 28px;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  cursor: pointer;
  font-size: 14px;
  color: #666;

  strong {
    color: #1a1a1a;
    font-weight: 600;
  }

  @media (min-width: 768px) {
    font-size: 15px;
  }
`;

const PreviewContainer = styled.div`
  position: relative;
  width: 100%;
  height: 180px;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 12px;

  @media (min-width: 768px) {
    height: 200px;
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: background 0.2s;

  &:hover {
    background: rgba(220, 38, 38, 1);
  }

  @media (min-width: 768px) {
    padding: 8px 14px;
    font-size: 13px;
  }
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c00;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  border: 1px solid #fcc;
  display: flex;
  align-items: center;
  gap: 10px;

  @media (min-width: 768px) {
    padding: 14px;
    font-size: 15px;
  }
`;

const SuccessMessage = styled.div`
  background: #efe;
  color: #080;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  border: 1px solid #cfc;
  display: flex;
  align-items: center;
  gap: 10px;

  @media (min-width: 768px) {
    padding: 14px;
    font-size: 15px;
  }
`;

const ErrorText = styled.span`
  font-size: 12px;
  color: #c00;
  margin-top: 6px;
  display: block;

  @media (min-width: 768px) {
    font-size: 13px;
    margin-top: 8px;
  }
`;

const HelperText = styled.span`
  font-size: 12px;
  color: #999;
  margin-top: 6px;
  display: block;

  @media (min-width: 768px) {
    font-size: 13px;
    margin-top: 8px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 24px;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 12px;
    margin-top: 28px;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 14px;
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background: #000;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (min-width: 768px) {
    flex: 1;
    padding: 16px;
    font-size: 15px;
  }
`;

const CancelButton = styled.button`
  width: 100%;
  padding: 14px;
  background: #f5f5f5;
  color: #666;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f0f0f0;
    color: #333;
  }

  @media (min-width: 768px) {
    flex: 1;
    padding: 16px;
    font-size: 15px;
  }
`;

export default function EventForm({
  initialEvent = null,
  onSubmit,
  isLoading = false,
  error = null,
  success = null,
  onCancel = null
}) {
  const { user } = useAuth();
  const { data: categories = [], isLoading: categoriesLoading } = useEventCategories();
  const {
    formData,
    handleInputChange,
    handleNestedChange,
    handleTagsChange,
    previewBanner,
    bannerFile,
    handleBannerChange,
    removeBanner,
    validateForm,
    errors,
    resetForm
  } = useEventForm(initialEvent, user?.campus?._id || user?.campus);

  const campusDisplayName = typeof user?.campus === 'object' ? user?.campus?.name : user?.campus || 'Not assigned';
  const tagsString = formData.tags.join(', ');

  // Auto-fill campus from logged-in user for new events
  useEffect(() => {
    if (!initialEvent && user?.campus) {
      const campusId = typeof user.campus === 'object' ? user.campus._id : user.campus;
      if (campusId && formData.campus !== campusId) {
        handleInputChange({
          target: { name: 'campus', value: campusId }
        });
      }
    }
  }, [user?.campus, initialEvent, handleInputChange, formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitData = {
      title: formData.title,
      description: formData.description,
      date: formData.date,
      endDate: formData.endDate,
      location: formData.location,
      campus: formData.campus,
      category: formData.category,
      visibility: formData.visibility,
      capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
      tags: formData.tags,
      registrationRequired: formData.registrationRequired,
      ...(formData.registrationRequired && formData.registrationDeadline && {
        registrationDeadline: formData.registrationDeadline
      }),
      ...(formData.requirements && { requirements: formData.requirements }),
      contactInfo: {
        ...(formData.contactInfo.email && { email: formData.contactInfo.email }),
        ...(formData.contactInfo.phone && { phone: formData.contactInfo.phone }),
        ...(formData.contactInfo.website && { website: formData.contactInfo.website })
      },
      settings: formData.settings,
      timezone: formData.timezone,
      reminderDays: parseInt(formData.settings.reminderDays)
    };

    onSubmit(submitData, bannerFile);
  };

  return (
    <>
      {error && (
        <ErrorMessage>
          <AlertCircle size={18} />
          {error}
        </ErrorMessage>
      )}

      {success && (
        <SuccessMessage>
          <Check size={18} />
          {success}
        </SuccessMessage>
      )}

      <Form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <FormSection>
          <SectionTitle>Event Basics</SectionTitle>

          <FormGroup>
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Annual Tech Symposium"
              required
            />
            {errors.title && <ErrorText>{errors.title}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="description">Description</Label>
            <TextArea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Tell people about your event..."
            />
          </FormGroup>

          <FormGrid>
            <FormGroup>
              <Label htmlFor="category">Category *</Label>
              <Select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                disabled={categoriesLoading}
              >
                <option value="">
                  {categoriesLoading ? 'Loading categories...' : 'Select a category'}
                </option>
                {Array.isArray(categories) && categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="visibility">Visibility *</Label>
              <Select
                id="visibility"
                name="visibility"
                value={formData.visibility}
                onChange={handleInputChange}
              >
                <option value="public">Public</option>
                <option value="campus">Campus Only</option>
                <option value="private">Private</option>
              </Select>
            </FormGroup>
          </FormGrid>
        </FormSection>

        {/* Date & Time */}
        <FormSection>
          <SectionTitle>Date & Time</SectionTitle>

          <FormGrid>
            <FormGroup>
              <Label htmlFor="date">Start Date & Time *</Label>
              <Input
                id="date"
                name="date"
                type="datetime-local"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
              {errors.date && <ErrorText>{errors.date}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="endDate">End Date & Time</Label>
              <Input
                id="endDate"
                name="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={handleInputChange}
              />
              {errors.endDate && <ErrorText>{errors.endDate}</ErrorText>}
            </FormGroup>
          </FormGrid>

          <FormGroup>
            <Label htmlFor="timezone">Timezone</Label>
            <Select
              id="timezone"
              name="timezone"
              value={formData.timezone}
              onChange={handleInputChange}
            >
              <option value="UTC">UTC</option>
              <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
              <option value="Africa/Cairo">Africa/Cairo (EAT)</option>
              <option value="Europe/London">Europe/London (GMT/BST)</option>
              <option value="America/New_York">America/New_York (EST/EDT)</option>
            </Select>
          </FormGroup>
        </FormSection>

        {/* Location */}
        <FormSection>
          <SectionTitle>Location</SectionTitle>

          <FormGrid>
            <FormGroup>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Main Auditorium"
                required
              />
              {errors.location && <ErrorText>{errors.location}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="campus">Campus *</Label>
              <Input
                id="campus"
                name="campus"
                type="text"
                value={campusDisplayName}
                disabled
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
              <HelperText>Auto-assigned from your account</HelperText>
            </FormGroup>
          </FormGrid>
        </FormSection>

        {/* Attendance */}
        <FormSection>
          <SectionTitle>Attendance</SectionTitle>

          <FormGroup>
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={handleInputChange}
              placeholder="e.g., 300"
              min="1"
            />
            {errors.capacity && <ErrorText>{errors.capacity}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <CheckboxLabel>
              <input
                name="registrationRequired"
                type="checkbox"
                checked={formData.registrationRequired}
                onChange={handleInputChange}
              />
              <Checkmark />
              Registration Required
            </CheckboxLabel>
          </FormGroup>

          {formData.registrationRequired && (
            <FormGroup>
              <Label htmlFor="registrationDeadline">Registration Deadline *</Label>
              <Input
                id="registrationDeadline"
                name="registrationDeadline"
                type="datetime-local"
                value={formData.registrationDeadline}
                onChange={handleInputChange}
              />
              {errors.registrationDeadline && <ErrorText>{errors.registrationDeadline}</ErrorText>}
            </FormGroup>
          )}

          <FormGroup>
            <Label htmlFor="requirements">Requirements</Label>
            <TextArea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleInputChange}
              placeholder="e.g., Bring your student ID..."
              style={{ minHeight: '80px' }}
            />
          </FormGroup>
        </FormSection>

        {/* Contact Information */}
        <FormSection>
          <SectionTitle>Contact Information</SectionTitle>

          <FormGrid>
            <FormGroup>
              <Label htmlFor="contactEmail">Email</Label>
              <Input
                id="contactEmail"
                name="email"
                type="email"
                value={formData.contactInfo.email}
                onChange={(e) => handleNestedChange('contactInfo', 'email', e.target.value)}
                placeholder="events@university.edu"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="contactPhone">Phone</Label>
              <Input
                id="contactPhone"
                name="phone"
                type="tel"
                value={formData.contactInfo.phone}
                onChange={(e) => handleNestedChange('contactInfo', 'phone', e.target.value)}
                placeholder="+2348012345678"
              />
            </FormGroup>
          </FormGrid>

          <FormGroup>
            <Label htmlFor="contactWebsite">Website</Label>
            <Input
              id="contactWebsite"
              name="website"
              type="url"
              value={formData.contactInfo.website}
              onChange={(e) => handleNestedChange('contactInfo', 'website', e.target.value)}
              placeholder="https://university.edu/events"
            />
          </FormGroup>

          <FormGroup>
            <Label>Tags</Label>
            <EventTagPicker
              selectedTags={formData.tags}
              onTagsChange={(tags) => handleInputChange({
                target: { name: 'tags', value: tags }
              })}
              maxTags={10}
              placeholder="Select or create tags..."
            />
          </FormGroup>
        </FormSection>

        {/* Banner Image */}
        <FormSection>
          <SectionTitle>Event Banner</SectionTitle>

          <FormGroup>
            <FileInputContainer>
              <FileInput
                id="banner"
                name="banner"
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
              />
              <FileInputLabel htmlFor="banner">
                <strong>Click to upload</strong> or drag and drop
                <br />
                PNG, JPG or GIF (max 5MB)
              </FileInputLabel>
            </FileInputContainer>

            {previewBanner && (
              <PreviewContainer>
                <PreviewImage src={previewBanner} alt="Banner preview" />
                <RemoveButton onClick={removeBanner} type="button">
                  Remove
                </RemoveButton>
              </PreviewContainer>
            )}
          </FormGroup>
        </FormSection>

        {/* Event Settings */}
        <FormSection>
          <SectionTitle>Settings</SectionTitle>

          <FormGroup>
            <CheckboxLabel>
              <input
                type="checkbox"
                checked={formData.settings.allowComments}
                onChange={(e) => handleNestedChange('settings', 'allowComments', e.target.checked)}
              />
              <Checkmark />
              Allow Comments
            </CheckboxLabel>
          </FormGroup>

          <FormGroup>
            <CheckboxLabel>
              <input
                type="checkbox"
                checked={formData.settings.allowRatings}
                onChange={(e) => handleNestedChange('settings', 'allowRatings', e.target.checked)}
              />
              <Checkmark />
              Allow Ratings
            </CheckboxLabel>
          </FormGroup>

          <FormGroup>
            <CheckboxLabel>
              <input
                type="checkbox"
                checked={formData.settings.allowSharing}
                onChange={(e) => handleNestedChange('settings', 'allowSharing', e.target.checked)}
              />
              <Checkmark />
              Allow Sharing
            </CheckboxLabel>
          </FormGroup>

          <FormGroup>
            <CheckboxLabel>
              <input
                type="checkbox"
                checked={formData.settings.sendReminders}
                onChange={(e) => handleNestedChange('settings', 'sendReminders', e.target.checked)}
              />
              <Checkmark />
              Send Reminders
            </CheckboxLabel>
          </FormGroup>

          {formData.settings.sendReminders && (
            <FormGroup>
              <Label htmlFor="reminderDays">Reminder Days Before Event</Label>
              <Input
                id="reminderDays"
                type="number"
                value={formData.settings.reminderDays}
                onChange={(e) => handleNestedChange('settings', 'reminderDays', parseInt(e.target.value))}
                min="1"
              />
            </FormGroup>
          )}

          <FormGroup>
            <CheckboxLabel>
              <input
                type="checkbox"
                checked={formData.settings.autoArchive}
                onChange={(e) => handleNestedChange('settings', 'autoArchive', e.target.checked)}
              />
              <Checkmark />
              Auto Archive
            </CheckboxLabel>
          </FormGroup>

          {formData.settings.autoArchive && (
            <FormGroup>
              <Label htmlFor="archiveAfterDays">Archive After (days)</Label>
              <Input
                id="archiveAfterDays"
                type="number"
                value={formData.settings.archiveAfterDays}
                onChange={(e) => handleNestedChange('settings', 'archiveAfterDays', parseInt(e.target.value))}
                min="1"
              />
            </FormGroup>
          )}
        </FormSection>

        {/* Action Buttons */}
        <ButtonGroup>
          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : initialEvent ? 'Update Event' : 'Create Event'}
          </SubmitButton>
          <CancelButton type="button" onClick={onCancel || resetForm}>
            Cancel
          </CancelButton>
        </ButtonGroup>
      </Form>
    </>
  );
}
