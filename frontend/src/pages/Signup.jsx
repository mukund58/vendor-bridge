import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiActivity, FiLock, FiMail, FiUser, FiPhone, FiGlobe, FiBriefcase, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import './Signup.css';

const Signup = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  // Form Fields State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    role: 'PROCUREMENT_OFFICER',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Field Validations
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const result = await register(formData);
      if (result.success) {
        setSuccess('Registration successful! Redirecting to login...');
        // Clear inputs
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          country: '',
          role: 'PROCUREMENT_OFFICER',
          password: '',
          confirmPassword: ''
        });
        
        // Wait and redirect to sign in
        setTimeout(() => {
          navigate('/login');
        }, 1800);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred during signup. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container d-flex align-items-center justify-content-center py-5 px-3">
      <div className="signup-card card p-4 p-md-5 glass border border-light">
        
        {/* Brand Logo */}
        <div className="text-center mb-4">
          <div className="login-logo-wrapper d-inline-flex align-items-center justify-content-center mb-3">
            <FiActivity className="logo-icon fs-3 text-primary" />
          </div>
          <h2 className="text-white fw-bold fs-4 mb-1">Create ERP Account</h2>
          <p className="text-secondary small">Register a new operator workspace in VendorBridge</p>
        </div>

        {error && (
          <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger small py-2 px-3 mb-4 rounded-3">
            <span className="fw-medium">{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success border-0 bg-success bg-opacity-10 text-success small py-2 px-3 mb-4 rounded-3 d-flex align-items-center gap-2">
            <FiCheckCircle size={16} />
            <span className="fw-medium">{success}</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleRegister} className="d-flex flex-column gap-3.5">
          {/* Row 1: Name Inputs */}
          <div className="row g-3">
            <div className="col-12 col-sm-6">
              <label className="text-secondary small mb-1.5 fw-medium" htmlFor="firstName">First Name</label>
              <div className="input-group-custom d-flex align-items-center px-3 py-2 rounded-3 border border-light bg-secondary">
                <FiUser className="text-muted me-2.5" size={16} />
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="bg-transparent border-0 text-white w-100 fs-7 outline-none"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <label className="text-secondary small mb-1.5 fw-medium" htmlFor="lastName">Last Name</label>
              <div className="input-group-custom d-flex align-items-center px-3 py-2 rounded-3 border border-light bg-secondary">
                <FiUser className="text-muted me-2.5" size={16} />
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="bg-transparent border-0 text-white w-100 fs-7 outline-none"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Email field */}
          <div className="form-group mt-1">
            <label className="text-secondary small mb-1.5 fw-medium" htmlFor="email">Email Address</label>
            <div className="input-group-custom d-flex align-items-center px-3 py-2 rounded-3 border border-light bg-secondary">
              <FiMail className="text-muted me-2.5" size={16} />
              <input
                id="email"
                name="email"
                type="email"
                required
                className="bg-transparent border-0 text-white w-100 fs-7 outline-none"
                placeholder="john.doe@company.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Row 2: Phone & Country */}
          <div className="row g-3 mt-1">
            <div className="col-12 col-sm-6">
              <label className="text-secondary small mb-1.5 fw-medium" htmlFor="phone">Phone Number</label>
              <div className="input-group-custom d-flex align-items-center px-3 py-2 rounded-3 border border-light bg-secondary">
                <FiPhone className="text-muted me-2.5" size={16} />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="bg-transparent border-0 text-white w-100 fs-7 outline-none"
                  placeholder="+1 (555) 019-2834"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <label className="text-secondary small mb-1.5 fw-medium" htmlFor="country">Country</label>
              <div className="input-group-custom d-flex align-items-center px-3 py-2 rounded-3 border border-light bg-secondary">
                <FiGlobe className="text-muted me-2.5" size={16} />
                <input
                  id="country"
                  name="country"
                  type="text"
                  required
                  className="bg-transparent border-0 text-white w-100 fs-7 outline-none"
                  placeholder="United States"
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Role Dropdown */}
          <div className="form-group mt-1">
            <label className="text-secondary small mb-1.5 fw-medium" htmlFor="role">ERP System Role</label>
            <div className="input-group-custom d-flex align-items-center px-3 py-2 rounded-3 border border-light bg-secondary">
              <FiBriefcase className="text-muted me-2.5" size={16} />
              <select
                id="role"
                name="role"
                required
                className="bg-transparent border-0 text-white w-100 fs-7 outline-none cursor-pointer"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="PROCUREMENT_OFFICER">PROCUREMENT_OFFICER</option>
                <option value="ADMIN">ADMIN</option>
                <option value="VENDOR">VENDOR</option>
                <option value="MANAGER">MANAGER</option>
              </select>
            </div>
          </div>

          {/* Password fields */}
          <div className="row g-3 mt-1">
            <div className="col-12 col-sm-6">
              <label className="text-secondary small mb-1.5 fw-medium" htmlFor="password">Password</label>
              <div className="input-group-custom d-flex align-items-center px-3 py-2 rounded-3 border border-light bg-secondary">
                <FiLock className="text-muted me-2.5" size={16} />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="bg-transparent border-0 text-white w-100 fs-7 outline-none"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
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
            <div className="col-12 col-sm-6">
              <label className="text-secondary small mb-1.5 fw-medium" htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-group-custom d-flex align-items-center px-3 py-2 rounded-3 border border-light bg-secondary">
                <FiLock className="text-muted me-2.5" size={16} />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className="bg-transparent border-0 text-white w-100 fs-7 outline-none"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="btn border-0 p-0 text-muted ms-2 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>
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
              'Complete Registration'
            )}
          </button>
        </form>

        {/* Back to sign in toggle option */}
        <div className="text-center mt-4 pt-2 border-top border-light">
          <p className="text-secondary small mb-0">
            Already have an ERP account?{' '}
            <Link to="/login" className="text-primary text-decoration-none fw-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
