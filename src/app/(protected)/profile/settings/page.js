/**
 * Settings Page - Mobile-first redesign with unique complex layouts
 * Matches dashboard design patterns and colors
 */

'use client';

import styled from 'styled-components';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FaToggleOn, FaToggleOff, FaBell, FaShieldAlt, FaTrash, FaSpinner, FaArrowLeft, FaCog, FaGlobe, FaDollarSign } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { BottomNav } from '@/components/bottom-nav';
import * as profileService from '@/services/profile';

/* =================== PAGE LAYOUT =================== */
const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f5f5f5;

  @media (max-width: 1023px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.aside`
  display: none;

  @media (min-width: 1024px) {
    display: flex;
    width: 80px;
    background: #ffffff;
    border-right: 1px solid #f0f0f0;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 100;
  }
`;

const MainContent = styled.main`
  flex: 1;
  width: 100%;
  background: #ffffff;
  min-height: 100vh;
  padding-bottom: 100px;

  @media (min-width: 1024px) {
    margin-left: 80px;
    padding-bottom: 40px;
    background: #f9f9f9;
  }
`;

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;

  @media (min-width: 768px) {
    gap: 20px;
    padding: 20px;
  }

  @media (min-width: 1024px) {
    padding: 24px;
    gap: 24px;
    max-width: 700px;
  }
`;

const BottomNavWrapper = styled.div`
  @media (max-width: 1023px) {
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 100;
  }

  @media (min-width: 1024px) {
    display: none;
  }
`;

/* =================== HEADER SECTION =================== */
const HeaderCard = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border-radius: 14px;
  padding: 16px;
  color: white;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  overflow: hidden;

  @media (min-width: 768px) {
    padding: 20px;
    border-radius: 16px;
    gap: 16px;
  }

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%);
    animation: pulse 4s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
`;

const BackButton = styled.button`
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.95);
  }

  @media (min-width: 768px) {
    width: 44px;
    height: 44px;
    min-width: 44px;
    border-radius: 12px;
    font-size: 20px;
  }

  @media (hover: hover) {
    &:hover {
      background: rgba(255, 255, 255, 0.25);
    }
  }
`;

const HeaderContent = styled.div`
  flex: 1;
  position: relative;
  z-index: 1;
`;

const HeaderTitle = styled.h1`
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  line-height: 1.3;

  @media (min-width: 768px) {
    font-size: 18px;
  }
`;

const HeaderSubtitle = styled.p`
  font-size: 12px;
  opacity: 0.8;
  margin: 4px 0 0 0;

  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

/* =================== SETTINGS SECTIONS =================== */
const SettingSection = styled.div`
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  overflow: hidden;

  @media (min-width: 768px) {
    border-radius: 14px;
  }
`;

const SectionHeader = styled.div`
  padding: 14px 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fafafa;

  @media (min-width: 768px) {
    padding: 16px 20px;
    gap: 12px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 13px;
  font-weight: 700;
  margin: 0;
  color: #1a1a1a;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (min-width: 768px) {
    font-size: 14px;
    gap: 10px;
  }

  svg {
    font-size: 14px;
    color: #1a1a1a;

    @media (min-width: 768px) {
      font-size: 16px;
    }
  }
`;

const SettingsList = styled.div`
  display: flex;
  flex-direction: column;
`;

/* =================== SETTING ITEM =================== */
const SettingItem = styled.div`
  padding: 14px 16px;
  border-bottom: 1px solid #f5f5f5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;

  &:last-child {
    border-bottom: none;
  }

  @media (min-width: 768px) {
    padding: 16px 20px;
    gap: 16px;
  }
`;

const SettingLabel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SettingTitle = styled.div`
  font-weight: 600;
  color: #1a1a1a;
  font-size: 13px;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const SettingDescription = styled.div`
  font-size: 11px;
  color: #999;
  font-weight: 500;

  @media (min-width: 768px) {
    font-size: 12px;
  }
`;

const SettingControl = styled.div`
  display: flex;
  align-items: center;
`;

/* =================== TOGGLE & SELECT =================== */
const Toggle = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 26px;
  color: ${props => props.active ? '#1a1a1a' : '#ddd'};
  transition: color 0.3s ease;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:active {
    transform: scale(0.95);
  }

  @media (min-width: 768px) {
    font-size: 28px;
  }

  @media (hover: hover) {
    &:hover {
      color: ${props => props.active ? '#333' : '#ccc'};
    }
  }
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
  background: white;
  color: #333;
  font-weight: 500;
  transition: all 0.3s ease;

  @media (min-width: 768px) {
    padding: 10px 14px;
    font-size: 13px;
    border-radius: 10px;
  }

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 2px rgba(26, 26, 26, 0.05);
  }
`;

/* =================== DANGER BUTTON =================== */
const DangerButton = styled.button`
  width: 100%;
  background: #d32f2f;
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  margin: 14px 16px;

  @media (min-width: 768px) {
    padding: 14px 20px;
    font-size: 14px;
    margin: 16px 20px;
    border-radius: 12px;
    gap: 10px;
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (hover: hover) {
    &:hover:not(:disabled) {
      background: #b71c1c;
      box-shadow: 0 4px 12px rgba(211, 47, 47, 0.2);
    }
  }

  svg {
    font-size: 16px;

    @media (min-width: 768px) {
      font-size: 18px;
    }
  }
`;

/* =================== DIALOG/MODAL =================== */
const ConfirmDialog = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;

  @media (min-width: 768px) {
    align-items: center;
  }
`;

const DialogContent = styled.div`
  background: white;
  border-radius: 16px 16px 0 0;
  padding: 20px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);

  @media (min-width: 768px) {
    border-radius: 16px;
    padding: 28px;
    width: auto;
  }
`;

const DialogTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: #d32f2f;

  @media (min-width: 768px) {
    font-size: 18px;
    margin-bottom: 14px;
  }
`;

const DialogMessage = styled.p`
  color: #666;
  margin: 0 0 16px 0;
  font-size: 13px;
  line-height: 1.5;

  @media (min-width: 768px) {
    font-size: 14px;
    margin-bottom: 20px;
  }
`;

const PasswordInput = styled.input`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  font-size: 13px;
  margin-bottom: 14px;
  box-sizing: border-box;
  transition: all 0.3s ease;

  @media (min-width: 768px) {
    padding: 14px 16px;
    font-size: 14px;
    margin-bottom: 16px;
    border-radius: 12px;
  }

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 2px rgba(26, 26, 26, 0.1);
  }

  &::placeholder {
    color: #aaa;
  }
`;

const DialogButtons = styled.div`
  display: flex;
  gap: 10px;

  @media (min-width: 768px) {
    gap: 12px;
  }
`;

const DialogButton = styled.button`
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  @media (min-width: 768px) {
    padding: 14px;
    font-size: 14px;
    border-radius: 12px;
    gap: 10px;
  }

  &:active {
    transform: scale(0.98);
  }

  @media (hover: hover) {
    &:hover:not(:disabled) {
      transform: translateY(-2px);
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

const DialogCancelButton = styled(DialogButton)`
  background: #f0f0f0;
  color: #1a1a1a;

  @media (hover: hover) {
    &:hover {
      background: #e0e0e0;
    }
  }
`;

const DialogConfirmButton = styled(DialogButton)`
  background: #d32f2f;
  color: white;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (hover: hover) {
    &:hover:not(:disabled) {
      background: #b71c1c;
      box-shadow: 0 4px 12px rgba(211, 47, 47, 0.2);
    }
  }
`;

export default function SettingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    profileVisibility: 'public',
    language: 'en',
    currency: 'USD'
  });

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  const preferenceMutation = useMutation({
    mutationFn: (prefs) => profileService.updatePreferences(prefs),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    }
  });

  const deleteAccountMutation = useMutation({
    mutationFn: (password) => profileService.deleteAccount(password),
    onSuccess: () => {
      window.location.href = '/login';
    }
  });

  const handlePreferenceChange = (key, value) => {
    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);
    preferenceMutation.mutate(newPrefs);
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) return;
    await deleteAccountMutation.mutateAsync(deletePassword);
  };

  return (
    <PageWrapper>
      <Sidebar>
        <BottomNav active="profile" />
      </Sidebar>

      <MainContent>
        <ContentArea>
          {/* Header Card */}
          <HeaderCard>
            <BackButton onClick={() => router.back()} title="Go back">
              <FaArrowLeft />
            </BackButton>
            <HeaderContent>
              <HeaderTitle>Settings</HeaderTitle>
              <HeaderSubtitle>Manage your preferences</HeaderSubtitle>
            </HeaderContent>
          </HeaderCard>

          {/* ===== NOTIFICATIONS SECTION ===== */}
          <SettingSection>
            <SectionHeader>
              <FaBell />
              <SectionTitle>Notifications</SectionTitle>
            </SectionHeader>
            <SettingsList>
              <SettingItem>
                <SettingLabel>
                  <SettingTitle>Email Notifications</SettingTitle>
                  <SettingDescription>Receive email updates about activity</SettingDescription>
                </SettingLabel>
                <SettingControl>
                  <Toggle
                    active={preferences.emailNotifications}
                    onClick={() => handlePreferenceChange('emailNotifications', !preferences.emailNotifications)}
                    title={preferences.emailNotifications ? 'Disable' : 'Enable'}
                  >
                    {preferences.emailNotifications ? <FaToggleOn /> : <FaToggleOff />}
                  </Toggle>
                </SettingControl>
              </SettingItem>

              <SettingItem>
                <SettingLabel>
                  <SettingTitle>Push Notifications</SettingTitle>
                  <SettingDescription>Receive push notifications on your device</SettingDescription>
                </SettingLabel>
                <SettingControl>
                  <Toggle
                    active={preferences.pushNotifications}
                    onClick={() => handlePreferenceChange('pushNotifications', !preferences.pushNotifications)}
                    title={preferences.pushNotifications ? 'Disable' : 'Enable'}
                  >
                    {preferences.pushNotifications ? <FaToggleOn /> : <FaToggleOff />}
                  </Toggle>
                </SettingControl>
              </SettingItem>
            </SettingsList>
          </SettingSection>

          {/* ===== PRIVACY SECTION ===== */}
          <SettingSection>
            <SectionHeader>
              <FaShieldAlt />
              <SectionTitle>Privacy</SectionTitle>
            </SectionHeader>
            <SettingsList>
              <SettingItem>
                <SettingLabel>
                  <SettingTitle>Profile Visibility</SettingTitle>
                  <SettingDescription>Who can see your profile</SettingDescription>
                </SettingLabel>
                <SettingControl>
                  <Select
                    value={preferences.profileVisibility}
                    onChange={(e) => handlePreferenceChange('profileVisibility', e.target.value)}
                  >
                    <option value="public">Public</option>
                    <option value="campus-only">Campus Only</option>
                    <option value="private">Private</option>
                  </Select>
                </SettingControl>
              </SettingItem>
            </SettingsList>
          </SettingSection>

          {/* ===== PREFERENCES SECTION ===== */}
          <SettingSection>
            <SectionHeader>
              <FaCog />
              <SectionTitle>Preferences</SectionTitle>
            </SectionHeader>
            <SettingsList>
              <SettingItem>
                <SettingLabel>
                  <SettingTitle>Language</SettingTitle>
                  <SettingDescription>Choose your preferred language</SettingDescription>
                </SettingLabel>
                <SettingControl>
                  <Select
                    value={preferences.language}
                    onChange={(e) => handlePreferenceChange('language', e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                  </Select>
                </SettingControl>
              </SettingItem>

              <SettingItem>
                <SettingLabel>
                  <SettingTitle>Currency</SettingTitle>
                  <SettingDescription>Select your currency</SettingDescription>
                </SettingLabel>
                <SettingControl>
                  <Select
                    value={preferences.currency}
                    onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="NGN">NGN</option>
                  </Select>
                </SettingControl>
              </SettingItem>
            </SettingsList>
          </SettingSection>

          {/* ===== DANGER ZONE SECTION ===== */}
          <SettingSection>
            <SectionHeader style={{ background: '#fee', borderBottom: '1px solid #fcc' }}>
              <FaTrash style={{ color: '#d32f2f' }} />
              <SectionTitle style={{ color: '#d32f2f' }}>Danger Zone</SectionTitle>
            </SectionHeader>
            <SettingsList>
              <SettingItem>
                <SettingLabel>
                  <SettingTitle style={{ color: '#d32f2f' }}>Delete Account</SettingTitle>
                  <SettingDescription>Permanently delete your account and all data</SettingDescription>
                </SettingLabel>
              </SettingItem>
            </SettingsList>
            <DangerButton onClick={() => setShowDeleteDialog(true)}>
              <FaTrash /> Delete Account
            </DangerButton>
          </SettingSection>
        </ContentArea>
      </MainContent>

      {/* ===== DELETE CONFIRMATION DIALOG ===== */}
      {showDeleteDialog && (
        <ConfirmDialog onClick={() => setShowDeleteDialog(false)}>
          <DialogContent onClick={(e) => e.stopPropagation()}>
            <DialogTitle>Delete Account?</DialogTitle>
            <DialogMessage>
              This action cannot be undone. Please enter your password to confirm deletion of your account and all associated data.
            </DialogMessage>

            <PasswordInput
              type="password"
              placeholder="Enter your password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
            />

            <DialogButtons>
              <DialogCancelButton onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </DialogCancelButton>
              <DialogConfirmButton
                onClick={handleDeleteAccount}
                disabled={!deletePassword || deleteAccountMutation.isPending}
              >
                {deleteAccountMutation.isPending && <FaSpinner />}
                Delete
              </DialogConfirmButton>
            </DialogButtons>
          </DialogContent>
        </ConfirmDialog>
      )}

      <BottomNavWrapper>
        <BottomNav active="profile" />
      </BottomNavWrapper>
    </PageWrapper>
  );
}
