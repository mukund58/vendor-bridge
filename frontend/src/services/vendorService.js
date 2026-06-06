import api from './api';

const USE_MOCK = true;

const initialVendors = [
  { id: 1, name: 'Apex Metals Ltd', gstNumber: '27AAACA1111A1Z1', category: 'Raw Materials', status: 'ACTIVE' },
  { id: 2, name: 'NetScale Solutions', gstNumber: '27BBBCB2222B2Z2', category: 'IT Solutions', status: 'ACTIVE' },
  { id: 3, name: 'Habitat Crafts', gstNumber: '27CCCC3333C3Z3', category: 'Office Goods', status: 'PENDING' },
  { id: 4, name: 'Titan Heavy Machinery', gstNumber: '27DDDD4444D4Z4', category: 'Heavy Equipment', status: 'ACTIVE' },
  { id: 5, name: 'Global Logistics Inc', gstNumber: '27EEEE5555E5Z5', category: 'Logistics', status: 'BLOCKED' },
  { id: 6, name: 'Stark Industries', gstNumber: '27FFFF6666F6Z6', category: 'Raw Materials', status: 'ACTIVE' }
];

// Helper to initialize local storage mock DB
const getLocalVendors = () => {
  const data = localStorage.getItem('vb_vendors_db');
  if (!data) {
    localStorage.setItem('vb_vendors_db', JSON.stringify(initialVendors));
    return initialVendors;
  }
  return JSON.parse(data);
};

export const fetchVendors = async () => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return getLocalVendors();
  }
  
  const response = await api.get('/vendors');
  return response.data;
};

export const addVendor = async (vendorData) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const vendors = getLocalVendors();
    const newVendor = {
      ...vendorData,
      id: vendors.length > 0 ? Math.max(...vendors.map(v => v.id)) + 1 : 1
    };
    const updated = [newVendor, ...vendors];
    localStorage.setItem('vb_vendors_db', JSON.stringify(updated));
    return newVendor;
  }
  
  const response = await api.post('/vendors', vendorData);
  return response.data;
};

export const updateVendorDetails = async (id, vendorData) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const vendors = getLocalVendors();
    const updated = vendors.map(v => v.id === id ? { ...v, ...vendorData } : v);
    localStorage.setItem('vb_vendors_db', JSON.stringify(updated));
    return { id, ...vendorData };
  }
  
  const response = await api.put(`/vendors/${id}`, vendorData);
  return response.data;
};

export const blockVendor = async (id) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const vendors = getLocalVendors();
    const updated = vendors.filter(v => v.id !== id);
    localStorage.setItem('vb_vendors_db', JSON.stringify(updated));
    return { success: true };
  }
  
  const response = await api.delete(`/vendors/${id}`);
  return response.data;
};
