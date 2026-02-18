import api from './api';

export const verifyGoogleToken = (idToken) =>
  api.post('/auth/google-verify', { idToken });

export const completeGoogleSignup = (tempToken, campusId) =>
  api.post('/auth/google-complete', { tempToken, campusId });

export const signupWithEmail = (fullName, email, password, campus) =>
  api.post('/auth/signup', {
    fullName,
    email,
    password,
    passwordConfirm: password,
    campus,
  });

export const loginWithEmail = (email, password) =>
  api.post('/auth/login', { email, password });

export const getCurrentUser = () =>
  api.get('/auth/me');

export const logout = () =>
  api.post('/auth/logout');

export const verifyEmail = (token) =>
  api.post('/auth/verify-email', { token });

export const forgotPassword = (email) =>
  api.post('/auth/forgot-password', { email });

export const resetPassword = (token, password) =>
  api.patch('/auth/reset-password', {
    token,
    password,
    passwordConfirm: password,
  });

