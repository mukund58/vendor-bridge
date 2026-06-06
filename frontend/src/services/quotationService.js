import api from './api';

const USE_MOCK = false;

const initialQuotations = {
  1: [
    { quotationId: 101, vendor: 'Apex Metals Ltd', amount: 185000, deliveryDays: 10, rating: 4.5 },
    { quotationId: 102, vendor: 'Titan Heavy Machinery', amount: 195000, deliveryDays: 8, rating: 4.2 },
    { quotationId: 103, vendor: 'Stark Industries', amount: 175000, deliveryDays: 12, rating: 4.8 }
  ],
  2: [
    { quotationId: 201, vendor: 'NetScale Solutions', amount: 18900, deliveryDays: 5, rating: 4.6 },
    { quotationId: 202, vendor: 'Global Logistics Inc', amount: 19500, deliveryDays: 7, rating: 4.0 }
  ]
};

const getLocalQuotations = () => {
  const data = localStorage.getItem('vb_quotations_db');
  if (!data) {
    localStorage.setItem('vb_quotations_db', JSON.stringify(initialQuotations));
    return initialQuotations;
  }
  return JSON.parse(data);
};

export const fetchQuotations = async (rfqId) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const quotes = getLocalQuotations();
    return {
      rfqId,
      quotations: quotes[rfqId] || []
    };
  }
  
  const response = await api.get(`/rfqs/${rfqId}/comparison`);
  return response.data;
};

export const submitQuotation = async (rfqId, quotationData) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const quotes = getLocalQuotations();
    const list = quotes[rfqId] || [];
    const newQuote = {
      ...quotationData,
      quotationId: list.length > 0 ? Math.max(...list.map(q => q.quotationId)) + 1 : 1
    };
    quotes[rfqId] = [...list, newQuote];
    localStorage.setItem('vb_quotations_db', JSON.stringify(quotes));
    return newQuote;
  }
  
  const response = await api.post(`/rfqs/${rfqId}/quotations`, quotationData);
  return response.data;
};

export const selectWinningQuotation = async (rfqId, quotationId, remarks) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 350));
    console.log(`Axios POST /rfqs/${rfqId}/select-quotation payload:`, { quotationId, remarks });
    return { success: true };
  }
  
  const response = await api.post(`/rfqs/${rfqId}/select-quotation`, { quotationId, remarks });
  return response.data;
};

export const fetchAllQuotations = async () => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [];
  }
  const response = await api.get('/quotations');
  return response.data;
};
