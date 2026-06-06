import api from './api';

const USE_MOCK = true;

export const loginUser = async (email, password) => {
  if (USE_MOCK) {
    // Simulated network latency
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Simulating POST /auth/login payload authentication
    const mockToken = `mock_jwt_token_${Date.now()}`;
    return {
      token: mockToken,
      user: {
        id: 1,
        name: email.split('@')[0],
        role: 'ADMIN',
        email
      }
    };
  }
  
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const registerUser = async (registerData) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true };
  }
  
  const response = await api.post('/auth/register', registerData);
  return response.data;
};

export const fetchCurrentUser = async () => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const storedUser = localStorage.getItem('vb_user');
    return storedUser ? JSON.parse(storedUser) : null;
  }
  
  const response = await api.get('/auth/me');
  return response.data;
};
