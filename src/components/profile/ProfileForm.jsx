/**
 * ProfileForm Component - Edit user profile with mobile-first design
 * Matches signup form styling with dark theme
 */

'use client';

import styled from 'styled-components';
import { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FaCamera, FaSpinner, FaTrash } from 'react-icons/fa';
import * as profileService from '@/services/profile';
import { useAuth } from '@/hooks/useAuth';

/* =================== FORM CONTAINER =================== */
const FormContainer = styled.div`
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  padding: 16px;
  width: 100%;

  @media (min-width: 768px) {
    border-radius: 14px;
    padding: 20px;
  }

  @media (min-width: 1024px) {
    border-radius: 16px;
    padding: 24px;
  }
`;

/* =================== FORM SECTIONS =================== */
const FormSection = styled.div`
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;

  &:last-child {
    margin-bottom: 0;
  }

  @media (min-width: 768px) {
    margin-bottom: 28px;
    gap: 16px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 13px;
  font-weight: 700;
  margin: 0;
  color: #1a1a1a;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

/* =================== FORM GROUPS & INPUTS =================== */
const FormGroup = styled.div`
  position: relative;
  margin-bottom: 0;
`;

const Label = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (min-width: 768px) {
    font-size: 13px;
    margin-bottom: 10px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: none;
  background: #f8f8f8;
  border-radius: 10px;
  font-size: 14px;
  color: #333;
  outline: none;
  transition: all 0.3s ease;

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
    padding: 16px 18px;
    border-radius: 12px;
    font-size: 15px;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 14px 16px;
  border: none;
  background: #f8f8f8;
  border-radius: 10px;
  font-size: 14px;
  color: #333;
  font-family: inherit;
  outline: none;
  resize: vertical;
  min-height: 100px;
  transition: all 0.3s ease;

  &::placeholder {
    color: #aaa;
  }

  &:focus {
    background: #ffffff;
    box-shadow: 0 0 0 2px rgba(26, 26, 26, 0.1);
  }

  @media (min-width: 768px) {
    padding: 16px 18px;
    border-radius: 12px;
    font-size: 15px;
    min-height: 120px;
  }
`;

/* =================== AVATAR SECTION =================== */
const AvatarSection = styled.div`
  display: flex;
  gap: 14px;
  align-items: flex-start;

  @media (min-width: 768px) {
    gap: 18px;
  }
`;

const AvatarPreview = styled.img`
  width: 80px;
  height: 80px;
  min-width: 80px;
  border-radius: 12px;
  object-fit: cover;
  border: 2px solid #f0f0f0;
  background: #f8f8f8;

  @media (min-width: 768px) {
    width: 100px;
    height: 100px;
    min-width: 100px;
    border-radius: 14px;
    border-width: 3px;
  }
`;

const AvatarControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;

  @media (min-width: 768px) {
    gap: 12px;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const UploadButton = styled.button`
  background: #1a1a1a;
  color: white;
  border: none;
  padding: 11px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (min-width: 768px) {
    padding: 13px 18px;
    font-size: 13px;
    border-radius: 10px;
    gap: 10px;
  }

  @media (hover: hover) {
    &:hover:not(:disabled) {
      background: #333;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }

  svg {
    font-size: 14px;

    @media (min-width: 768px) {
      font-size: 16px;
    }
  }
`;

const DeleteButton = styled(UploadButton)`
  background: #f5f5f5;
  color: #d32f2f;

  @media (hover: hover) {
    &:hover:not(:disabled) {
      background: #ffe0e0;
    }
  }
`;

/* =================== ACTION BUTTONS =================== */
const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 24px;

  @media (min-width: 768px) {
    gap: 12px;
    margin-top: 28px;
  }
`;

const SaveButton = styled.button`
  flex: 1;
  background: #1a1a1a;
  color: white;
  border: none;
  padding: 14px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (min-width: 768px) {
    padding: 16px 24px;
    border-radius: 12px;
    font-size: 14px;
  }

  @media (hover: hover) {
    &:hover:not(:disabled) {
      background: #333;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }

  svg {
    animation: spin 1s linear infinite;

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  }
`;

const CancelButton = styled(SaveButton)`
  background: #f0f0f0;
  color: #1a1a1a;

  @media (hover: hover) {
    &:hover:not(:disabled) {
      background: #e0e0e0;
    }
  }
`;

/* =================== MESSAGE STYLES =================== */
const ErrorMessage = styled.div`
  background: #fee;
  color: #c00;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 13px;
  border: 1px solid #fcc;

  @media (min-width: 768px) {
    padding: 14px;
    border-radius: 10px;
    font-size: 14px;
  }
`;

const SuccessMessage = styled.div`
  background: #f0f8f0;
  color: #1b8a1b;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 13px;
  border: 1px solid #c8e6c9;

  @media (min-width: 768px) {
    padding: 14px;
    border-radius: 10px;
    font-size: 14px;
  }
`;

export const ProfileForm = ({ onSave, onCancel }) => {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || '',
    phoneNumber: currentUser?.phoneNumber || '',
    bio: currentUser?.bio || '',
    department: currentUser?.department || '',
    graduationYear: currentUser?.graduationYear || '',
    socialLinks: currentUser?.socialLinks || []
  });

  const [avatar, setAvatar] = useState(currentUser?.avatar?.url || '');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const updateMutation = useMutation({
    mutationFn: (data) => profileService.updateProfile(data),
    onSuccess: () => {
      setSuccess('Profile updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['user'] });
      setTimeout(() => {
        onSave?.();
      }, 1000);
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: (avatarData) => profileService.uploadAvatar(avatarData),
    onSuccess: () => {
      setSuccess('Avatar uploaded successfully!');
      setUploadingImage(false);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Failed to upload avatar');
      setUploadingImage(false);
    }
  });

  const deleteAvatarMutation = useMutation({
    mutationFn: () => profileService.deleteAvatar(),
    onSuccess: () => {
      setAvatar('');
      setSuccess('Avatar deleted');
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Failed to delete avatar');
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setError('');
    setUploadingImage(true);

    // Convert to base64
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const base64 = event.target?.result;
        setAvatar(base64);
        
        // Upload to backend
        await uploadAvatarMutation.mutateAsync({
          url: base64,
          publicId: null
        });
      } catch (err) {
        console.error('Upload error:', err);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clean up empty fields
    const cleanedData = {};
    Object.keys(formData).forEach(key => {
      const value = formData[key];
      // Only include non-empty values
      if (value !== '' && value !== null && value !== undefined) {
        cleanedData[key] = value;
      }
    });
    
    await updateMutation.mutateAsync(cleanedData);
  };

  if (!currentUser) return <div>Loading...</div>;

  return (
    <FormContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <FileInput 
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
      />

      <form onSubmit={handleSubmit}>
        {/* Avatar Section */}
        <FormSection>
          <SectionTitle>Profile Picture</SectionTitle>
          <AvatarSection>
            <AvatarPreview src={avatar || 'https://via.placeholder.com/150?text=Avatar'} alt="Avatar" />
            <AvatarControls>
              <UploadButton 
                type="button" 
                onClick={handleUploadClick}
                disabled={updateMutation.isPending || uploadingImage}
              >
                <FaCamera /> {uploadingImage ? 'Uploading...' : 'Upload Photo'}
              </UploadButton>
              {avatar && (
                <DeleteButton 
                  type="button"
                  onClick={() => deleteAvatarMutation.mutate()}
                  disabled={deleteAvatarMutation.isPending}
                >
                  <FaTrash /> Remove
                </DeleteButton>
              )}
            </AvatarControls>
          </AvatarSection>
        </FormSection>

        {/* Basic Info */}
        <FormSection>
          <SectionTitle>Basic Information</SectionTitle>

          <FormGroup>
            <Label>Full Name</Label>
            <Input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              disabled={updateMutation.isPending}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Phone Number</Label>
            <Input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              disabled={updateMutation.isPending}
            />
          </FormGroup>

          <FormGroup>
            <Label>Bio</Label>
            <Textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              disabled={updateMutation.isPending}
              placeholder="Tell us about yourself..."
            />
          </FormGroup>
        </FormSection>

        {/* Academic Info */}
        <FormSection>
          <SectionTitle>Academic Information</SectionTitle>

          <FormGroup>
            <Label>Department</Label>
            <Input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              disabled={updateMutation.isPending}
            />
          </FormGroup>

          <FormGroup>
            <Label>Graduation Year</Label>
            <Input
              type="number"
              name="graduationYear"
              value={formData.graduationYear}
              onChange={handleChange}
              disabled={updateMutation.isPending}
              min={new Date().getFullYear()}
              max={new Date().getFullYear() + 10}
            />
          </FormGroup>
        </FormSection>

        {/* Buttons */}
        <ButtonGroup>
          <CancelButton type="button" onClick={onCancel}>
            Cancel
          </CancelButton>
          <SaveButton type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending && <FaSpinner className="spin" />}
            Save Changes
          </SaveButton>
        </ButtonGroup>
      </form>
    </FormContainer>
  );
};
