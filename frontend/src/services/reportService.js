import api from './api';
import { mockDashboardData } from '../data/mockDashboardData';

const USE_MOCK = false;

export const fetchReportsSummary = async (startDate, endDate) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    console.log(`Axios GET /reports/summary requested for range: ${startDate} to ${endDate}`);
    return mockDashboardData.reportsSummary;
  }
  
  const response = await api.get('/reports/summary', { params: { startDate, endDate } });
  return response.data;
};

export const fetchVendorPerformance = async (startDate, endDate) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    console.log(`Axios GET /reports/vendors requested for range: ${startDate} to ${endDate}`);
    return mockDashboardData.vendorPerformance;
  }
  
  const response = await api.get('/reports/vendors', { params: { startDate, endDate } });
  return response.data;
};

export const fetchMonthlyTrend = async (startDate, endDate) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 350));
    console.log(`Axios GET /reports/monthly-trend requested for range: ${startDate} to ${endDate}`);
    return mockDashboardData.spendingTrend;
  }
  
  const response = await api.get('/reports/monthly-trend', { params: { startDate, endDate } });
  return response.data;
};

export const exportReportPdf = async () => {
  console.log('Axios GET /reports/export?format=pdf triggered.');
  // Simulating the actual file payload blob download
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return true;
};

export const exportReportExcel = async () => {
  console.log('Axios GET /reports/export?format=excel triggered.');
  // Simulating the actual file payload blob download
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return true;
};
