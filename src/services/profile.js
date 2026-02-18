/**
 * Profile Service - API calls for profile management
 */

import api from './api';

/**
 * Get current user's profile
 */
export const getMyProfile = () =>
  api.get('/profile/me');

/**
 * Get any user's public profile by ID
 */
export const getUserProfile = (userId) =>
  api.get(`/profile/users/${userId}`);

/**
 * Update current user's profile
 */
export const updateProfile = (data) =>
  api.patch('/profile/me', data);

/**
 * Upload/update avatar
 * @param {Object} avatar - { url: string, publicId?: string }
 */
export const uploadAvatar = (avatar) =>
  api.post('/profile/me/avatar', { avatar });

/**
 * Delete user's avatar
 */
export const deleteAvatar = () =>
  api.delete('/profile/me/avatar');

/**
 * Update user preferences
 */
export const updatePreferences = (preferences) =>
  api.patch('/profile/me/preferences', preferences);

/**
 * Get user's profile statistics
 */
export const getProfileStats = () =>
  api.get('/profile/me/stats');

/**
 * Get user's followers
 */
export const getFollowers = (userId) =>
  api.get(`/profile/users/${userId}/followers`);

/**
 * Get user's following list
 */
export const getFollowing = (userId) =>
  api.get(`/profile/users/${userId}/following`);

/**
 * Follow a user
 */
export const followUser = (userId) =>
  api.post(`/profile/users/${userId}/follow`);

/**
 * Unfollow a user
 */
export const unfollowUser = (userId) =>
  api.delete(`/profile/users/${userId}/follow`);

/**
 * Block a user
 */
export const blockUser = (userId) =>
  api.post(`/profile/users/${userId}/block`);

/**
 * Unblock a user
 */
export const unblockUser = (userId) =>
  api.delete(`/profile/users/${userId}/block`);

/**
 * Delete/deactivate account
 */
export const deleteAccount = (password) =>
  api.delete('/profile/me', { data: { password } });