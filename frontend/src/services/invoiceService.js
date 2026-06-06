import api from './api';

const USE_MOCK = true;

const initialInvoices = [
  { id: 1, invoiceNumber: 'INV-2026-7791', vendor: 'Apex Metals Ltd', subtotal: 39000, taxAmount: 3500, totalAmount: 42500, status: 'UNPAID', purchaseOrderId: 101 },
  { id: 2, invoiceNumber: 'INV-2026-7792', vendor: 'Titan Heavy Machinery', subtotal: 105000, taxAmount: 10000, totalAmount: 115000, status: 'PAID', purchaseOrderId: 102 },
  { id: 3, invoiceNumber: 'INV-2026-7793', vendor: 'NetScale Solutions', subtotal: 17000, taxAmount: 1900, totalAmount: 18900, status: 'UNPAID', purchaseOrderId: 103 }
];

const getLocalInvoices = () => {
  const data = localStorage.getItem('vb_invoices_db');
  if (!data) {
    localStorage.setItem('vb_invoices_db', JSON.stringify(initialInvoices));
    return initialInvoices;
  }
  return JSON.parse(data);
};

export const fetchInvoices = async () => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return getLocalInvoices();
  }
  
  const response = await api.get('/invoices');
  return response.data;
};

export const fetchInvoiceDetails = async (id) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const invoices = getLocalInvoices();
    return invoices.find(inv => inv.id === id) || null;
  }
  
  const response = await api.get(`/invoices/${id}`);
  return response.data;
};

export const createInvoice = async (purchaseOrderId) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    console.log('Axios POST /invoices payload:', { purchaseOrderId });
    const invoices = getLocalInvoices();
    const newInvoice = {
      id: invoices.length > 0 ? Math.max(...invoices.map(i => i.id)) + 1 : 1,
      invoiceNumber: `INV-2026-779${invoices.length + 1}`,
      vendor: 'Simulated Vendor partner',
      subtotal: 50000,
      taxAmount: 4500,
      totalAmount: 54500,
      status: 'UNPAID',
      purchaseOrderId
    };
    const updated = [newInvoice, ...invoices];
    localStorage.setItem('vb_invoices_db', JSON.stringify(updated));
    return newInvoice;
  }
  
  const response = await api.post('/invoices', { purchaseOrderId });
  return response.data;
};

export const markInvoiceAsPaid = async (id) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    console.log(`Axios PATCH /invoices/${id}/mark-paid requested.`);
    const invoices = getLocalInvoices();
    const updated = invoices.map(inv => inv.id === id ? { ...inv, status: 'PAID' } : inv);
    localStorage.setItem('vb_invoices_db', JSON.stringify(updated));
    return { success: true };
  }
  
  const response = await api.patch(`/invoices/${id}/mark-paid`);
  return response.data;
};

export const fetchInvoicePdfUrl = async (id) => {
  if (USE_MOCK) {
    console.log(`Axios GET /invoices/${id}/pdf requested.`);
    return `/invoices/${id}/pdf`;
  }
  return `/invoices/${id}/pdf`;
};

export const sendInvoiceEmail = async (id) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    console.log(`Axios POST /invoices/${id}/email requested.`);
    return { success: true };
  }
  
  const response = await api.post(`/invoices/${id}/email`);
  return response.data;
};
