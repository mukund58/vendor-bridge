import api from './api';
import { mockDashboardData } from '../data/mockDashboardData';

const USE_MOCK = true;

export const fetchDashboardSummary = async () => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockDashboardData.dashboardSummary;
  }
  
  const response = await api.get('/dashboard');
  return response.data;
};
