import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContextObject';

// Default predefined users aligned with API specifications
const defaultUsers = [
  { id: 1, name: 'Admin User', email: 'admin@vendorbridge.com', role: 'ADMIN', password: 'password123' },
  { id: 2, name: 'Apex Metal Solutions', email: 'vendor@vendorbridge.com', role: 'VENDOR', password: 'password123' },
  { id: 3, name: 'Manager Marcus', email: 'manager@vendorbridge.com', role: 'MANAGER', password: 'password123' },
  { id: 4, name: 'Officer Jenkins', email: 'officer@vendorbridge.com', role: 'PROCUREMENT_OFFICER', password: 'password123' }
];

export const AuthProvider = ({ children }) => {
  // Use lazy state initializers to pull directly from LocalStorage, avoiding set-state-in-effect warning
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('vb_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('vb_token'));
  const [loading] = useState(false);

  // Check profile state validation logging (GET /auth/me checks)
  useEffect(() => {
    if (token && user) {
      console.log('Axios GET /auth/me checking session validation.');
    }
  }, [token, user]);

  // Login handler simulating POST /auth/login
  const login = async (email, password) => {
    console.log('Axios POST /auth/login requested with payload:', { email, password });
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Check predefined users first
    let foundUser = defaultUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    // Check custom registered users from localStorage
    if (!foundUser) {
      const customUsers = JSON.parse(localStorage.getItem('vb_registered_users') || '[]');
      foundUser = customUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
    }

    if (foundUser) {
      const generatedToken = `jwt_token_${foundUser.role.toLowerCase()}_${Date.now()}`;
      const userPayload = {
        id: foundUser.id,
        name: foundUser.name,
        role: foundUser.role,
        email: foundUser.email
      };

      // Set state and write to localStorage
      setToken(generatedToken);
      setUser(userPayload);
      localStorage.setItem('vb_token', generatedToken);
      localStorage.setItem('vb_user', JSON.stringify(userPayload));

      console.log('Axios POST /auth/login success response:', { token: generatedToken, user: userPayload });
      return { success: true, user: userPayload };
    }

    return { success: false, error: 'Invalid email or password.' };
  };

  // Register handler simulating POST /auth/register
  const register = async (formData) => {
    const registerPayload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      role: formData.role,
      password: formData.password
    };

    console.log('Axios POST /auth/register requested with payload:', registerPayload);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const customUsers = JSON.parse(localStorage.getItem('vb_registered_users') || '[]');
    
    const emailExists = 
      defaultUsers.some((u) => u.email.toLowerCase() === formData.email.toLowerCase()) ||
      customUsers.some((u) => u.email.toLowerCase() === formData.email.toLowerCase());

    if (emailExists) {
      return { success: false, error: 'Email address is already registered.' };
    }

    const newUser = {
      id: customUsers.length + 5,
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      role: formData.role,
      password: formData.password
    };

    customUsers.push(newUser);
    localStorage.setItem('vb_registered_users', JSON.stringify(customUsers));

    console.log('Axios POST /auth/register success status.');
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('vb_token');
    localStorage.removeItem('vb_user');
    console.log('Session cleared. Redirected to Sign In.');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};
