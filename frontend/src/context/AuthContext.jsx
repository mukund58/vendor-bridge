import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContextObject';
import { loginUser, registerUser, fetchCurrentUser } from '../services/authService';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('vb_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('vb_token'));
  const [loading, setLoading] = useState(false);

  // Validate session on mount if token exists
  useEffect(() => {
    const validateSession = async () => {
      if (token && !user) {
        try {
          const currentUser = await fetchCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            localStorage.setItem('vb_user', JSON.stringify(currentUser));
          } else {
            // Token invalid, clear session
            logout();
          }
        } catch {
          logout();
        }
      }
    };
    validateSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Login handler calling POST /auth/login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await loginUser(email, password);

      if (response && response.token) {
        const userPayload = {
          id: response.user.id,
          name: response.user.name,
          role: response.user.role,
          email: response.user.email || email,
          phone: response.user.phone || '',
          country: response.user.country || '',
          avatar: response.user.avatar || null
        };

        setToken(response.token);
        setUser(userPayload);
        localStorage.setItem('vb_token', response.token);
        localStorage.setItem('vb_user', JSON.stringify(userPayload));

        return { success: true, user: userPayload };
      }

      return { success: false, error: 'Invalid email or password.' };
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid email or password.';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Register handler calling POST /auth/register
  const register = async (formData) => {
    setLoading(true);
    try {
      const registerPayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || '',
        country: formData.country || '',
        role: formData.role || 'VENDOR',
        avatar: formData.avatar || null,
        password: formData.password
      };

      const response = await registerUser(registerPayload);

      if (response && response.token) {
        return { success: true };
      }

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed.';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('vb_token');
    localStorage.removeItem('vb_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};
