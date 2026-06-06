import api from './api';

const USE_MOCK = true;

const initialApprovals = [
  { id: 1, requester: 'Sarah Jenkins', type: 'Purchase Order', subject: 'Server Infrastructure Migration', amount: '$18,900.00', status: 'PENDING', createdDate: '2026-06-05T10:00:00Z', vendor: 'NetScale Solutions' },
  { id: 2, requester: 'Marcus Cole', type: 'Vendor Onboarding', subject: 'Global Logistics Inc', amount: 'N/A', status: 'PENDING', createdDate: '2026-06-04T14:15:00Z', vendor: 'Global Logistics Inc' },
  { id: 3, requester: 'Emily Ross', type: 'Contract Renewal', subject: 'Apex Steel Materials Procurement', amount: '$85,000.00', status: 'PENDING', createdDate: '2026-05-28T09:30:00Z', vendor: 'Apex Metals Ltd' }
];

const getLocalApprovals = () => {
  const data = localStorage.getItem('vb_approvals_db');
  if (!data) {
    localStorage.setItem('vb_approvals_db', JSON.stringify(initialApprovals));
    return initialApprovals;
  }
  return JSON.parse(data);
};

export const fetchPendingApprovals = async () => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return getLocalApprovals();
  }
  
  const response = await api.get('/approvals/pending');
  return response.data;
};

export const fetchApprovalDetails = async (id) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const approvals = getLocalApprovals();
    return approvals.find(a => a.id === id) || null;
  }
  
  const response = await api.get(`/approvals/${id}`);
  return response.data;
};

export const approveTransaction = async (id, remarks) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    console.log(`Axios POST /approvals/${id}/approve payload:`, { remarks });
    const approvals = getLocalApprovals();
    const updated = approvals.map(a => a.id === id ? { ...a, status: 'APPROVED', remarks } : a);
    localStorage.setItem('vb_approvals_db', JSON.stringify(updated));
    return { success: true };
  }
  
  const response = await api.post(`/approvals/${id}/approve`, { remarks });
  return response.data;
};

export const rejectTransaction = async (id, remarks) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    console.log(`Axios POST /approvals/${id}/reject payload:`, { remarks });
    const approvals = getLocalApprovals();
    const updated = approvals.map(a => a.id === id ? { ...a, status: 'REJECTED', remarks } : a);
    localStorage.setItem('vb_approvals_db', JSON.stringify(updated));
    return { success: true };
  }
  
  const response = await api.post(`/approvals/${id}/reject`, { remarks });
  return response.data;
};
