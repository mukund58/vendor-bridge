import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiActivity, FiLock, FiMail, FiEye, FiEyeOff } from 'react-icons/fi';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 800);
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

        {/* Login Form */}
        <form onSubmit={handleLogin} className="d-flex flex-column gap-3.5">
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
          <div className="form-group mt-3">
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
          <div className="d-flex justify-content-between align-items-center mt-3 small">
            <div className="form-check d-flex align-items-center gap-2">
              <input
                id="login-remember"
                type="checkbox"
                className="form-check-input bg-secondary border-color cursor-pointer"
              />
              <label htmlFor="login-remember" className="form-check-label text-secondary cursor-pointer">
                Remember me
              </label>
            </div>
            <a href="#forgot" className="text-primary text-decoration-none fw-medium">
              Forgot Password?
            </a>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-100 mt-4 d-flex align-items-center justify-content-center gap-2"
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              'Sign In to Dashboard'
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center mt-4 pt-2 border-top border-light">
          <span className="text-muted small">Authorized Personnel Only</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
