import api from './api';

export const storeService = {
  getStores: async (params) => {
    const response = await api.get('/stores', { params });
    return response.data;
  },

  getStoreById: async (id) => {
    const response = await api.get(`/stores/${id}`);
    return response.data;
  },

  createStore: async (data) => {
    const response = await api.post('/stores', data);
    return response.data;
  },

  updateStore: async (id, data) => {
    const response = await api.put(`/stores/${id}`, data);
    return response.data;
  },

  deleteStore: async (id) => {
    const response = await api.delete(`/stores/${id}`);
    return response.data;
  },
};
