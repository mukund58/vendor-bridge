import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FiActivity, FiLock, FiMail, FiUser, FiPhone, FiGlobe,
  FiBriefcase, FiEye, FiEyeOff, FiCheckCircle, FiCamera,
  FiUploadCloud, FiAlertCircle, FiX, FiCrop, FiCheck,
  FiZoomIn, FiZoomOut, FiRefreshCw
} from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import './Signup.css';

/* ─── Photo validation constants ─────────────────────────────────────────── */
const ALLOWED_TYPES  = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_MB    = 5;
const MIN_WIDTH      = 100;
const MIN_HEIGHT     = 100;
const OUTPUT_SIZE    = 256; // final cropped square size

/* ─── CropModal: canvas-drag-to-pan + scroll-to-zoom ─────────────────────── */
const CropModal = ({ imageSrc, onConfirm, onCancel }) => {
  const canvasRef  = useRef(null);
  const imgRef     = useRef(new Image());
  const stateRef   = useRef({ scale: 1, offsetX: 0, offsetY: 0, dragging: false, lastX: 0, lastY: 0 });
  const [scale, setScaleState] = useState(1);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const s   = stateRef.current;
    const W   = canvas.width;
    const H   = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // Draw image
    const iw = imgRef.current.naturalWidth  * s.scale;
    const ih = imgRef.current.naturalHeight * s.scale;
    const ix = W / 2 + s.offsetX - iw / 2;
    const iy = H / 2 + s.offsetY - ih / 2;
    ctx.drawImage(imgRef.current, ix, iy, iw, ih);

    // Dark overlay with circular hole
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, Math.min(W, H) / 2 - 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Circle border
    ctx.strokeStyle = 'rgba(99,102,241,0.9)';
    ctx.lineWidth   = 2.5;
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, Math.min(W, H) / 2 - 12, 0, Math.PI * 2);
    ctx.stroke();
  }, []);

  useEffect(() => {
    imgRef.current.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      // auto-fit scale
      const fit = Math.min(canvas.width / imgRef.current.naturalWidth, canvas.height / imgRef.current.naturalHeight);
      stateRef.current = { scale: fit, offsetX: 0, offsetY: 0, dragging: false, lastX: 0, lastY: 0 };
      setScaleState(fit);
      draw();
    };
    imgRef.current.src = imageSrc;
  }, [imageSrc, draw]);

  // Mouse handlers
  const onMouseDown = (e) => {
    stateRef.current.dragging = true;
    stateRef.current.lastX    = e.clientX;
    stateRef.current.lastY    = e.clientY;
  };
  const onMouseMove = (e) => {
    if (!stateRef.current.dragging) return;
    stateRef.current.offsetX += e.clientX - stateRef.current.lastX;
    stateRef.current.offsetY += e.clientY - stateRef.current.lastY;
    stateRef.current.lastX    = e.clientX;
    stateRef.current.lastY    = e.clientY;
    draw();
  };
  const onMouseUp   = () => { stateRef.current.dragging = false; };
  const onWheel     = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.92 : 1.08;
    const next  = Math.min(Math.max(stateRef.current.scale * delta, 0.1), 10);
    stateRef.current.scale = next;
    setScaleState(next);
    draw();
  };

  // Touch support
  const lastTouchRef = useRef(null);
  const onTouchStart = (e) => {
    if (e.touches.length === 1) {
      stateRef.current.dragging = true;
      stateRef.current.lastX    = e.touches[0].clientX;
      stateRef.current.lastY    = e.touches[0].clientY;
    }
    lastTouchRef.current = e.touches;
  };
  const onTouchMove = (e) => {
    e.preventDefault();
    if (e.touches.length === 1 && stateRef.current.dragging) {
      stateRef.current.offsetX += e.touches[0].clientX - stateRef.current.lastX;
      stateRef.current.offsetY += e.touches[0].clientY - stateRef.current.lastY;
      stateRef.current.lastX    = e.touches[0].clientX;
      stateRef.current.lastY    = e.touches[0].clientY;
      draw();
    }
  };
  const onTouchEnd = () => { stateRef.current.dragging = false; };

  const zoom = (factor) => {
    const next = Math.min(Math.max(stateRef.current.scale * factor, 0.1), 10);
    stateRef.current.scale = next;
    setScaleState(next);
    draw();
  };
  const reset = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const fit = Math.min(canvas.width / imgRef.current.naturalWidth, canvas.height / imgRef.current.naturalHeight);
    stateRef.current = { ...stateRef.current, scale: fit, offsetX: 0, offsetY: 0 };
    setScaleState(fit);
    draw();
  };

  const handleConfirm = () => {
    const canvas   = canvasRef.current;
    const s        = stateRef.current;
    const W        = canvas.width;
    const H        = canvas.height;
    const radius   = Math.min(W, H) / 2 - 12;
    const cx       = W / 2;
    const cy       = H / 2;

    // Crop region in image coords
    const iw  = imgRef.current.naturalWidth  * s.scale;
    const ih  = imgRef.current.naturalHeight * s.scale;
    const ix  = cx + s.offsetX - iw / 2;
    const iy  = cy + s.offsetY - ih / 2;
    const sx  = (cx - radius - ix) / s.scale;
    const sy  = (cy - radius - iy) / s.scale;
    const sLen = (radius * 2) / s.scale;

    const out = document.createElement('canvas');
    out.width  = OUTPUT_SIZE;
    out.height = OUTPUT_SIZE;
    const octx = out.getContext('2d');

    // Clip to circle
    octx.beginPath();
    octx.arc(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, 0, Math.PI * 2);
    octx.clip();
    octx.drawImage(imgRef.current, sx, sy, sLen, sLen, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

    onConfirm(out.toDataURL('image/png'));
  };

  return (
    <div className="crop-modal-overlay">
      <div className="crop-modal-window">
        {/* Header */}
        <div className="crop-modal-header">
          <div className="d-flex align-items-center gap-2">
            <FiCrop className="text-primary" size={18} />
            <span className="text-white fw-semibold">Crop Profile Photo</span>
          </div>
          <button type="button" className="btn border-0 p-0 text-muted" onClick={onCancel}>
            <FiX size={20} />
          </button>
        </div>

        {/* Instruction */}
        <p className="text-secondary small text-center mb-2 px-3" style={{ fontSize: '0.78rem' }}>
          Drag to reposition · Scroll or use buttons to zoom · Photo will be cropped to the circle
        </p>

        {/* Canvas */}
        <div className="crop-canvas-wrapper">
          <canvas
            ref={canvasRef}
            width={340}
            height={300}
            className="crop-canvas"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onWheel={onWheel}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          />
        </div>

        {/* Zoom Controls */}
        <div className="crop-controls">
          <button type="button" className="crop-ctrl-btn" onClick={() => zoom(0.88)} title="Zoom out">
            <FiZoomOut size={16} />
          </button>
          <div className="crop-scale-bar">
            <div
              className="crop-scale-fill"
              style={{ width: `${Math.min(((scale - 0.1) / 9.9) * 100, 100)}%` }}
            />
          </div>
          <button type="button" className="crop-ctrl-btn" onClick={() => zoom(1.12)} title="Zoom in">
            <FiZoomIn size={16} />
          </button>
          <button type="button" className="crop-ctrl-btn ms-1" onClick={reset} title="Reset">
            <FiRefreshCw size={14} />
          </button>
        </div>

        {/* Action buttons */}
        <div className="crop-modal-actions">
          <button type="button" className="btn btn-secondary btn-sm px-4" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary btn-sm px-4 d-flex align-items-center gap-1.5" onClick={handleConfirm}>
            <FiCheck size={14} /> Set Photo
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Countries list ────────────────────────────────────────────────────── */
const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Argentina','Australia','Austria','Bangladesh',
  'Belgium','Brazil','Canada','Chile','China','Colombia','Croatia','Czech Republic',
  'Denmark','Egypt','Ethiopia','Finland','France','Germany','Ghana','Greece',
  'Hungary','India','Indonesia','Iran','Iraq','Ireland','Israel','Italy','Japan',
  'Jordan','Kenya','Malaysia','Mexico','Morocco','Netherlands','New Zealand',
  'Nigeria','Norway','Pakistan','Peru','Philippines','Poland','Portugal','Romania',
  'Russia','Saudi Arabia','Singapore','South Africa','South Korea','Spain',
  'Sri Lanka','Sweden','Switzerland','Thailand','Turkey','Ukraine','United Arab Emirates',
  'United Kingdom','United States','Vietnam','Zimbabwe'
];

/* ─── Main Signup Component ──────────────────────────────────────────────── */
const Signup = () => {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const fileInputRef = useRef(null);

  /* Form fields */
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    country: '', role: 'PROCUREMENT_OFFICER', password: '', confirmPassword: ''
  });

  /* Photo states */
  const [photoPreview, setPhotoPreview]     = useState(null);   // final cropped data URL
  const [cropSrc, setCropSrc]               = useState(null);   // raw image for cropper
  const [showCropModal, setShowCropModal]   = useState(false);
  const [photoError, setPhotoError]         = useState('');
  const [photoReqs, setPhotoReqs]           = useState(false);  // show requirements tooltip

  /* UI states */
  const [showPassword, setShowPassword]               = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [success, setSuccess]         = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /* ── Photo validation ─────────────────────────────────────── */
  const validateAndOpenCropper = (file) => {
    setPhotoError('');

    if (!file) return;

    // Type check
    if (!ALLOWED_TYPES.includes(file.type)) {
      setPhotoError('Invalid file type. Only JPG, PNG, and WebP images are allowed.');
      setPhotoReqs(true);
      return;
    }

    // Size check
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setPhotoError(`File too large. Maximum size is ${MAX_SIZE_MB} MB.`);
      setPhotoReqs(true);
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        if (img.width < MIN_WIDTH || img.height < MIN_HEIGHT) {
          setPhotoError(`Image too small. Minimum size is ${MIN_WIDTH}×${MIN_HEIGHT} px.`);
          setPhotoReqs(true);
          return;
        }
        setCropSrc(ev.target.result);
        setShowCropModal(true);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    validateAndOpenCropper(e.target.files?.[0]);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    validateAndOpenCropper(e.dataTransfer.files?.[0]);
  };

  const handleCropConfirm = (dataUrl) => {
    setPhotoPreview(dataUrl);
    setPhotoError('');
    setPhotoReqs(false);
    setShowCropModal(false);
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setCropSrc(null);
  };

  const handleRemovePhoto = (e) => {
    e.stopPropagation();
    setPhotoPreview(null);
    setPhotoError('');
  };

  /* ── Field validation ─────────────────────────────────────── */
  const validateSignupFields = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = 'First name is required.';
    if (!formData.lastName.trim())  errors.lastName  = 'Last name is required.';
    if (!formData.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required.';
    } else if (!/^\+?[\d\s()-]{7,15}$/.test(formData.phone)) {
      errors.phone = 'Enter a valid phone number (7–15 digits).';
    }
    if (!formData.country.trim()) errors.country = 'Country is required.';
    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /* ── Submit ───────────────────────────────────────────────── */
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validateSignupFields()) return;

    setLoading(true);
    try {
      const payload = { ...formData, avatar: photoPreview || null };
      const result  = await register(payload);
      if (result.success) {
        setSuccess('Registration successful! Redirecting to login...');
        setFormData({ firstName: '', lastName: '', email: '', phone: '', country: '', role: 'PROCUREMENT_OFFICER', password: '', confirmPassword: '' });
        setPhotoPreview(null);
        setTimeout(() => navigate('/login'), 1800);
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

        {/* ── Photo Upload Avatar ──────────────────────────── */}
        <div className="text-center mb-4">
          <div
            className={`photo-upload-avatar mx-auto ${photoError ? 'photo-error-ring' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            title="Click or drag & drop to upload photo"
          >
            {photoPreview ? (
              <>
                {/* absolute fill so flex layout doesn't collapse the img */}
                <img
                  src={photoPreview}
                  alt="Profile preview"
                  style={{
                    position: 'absolute', inset: 0,
                    width: '100%', height: '100%',
                    objectFit: 'cover', borderRadius: '50%'
                  }}
                />
                <div className="photo-overlay">
                  <FiCamera size={18} className="text-white" />
                  <span className="photo-overlay-text">Change</span>
                </div>
                <button
                  type="button"
                  className="photo-remove-btn"
                  onClick={handleRemovePhoto}
                  title="Remove photo"
                >
                  <FiX size={12} />
                </button>
              </>
            ) : (
              <div className="photo-placeholder">
                <FiUploadCloud size={26} className="text-muted mb-1" />
                <span className="text-muted" style={{ fontSize: '0.7rem', lineHeight: 1.3 }}>
                  Upload<br />Photo
                </span>
              </div>
            )}
          </div>

          {/* Requirements hint toggle */}
          <button
            type="button"
            className="btn border-0 p-0 text-muted extra-small mt-1.5 d-flex align-items-center gap-1 mx-auto"
            onClick={() => setPhotoReqs(!photoReqs)}
            style={{ fontSize: '0.72rem' }}
          >
            <FiAlertCircle size={11} />
            Photo requirements
          </button>

          {/* Requirements panel */}
          {photoReqs && (
            <div className="photo-req-panel mt-2 mx-auto text-start">
              <p className="mb-1 fw-semibold text-white" style={{ fontSize: '0.72rem' }}>📋 Photo Requirements</p>
              <ul className="mb-0 ps-3" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                <li>Formats: <strong className="text-white">JPG, PNG, WebP</strong></li>
                <li>Max size: <strong className="text-white">{MAX_SIZE_MB} MB</strong></li>
                <li>Min dimensions: <strong className="text-white">{MIN_WIDTH}×{MIN_HEIGHT} px</strong></li>
                <li>Tip: Square photos crop best</li>
              </ul>
            </div>
          )}

          {/* Error message */}
          {photoError && (
            <div className="d-flex align-items-center justify-content-center gap-1 mt-2">
              <FiAlertCircle size={13} className="text-danger flex-shrink-0" />
              <span className="text-danger" style={{ fontSize: '0.75rem' }}>{photoError}</span>
            </div>
          )}

          {photoPreview && !photoError && (
            <div className="d-flex align-items-center justify-content-center gap-1 mt-2">
              <FiCheckCircle size={13} className="text-success flex-shrink-0" />
              <span className="text-success" style={{ fontSize: '0.75rem' }}>Photo set successfully</span>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="d-none"
            onChange={handleFileChange}
          />
        </div>

        {/* Error / Success alerts */}
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

          {/* Row 1: Name */}
          <div className="row g-3">
            <div className="col-12 col-sm-6">
              <label className="text-secondary small mb-1.5 fw-medium" htmlFor="firstName">First Name</label>
              <div className="input-group-custom d-flex align-items-center px-3 py-2 rounded-3 border border-light bg-secondary">
                <FiUser className="text-muted me-2.5" size={16} />
                <input id="firstName" name="firstName" type="text" required
                  className="bg-transparent border-0 text-white w-100 fs-7 outline-none"
                  placeholder="John" value={formData.firstName} onChange={handleChange} />
              </div>
              {fieldErrors.firstName && <span className="text-warning extra-small mt-1 d-block">{fieldErrors.firstName}</span>}
            </div>
            <div className="col-12 col-sm-6">
              <label className="text-secondary small mb-1.5 fw-medium" htmlFor="lastName">Last Name</label>
              <div className="input-group-custom d-flex align-items-center px-3 py-2 rounded-3 border border-light bg-secondary">
                <FiUser className="text-muted me-2.5" size={16} />
                <input id="lastName" name="lastName" type="text" required
                  className="bg-transparent border-0 text-white w-100 fs-7 outline-none"
                  placeholder="Doe" value={formData.lastName} onChange={handleChange} />
              </div>
              {fieldErrors.lastName && <span className="text-warning extra-small mt-1 d-block">{fieldErrors.lastName}</span>}
            </div>
          </div>

          {/* Email */}
          <div className="form-group mt-1">
            <label className="text-secondary small mb-1.5 fw-medium" htmlFor="email">Email Address</label>
            <div className="input-group-custom d-flex align-items-center px-3 py-2 rounded-3 border border-light bg-secondary">
              <FiMail className="text-muted me-2.5" size={16} />
              <input id="email" name="email" type="email" required
                className="bg-transparent border-0 text-white w-100 fs-7 outline-none"
                placeholder="john.doe@company.com" value={formData.email} onChange={handleChange} />
            </div>
            {fieldErrors.email && <span className="text-warning extra-small mt-1 d-block">{fieldErrors.email}</span>}
          </div>

          {/* Row 2: Phone & Country */}
          <div className="row g-3 mt-1">
            <div className="col-12 col-sm-6">
              <label className="text-secondary small mb-1.5 fw-medium" htmlFor="phone">Phone Number</label>
              <div className="input-group-custom d-flex align-items-center px-3 py-2 rounded-3 border border-light bg-secondary">
                <FiPhone className="text-muted me-2.5" size={16} />
                <input id="phone" name="phone" type="tel" required
                  className="bg-transparent border-0 text-white w-100 fs-7 outline-none"
                  placeholder="+1 (555) 019-2834" value={formData.phone} onChange={handleChange} />
              </div>
              {fieldErrors.phone && <span className="text-warning extra-small mt-1 d-block">{fieldErrors.phone}</span>}
            </div>
            <div className="col-12 col-sm-6">
              <label className="text-secondary small mb-1.5 fw-medium" htmlFor="country">Country</label>
              <div className="input-group-custom d-flex align-items-center px-3 py-2 rounded-3 border border-light bg-secondary">
                <FiGlobe className="text-muted me-2.5" size={16} />
                <select
                  id="country" name="country" required
                  className="bg-transparent border-0 text-white w-100 fs-7 outline-none cursor-pointer"
                  style={{ backgroundColor: 'var(--bg-secondary)' }}
                  value={formData.country}
                  onChange={handleChange}
                >
                  <option value="" style={{ backgroundColor: 'var(--bg-card)' }}>Select country...</option>
                  {COUNTRIES.map(c => (
                    <option key={c} value={c} style={{ backgroundColor: 'var(--bg-card)' }}>{c}</option>
                  ))}
                </select>
              </div>
              {fieldErrors.country && <span className="text-warning extra-small mt-1 d-block">{fieldErrors.country}</span>}
            </div>
          </div>

          {/* Role */}
          <div className="form-group mt-1">
            <label className="text-secondary small mb-1.5 fw-medium" htmlFor="role">ERP System Role</label>
            <div className="input-group-custom d-flex align-items-center px-3 py-2 rounded-3 border border-light bg-secondary">
              <FiBriefcase className="text-muted me-2.5" size={16} />
              <select id="role" name="role" required
                className="bg-transparent border-0 text-white w-100 fs-7 outline-none cursor-pointer"
                value={formData.role} onChange={handleChange}
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
                <input id="password" name="password" type={showPassword ? 'text' : 'password'} required
                  className="bg-transparent border-0 text-white w-100 fs-7 outline-none"
                  placeholder="••••••••" value={formData.password} onChange={handleChange} />
                <button type="button" className="btn border-0 p-0 text-muted ms-2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {fieldErrors.password && <span className="text-warning extra-small mt-1 d-block">{fieldErrors.password}</span>}
            </div>
            <div className="col-12 col-sm-6">
              <label className="text-secondary small mb-1.5 fw-medium" htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-group-custom d-flex align-items-center px-3 py-2 rounded-3 border border-light bg-secondary">
                <FiLock className="text-muted me-2.5" size={16} />
                <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} required
                  className="bg-transparent border-0 text-white w-100 fs-7 outline-none"
                  placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} />
                <button type="button" className="btn border-0 p-0 text-muted ms-2 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}>
                  {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {fieldErrors.confirmPassword && <span className="text-warning extra-small mt-1 d-block">{fieldErrors.confirmPassword}</span>}
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading}
            className="btn btn-primary w-100 mt-4 d-flex align-items-center justify-content-center gap-2">
            {loading
              ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
              : 'Complete Registration'}
          </button>
        </form>

        {/* Back to login */}
        <div className="text-center mt-4 pt-2 border-top border-light">
          <p className="text-secondary small mb-0">
            Already have an ERP account?{' '}
            <Link to="/login" className="text-primary text-decoration-none fw-semibold">Sign In</Link>
          </p>
        </div>
      </div>

      {/* Crop Modal */}
      {showCropModal && cropSrc && (
        <CropModal
          imageSrc={cropSrc}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
};

export default Signup;
