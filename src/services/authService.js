import apiClient from './apiClient';

const AUTH_USER_KEY = 'propval_user';
const AUTH_TOKEN_KEY = 'propval_token';

/**
 * AUTH SERVICE
 * Fully connected to Spring Boot REST Endpoints:
 * - POST /api/auth/login
 * - POST /api/auth/logout
 * - GET  /api/auth/me
 * - PUT  /api/auth/profile
 * - PUT  /api/auth/change-password
 * - GET  /api/users
 * - POST /api/users
 * - PUT  /api/users/{id}
 * - PATCH /api/users/{id}/status
 * - DELETE /api/users/{id}
 */
export const authService = {
  /**
   * Register new user account
   */
  async register(registrationData) {
    try {
      const response = await apiClient.post('/auth/register', registrationData);
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || 
        (error.response?.data?.data && typeof error.response.data.data === 'object' 
          ? Object.values(error.response.data.data).join(', ') 
          : null) || 
        error.message || 
        'Registration failed. Please check the details provided.';
      throw new Error(msg);
    }
  },

  /**
   * Login user with email & password against Spring Security
   */
  async login(email, password) {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
      }
      if (user) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      }

      return { token, user };
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Login failed. Please check your credentials.';
      throw new Error(msg);
    }
  },

  /**
   * Log out user and clear stored JWT session
   */
  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
    }
    return true;
  },

  /**
   * Get current logged in user from localStorage or API
   */
  getCurrentUser() {
    const data = localStorage.getItem(AUTH_USER_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  /**
   * Fetch current authenticated user profile from backend
   */
  async getMe() {
    try {
      const response = await apiClient.get('/auth/me');
      if (response.data) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      return this.getCurrentUser();
    }
  },

  /**
   * Update profile details (Name, title, location, phone)
   */
  async updateProfile(profileData) {
    const response = await apiClient.put('/auth/profile', profileData);
    if (response.data) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.data));
    }
    return response.data;
  },

  /**
   * Change current user's password
   */
  async changePassword(currentPassword, newPassword) {
    const response = await apiClient.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  /**
   * Get all users (Admin only)
   */
  async getUsers() {
    const response = await apiClient.get('/users');
    return response.data;
  },

  /**
   * Create new user (Admin only)
   */
  async createUser(userData) {
    const response = await apiClient.post('/users', userData);
    return response.data;
  },

  /**
   * Update user details or role (Admin only)
   */
  async updateUser(userId, updates) {
    const response = await apiClient.put(`/users/${userId}`, updates);
    return response.data;
  },

  /**
   * Update user status (ACTIVE / SUSPENDED)
   */
  async updateUserStatus(userId, status) {
    const response = await apiClient.patch(`/users/${userId}/status`, { status });
    return response.data;
  },

  /**
   * Delete user (Admin only)
   */
  async deleteUser(userId) {
    const response = await apiClient.delete(`/users/${userId}`);
    return response.data;
  }
};
