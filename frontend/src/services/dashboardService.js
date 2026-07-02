import api from './api';

export const dashboardService = {
  getAdminDashboard: async () => {
    const response = await api.get('/dashboard/admin');
    return response.data;
  },

  getStoreOwnerDashboard: async () => {
    const response = await api.get('/dashboard/store-owner');
    return response.data;
  },

  getUserDashboard: async () => {
    const response = await api.get('/dashboard/user');
    return response.data;
  },
};
