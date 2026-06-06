import api from './api';

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

export const exportReportPdf = async (startDate, endDate) => {
  const response = await api.get('/reports/export', {
    params: { format: 'pdf', startDate, endDate },
    responseType: 'blob'
  });
  const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `procurement_report_${new Date().toISOString().slice(0, 10)}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
  return true;
};

export const exportReportExcel = async (startDate, endDate) => {
  const response = await api.get('/reports/export', {
    params: { format: 'excel', startDate, endDate },
    responseType: 'blob'
  });
  const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `procurement_report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
  return true;
};
