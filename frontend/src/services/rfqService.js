import api from './api';

const USE_MOCK = false;

const initialRFQs = [
  { id: 1, title: 'Raw Steel Sheet Coils', category: 'Raw Materials', description: 'Grade A coils', deadline: '2026-06-15', submissions: 3, status: 'Active' },
  { id: 2, title: 'Cloud server hardware racks', category: 'IT Solutions', description: 'Power racks', deadline: '2026-06-18', submissions: 1, status: 'Pending Review' },
  { id: 3, title: 'Warehouse Forklifts replacement', category: 'Heavy Equipment', description: 'Dual fork lifts', deadline: '2026-06-25', submissions: 0, status: 'Draft' }
];

const getLocalRFQs = () => {
  const data = localStorage.getItem('vb_rfqs_db');
  if (!data) {
    localStorage.setItem('vb_rfqs_db', JSON.stringify(initialRFQs));
    return initialRFQs;
  }
  return JSON.parse(data);
};

export const fetchRFQs = async () => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return getLocalRFQs();
  }
  
  const response = await api.get('/rfqs');
  return response.data;
};

export const createRFQ = async (rfqData) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const rfqs = getLocalRFQs();
    const newRfq = {
      ...rfqData,
      id: rfqs.length > 0 ? Math.max(...rfqs.map(r => r.id)) + 1 : 1,
      submissions: 0
    };
    const updated = [newRfq, ...rfqs];
    localStorage.setItem('vb_rfqs_db', JSON.stringify(updated));
    return newRfq;
  }
  
  const response = await api.post('/rfqs', rfqData);
  return response.data;
};
