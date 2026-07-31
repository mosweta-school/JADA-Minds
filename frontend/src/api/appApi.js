// frontend/src/api/appApi.js
//
// authApi.js points at http://localhost:5000/api, which is correct
// for Deogracious's auth routes (they're registered under /api/auth/...).
// Every other blueprint - questions, assessments, results, resources,
// specialists, workshops - has NO /api prefix (confirmed directly
// against the backend's blueprint registrations). Reusing authApi's
// baseURL here would send every request to a URL that 404s.
//
// Same token-attach + refresh-on-401 behavior as authApi.js, just
// pointed at the API root instead of /api, and reusing the SAME
// localStorage keys so a user only ever has one login session.

import axios from 'axios';

const ROOT_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(
  /\/api\/?$/,
  ''
);

const appApi = axios.create({
  baseURL: ROOT_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

appApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

appApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(
          `${ROOT_URL}/api/auth/refresh`,
          {},
          { headers: { Authorization: `Bearer ${refreshToken}` } }
        );

        const { access_token } = response.data;
        localStorage.setItem('access_token', access_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return appApi(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default appApi;