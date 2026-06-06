import api from './api';

const USE_MOCK = false;

const initialPOs = [
  { id: 1, po_number: 'PO-2026-1029', quotation_id: 103, vendor_name: 'Stark Industries', status: 'IN_TRANSIT', created_at: '2026-06-05T10:00:00Z', amount: 39500 },
  { id: 2, po_number: 'PO-2026-1028', quotation_id: 102, vendor_name: 'Titan Heavy Machinery', status: 'DELIVERED', created_at: '2026-05-30T14:15:00Z', amount: 115000 },
  { id: 3, po_number: 'PO-2026-1027', quotation_id: 201, vendor_name: 'NetScale Solutions', status: 'ACKNOWLEDGED', created_at: '2026-05-28T09:30:00Z', amount: 18900 }
];

export const fetchPurchaseOrders = async () => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return initialPOs;
  }
  
  const response = await api.get('/purchase-orders');
  return response.data;
};

export const fetchPurchaseOrderDetails = async (id) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return initialPOs.find(p => p.id === id) || null;
  }
  
  const response = await api.get(`/purchase-orders/${id}`);
  return response.data;
};

export const generatePurchaseOrder = async (quotationId) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      id: initialPOs.length + 1,
      po_number: `PO-2026-10${30 + initialPOs.length}`,
      quotation_id: quotationId,
      vendor_name: 'Simulated Vendor',
      status: 'ACKNOWLEDGED',
      created_at: new Date().toISOString(),
      amount: 15000
    };
  }
  
  const response = await api.post('/purchase-orders', { quotation_id: quotationId });
  return response.data;
};
