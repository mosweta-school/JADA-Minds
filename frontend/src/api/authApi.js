// frontend/src/api/authApi.js

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For cookies if needed
});

// Request interceptor - Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          {
            headers: { Authorization: `Bearer ${refreshToken}` },
          }
        );

        const { access_token } = response.data;
        localStorage.setItem('access_token', access_token);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ============================================================================
// AUTH API FUNCTIONS - Mapped to Backend Endpoints
// ============================================================================

export const authApi = {
  // Registration - POST /api/auth/register
  register: (data) => api.post('/auth/register', data),

  // Login - POST /api/auth/login
  login: (data) => api.post('/auth/login', data),

  // Google OAuth Login - POST /api/auth/google
  googleLogin: (credential) => api.post('/auth/google', { credential }),

  // Email Verification - POST /api/auth/verify-email
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),

  // Forgot Password - POST /api/auth/forgot-password
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),

  // Reset Password - POST /api/auth/reset-password
  resetPassword: (token, newPassword) => {
  console.log('Reset password called with token:', token.substring(0, 10) + '...');
  return api.post('/auth/reset-password', { 
    token, 
    new_password: newPassword 
  });
},

  // MFA Verification - POST /api/auth/mfa/verify
  verifyMFA: (code, preAuthToken) =>
    api.post(
      '/auth/mfa/verify',
      { code },
      {
        headers: { Authorization: `Bearer ${preAuthToken}` },
      }
    ),

  // Logout - POST /api/auth/logout
  logout: () => api.post('/auth/logout'),

  // Refresh Token - POST /api/auth/refresh
  refresh: () => api.post('/auth/refresh'),

  // Profile - GET /api/profile
  getProfile: () => api.get('/profile'),

  // Update Profile - PUT /api/profile
  updateProfile: (data) => api.put('/profile', data),

  // Change Password - POST /api/profile/change-password
  changePassword: (currentPassword, newPassword, confirmPassword) =>
    api.post('/profile/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    }),

  // Enable MFA - POST /api/profile/mfa/enable
  enableMFA: () => api.post('/profile/mfa/enable'),

  // Verify MFA Setup - POST /api/profile/mfa/verify
  verifyMFASetup: (code) => api.post('/profile/mfa/verify', { code }),

  // Disable MFA - POST /api/profile/mfa/disable
  disableMFA: () => api.post('/profile/mfa/disable'),
};

export default api;