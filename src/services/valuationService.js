import apiClient from './apiClient';

/**
 * VALUATION & MARKET ANALYSIS SERVICE
 * Connected directly to Spring Boot 3.x REST APIs:
 * - POST   /api/valuations/calculate
 * - POST   /api/valuations
 * - GET    /api/valuations
 * - GET    /api/valuations/{id}
 * - DELETE /api/valuations/{id}
 * - GET    /api/market-analysis/benchmarks
 * - GET    /api/market-analysis/overview
 * - GET    /api/market-analysis/trends
 * - GET    /api/market-analysis/localities/compare
 * - GET    /api/market-analysis/property-types
 */
export const valuationService = {
  /**
   * Run automated valuation calculation
   */
  async calculateValuation(params) {
    const response = await apiClient.post('/valuations/calculate', params);
    return response.data;
  },

  /**
   * Save a completed valuation record
   */
  async saveValuation(valuationData) {
    const response = await apiClient.post('/valuations', valuationData);
    return response.data;
  },

  /**
   * Fetch all valuation records
   */
  async getValuations({ search = '', city = 'ALL', page = 1, pageSize = 8 } = {}) {
    const params = {
      page,
      pageSize,
    };
    if (search && search.trim() !== '') params.search = search.trim();
    if (city && city !== 'ALL') params.city = city;

    const response = await apiClient.get('/valuations', { params });
    return response.data;
  },

  /**
   * Get single valuation by ID
   */
  async getValuationById(id) {
    const response = await apiClient.get(`/valuations/${id}`);
    return response.data;
  },

  /**
   * Delete valuation record
   */
  async deleteValuation(id) {
    const response = await apiClient.delete(`/valuations/${id}`);
    return response.data;
  },

  /**
   * Fetch Market Analysis benchmarks
   */
  async getLocalityBenchmarks(city = 'ALL') {
    const response = await apiClient.get('/market-analysis/benchmarks', {
      params: { city },
    });
    return response.data;
  },

  /**
   * Fetch Market Overview telemetry
   */
  async getMarketOverview() {
    const response = await apiClient.get('/market-analysis/overview');
    return response.data;
  },

  /**
   * Fetch Historical price trends
   */
  async getPriceTrends() {
    const response = await apiClient.get('/market-analysis/trends');
    return response.data;
  },

  /**
   * Compare selected localities
   */
  async compareLocalities(localities = []) {
    const response = await apiClient.get('/market-analysis/localities/compare', {
      params: { localities: localities.join(',') },
    });
    return response.data;
  }
};
