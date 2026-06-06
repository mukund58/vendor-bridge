import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiActivity, FiLock, FiMail, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { getRoleHomePath } from '../utils/authHelpers';
import './Login.css';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        const homePath = getRoleHomePath(result.user.role);
        navigate(homePath);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected server error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrefill = (prefillEmail, prefillPass) => {
    setEmail(prefillEmail);
    setPassword(prefillPass);
    setError('');
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center min-vh-100 p-3">
      <div className="login-card card p-4 p-md-5 glass border border-light">
        
        {/* Brand Logo */}
        <div className="text-center mb-4">
          <div className="login-logo-wrapper d-inline-flex align-items-center justify-content-center mb-3">
            <FiActivity className="logo-icon fs-3 text-primary" />
          </div>
          <h2 className="text-white fw-bold fs-4 mb-1">Welcome back</h2>
          <p className="text-secondary small">Access the VendorBridge ERP Control Center</p>
        </div>

        {error && (
          <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger small py-2 px-3 mb-4 rounded-3 d-flex align-items-center gap-2">
            <span className="fw-medium">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
          {/* Email field */}
          <div className="form-group">
            <label className="text-secondary small mb-1.5 fw-medium" htmlFor="login-email">Email Address</label>
            <div className="input-group-custom d-flex align-items-center px-3 py-2 rounded-3 border border-light bg-secondary">
              <FiMail className="text-muted me-2.5" size={16} />
              <input
                id="login-email"
                type="email"
                required
                className="bg-transparent border-0 text-white w-100 fs-7 outline-none"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password field */}
          <div className="form-group mt-1">
            <label className="text-secondary small mb-1.5 fw-medium" htmlFor="login-password">Password</label>
            <div className="input-group-custom d-flex align-items-center px-3 py-2 rounded-3 border border-light bg-secondary">
              <FiLock className="text-muted me-2.5" size={16} />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                className="bg-transparent border-0 text-white w-100 fs-7 outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="btn border-0 p-0 text-muted ms-2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember and Forgot options */}
          <div className="d-flex justify-content-between align-items-center mt-2 small">
            <div className="form-check d-flex align-items-center gap-2 mb-0">
              <input
                id="login-remember"
                type="checkbox"
                className="form-check-input bg-secondary border-color cursor-pointer"
              />
              <label htmlFor="login-remember" className="form-check-label text-secondary cursor-pointer">
                Remember me
              </label>
            </div>
            <a href="#forgot" className="text-primary text-decoration-none fw-medium" onClick={(e) => e.preventDefault()}>
              Forgot Password?
            </a>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-100 mt-3 d-flex align-items-center justify-content-center gap-2"
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              'Sign In to Dashboard'
            )}
          </button>
        </form>

        {/* Sign up toggle option */}
        <div className="text-center mt-3.5">
          <p className="text-secondary small mb-0">
            Don't have an ERP account?{' '}
            <Link to="/signup" className="text-primary text-decoration-none fw-semibold">
              Create Account
            </Link>
          </p>
        </div>

        {/* Pre-fill Quick Logins */}
        <div className="mt-4 pt-3 border-top border-light">
          <span className="text-muted extra-small d-block mb-2 text-center fw-medium text-uppercase tracking-wider">
            Demo Account Pre-fills:
          </span>
          <div className="d-flex flex-wrap gap-1.5 justify-content-center">
            <button
              type="button"
              className="btn btn-secondary btn-sm px-2 py-1 fs-8"
              onClick={() => handlePrefill('admin@vendorbridge.com', 'password123')}
            >
              Admin
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm px-2 py-1 fs-8"
              onClick={() => handlePrefill('vendor@vendorbridge.com', 'password123')}
            >
              Vendor
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm px-2 py-1 fs-8"
              onClick={() => handlePrefill('manager@vendorbridge.com', 'password123')}
            >
              Manager
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm px-2 py-1 fs-8"
              onClick={() => handlePrefill('officer@vendorbridge.com', 'password123')}
            >
              Officer
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center mt-4 pt-2 border-top border-light">
          <span className="text-muted small">Authorized Personnel Only</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
