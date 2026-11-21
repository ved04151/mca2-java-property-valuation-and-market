import apiClient from './apiClient';

/**
 * PROPERTY SERVICE
 * Provides full CRUD, search, filter, pagination, and sorting for Properties.
 * Connected directly to Spring Boot 3.x REST APIs:
 * - GET    /api/properties
 * - GET    /api/properties/{id}
 * - POST   /api/properties
 * - PUT    /api/properties/{id}
 * - DELETE /api/properties/{id}
 * - GET    /api/properties/locations
 * - POST   /api/properties/{id}/images
 * - DELETE /api/properties/{id}/images/{imageId}
 */
export const propertyService = {
  /**
   * Fetch paginated and filtered properties
   */
  async getProperties({
    search = '',
    city = 'ALL',
    propertyType = 'ALL',
    minPrice,
    maxPrice,
    sortBy = 'newest',
    page = 1,
    pageSize = 6,
  } = {}) {
    const params = {
      page,
      pageSize,
      sortBy,
    };
    if (search && search.trim() !== '') params.search = search.trim();
    if (city && city !== 'ALL') params.city = city;
    if (propertyType && propertyType !== 'ALL') params.propertyType = propertyType;
    if (minPrice !== undefined && minPrice !== null) params.minPrice = minPrice;
    if (maxPrice !== undefined && maxPrice !== null && maxPrice !== Infinity) params.maxPrice = maxPrice;

    const response = await apiClient.get('/properties', { params });
    return response.data;
  },

  /**
   * Get single property by ID
   */
  async getPropertyById(id) {
    const response = await apiClient.get(`/properties/${id}`);
    return response.data;
  },

  /**
   * Create new property
   */
  async createProperty(propertyData) {
    const response = await apiClient.post('/properties', propertyData);
    return response.data;
  },

  /**
   * Update existing property
   */
  async updateProperty(id, updates) {
    const response = await apiClient.put(`/properties/${id}`, updates);
    return response.data;
  },

  /**
   * Delete property by ID
   */
  async deleteProperty(id) {
    const response = await apiClient.delete(`/properties/${id}`);
    return response.data;
  },

  /**
   * Get distinct cities and localities for dropdowns
   */
  async getLocations() {
    const response = await apiClient.get('/properties/locations');
    return response.data;
  },

  /**
   * Add image to property
   */
  async addImage(propertyId, imageUrl) {
    const response = await apiClient.post(`/properties/${propertyId}/images`, { imageUrl });
    return response.data;
  },

  /**
   * Remove image from property
   */
  async removeImage(propertyId, imageIndex) {
    const response = await apiClient.delete(`/properties/${propertyId}/images/${imageIndex}`);
    return response.data;
  }
};
