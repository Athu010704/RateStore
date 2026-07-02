import api from './api';

export const ratingService = {
  getRatings: async (params) => {
    const response = await api.get('/ratings', { params });
    return response.data;
  },

  getRatingById: async (id) => {
    const response = await api.get(`/ratings/${id}`);
    return response.data;
  },

  getRatingsByStore: async (storeId, params) => {
    const response = await api.get(`/ratings/store/${storeId}`, { params });
    return response.data;
  },

  createRating: async (data) => {
    const response = await api.post('/ratings', data);
    return response.data;
  },

  updateRating: async (id, data) => {
    const response = await api.put(`/ratings/${id}`, data);
    return response.data;
  },

  deleteRating: async (id) => {
    const response = await api.delete(`/ratings/${id}`);
    return response.data;
  },
};
