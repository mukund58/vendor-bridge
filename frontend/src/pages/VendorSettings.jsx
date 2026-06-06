import { useState } from 'react';
import { 
  FiFileText, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiBriefcase, 
  FiSave, 
  FiRefreshCw, 
  FiCheckCircle, 
  FiInfo 
} from 'react-icons/fi';
import './VendorSettings.css';

const initialSettings = {
  companyName: 'Apex Metals Ltd',
  gstNumber: '27AAAAA1111A1Z1',
  email: 'procurement@apexmetals.com',
  phone: '+91 98765 43210',
  address: 'Plot No. 42, GIDC Industrial Estate, Sector 2, Pune, Maharashtra - 411026',
  category: 'Raw Materials',
  status: 'VERIFIED' // VERIFIED, PENDING, BLOCKED
};

const VendorSettings = () => {
  const [settings, setSettings] = useState({ ...initialSettings });
  
  // Notification Toast states
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();

    // Simulate backend API PUT /vendors/settings payload log
    console.log('Axios PUT /vendors/settings requested with payload:', {
      companyName: settings.companyName,
      gstNumber: settings.gstNumber,
      email: settings.email,
      phone: settings.phone,
      address: settings.address,
      category: settings.category,
      status: settings.status
    });

    triggerToast('Company settings successfully updated and saved in backend.');
  };

  const handleReset = () => {
    setSettings({ ...initialSettings });
    triggerToast('Settings restored to initial values.');
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Helper status color mapping
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'VERIFIED':
        return 'badge-success';
      case 'PENDING':
        return 'badge-warning';
      case 'BLOCKED':
        return 'badge-danger';
      default:
        return 'badge-info';
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Title Header Section */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
        <div>
          <h1 className="h3 mb-1 text-white fw-bold">Vendor Settings</h1>
          <p className="text-secondary small">Maintain corporate information, tax registries, contact channels, and addresses.</p>
        </div>
        <div>
          {/* Status Badge */}
          <div className="d-flex align-items-center gap-2">
            <span className="text-secondary small fw-medium">Verification Status:</span>
            <span className={`badge-status ${getStatusBadgeClass(settings.status)} fw-bold uppercase`}>
              {settings.status}
            </span>
          </div>
        </div>
      </div>

      {/* Main Settings Edit Form */}
      <form onSubmit={handleSaveSettings} className="d-flex flex-column gap-4">
        
        {/* Row 1: Company Details & GST Information */}
        <div className="row g-4">
          {/* Section 1: Company Details */}
          <div className="col-12 col-md-6">
            <div className="card p-4 settings-section-card h-100">
              <h5 className="text-white mb-3 fw-semibold d-flex align-items-center gap-2 fs-6">
                <FiInfo className="text-primary" /> Company Details
              </h5>
              
              <div className="form-group mb-3">
                <label className="text-secondary small mb-1.5 fw-medium" htmlFor="companyName">Corporate Name</label>
                <div className="input-group-custom d-flex align-items-center px-3 py-2 rounded-3 border border-light bg-secondary">
                  <FiBriefcase className="text-muted me-2.5" size={16} />
                  <input 
                    id="companyName"
                    name="companyName"
                    type="text"
                    required
                    className="bg-transparent border-0 text-white w-100 fs-7 outline-none"
                    placeholder="Company Name"
                    value={settings.companyName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Section 4: Business Category */}
              <div className="form-group">
                <label className="text-secondary small mb-1.5 fw-medium" htmlFor="category">Business Category</label>
                <div className="input-group-custom d-flex align-items-center px-3 py-2 rounded-3 border border-light bg-secondary">
                  <FiBriefcase className="text-muted me-2.5" size={16} />
                  <select
                    id="category"
                    name="category"
                    required
                    className="bg-transparent border-0 text-white w-100 fs-7 outline-none cursor-pointer"
                    value={settings.category}
                    onChange={handleInputChange}
                  >
                    <option value="Raw Materials">Raw Materials</option>
                    <option value="IT Solutions">IT Solutions</option>
                    <option value="Heavy Equipment">Heavy Equipment</option>
                    <option value="Logistics & Services">Logistics & Services</option>
                  </select>
                </div>
              </div>

            </div>
          </div>

          {/* Section 2: GST Information */}
          <div className="col-12 col-md-6">
            <div className="card p-4 settings-section-card h-100">
              <h5 className="text-white mb-3 fw-semibold d-flex align-items-center gap-2 fs-6">
                <FiFileText className="text-primary" /> Tax Registration
              </h5>

              <div className="form-group mb-3">
                <label className="text-secondary small mb-1.5 fw-medium" htmlFor="gstNumber">GSTIN Number</label>
                <div className="input-group-custom d-flex align-items-center px-3 py-2 rounded-3 border border-light bg-secondary">
                  <FiFileText className="text-muted me-2.5" size={16} />
                  <input 
                    id="gstNumber"
                    name="gstNumber"
                    type="text"
                    required
                    maxLength={15}
                    className="bg-transparent border-0 text-white w-100 fs-7 outline-none uppercase"
                    placeholder="27AAAAA1111A1Z1"
                    value={settings.gstNumber}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Section 5: Vendor Status Selector */}
              <div className="form-group">
                <label className="text-secondary small mb-1.5 fw-medium" htmlFor="status">Corporate Status</label>
                <div className="input-group-custom d-flex align-items-center px-3 py-2 rounded-3 border border-light bg-secondary">
                  <FiInfo className="text-muted me-2.5" size={16} />
                  <select
                    id="status"
                    name="status"
                    required
                    className="bg-transparent border-0 text-white w-100 fs-7 outline-none cursor-pointer"
                    value={settings.status}
                    onChange={handleInputChange}
                  >
                    <option value="VERIFIED">VERIFIED</option>
                    <option value="PENDING">PENDING</option>
                    <option value="BLOCKED">BLOCKED</option>
                  </select>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Row 2: Contact Details & Address Information */}
        <div className="row g-4">
          {/* Section 3: Contact Details */}
          <div className="col-12 col-md-6">
            <div className="card p-4 settings-section-card h-100">
              <h5 className="text-white mb-3 fw-semibold d-flex align-items-center gap-2 fs-6">
                <FiMail className="text-primary" /> Contact Channels
              </h5>

              <div className="form-group mb-3">
                <label className="text-secondary small mb-1.5 fw-medium" htmlFor="email">Public Email</label>
                <div className="input-group-custom d-flex align-items-center px-3 py-2 rounded-3 border border-light bg-secondary">
                  <FiMail className="text-muted me-2.5" size={16} />
                  <input 
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="bg-transparent border-0 text-white w-100 fs-7 outline-none"
                    placeholder="contact@company.com"
                    value={settings.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="text-secondary small mb-1.5 fw-medium" htmlFor="phone">Phone Number</label>
                <div className="input-group-custom d-flex align-items-center px-3 py-2 rounded-3 border border-light bg-secondary">
                  <FiPhone className="text-muted me-2.5" size={16} />
                  <input 
                    id="phone"
                    name="phone"
                    type="text"
                    required
                    className="bg-transparent border-0 text-white w-100 fs-7 outline-none"
                    placeholder="+1 (555) 012-3456"
                    value={settings.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Section 6: Address Information */}
          <div className="col-12 col-md-6">
            <div className="card p-4 settings-section-card h-100">
              <h5 className="text-white mb-3 fw-semibold d-flex align-items-center gap-2 fs-6">
                <FiMapPin className="text-primary" /> Address Information
              </h5>

              <div className="form-group h-100 d-flex flex-column">
                <label className="text-secondary small mb-1.5 fw-medium" htmlFor="address">Registered Address</label>
                <div className="input-group-custom d-flex align-items-start px-3 py-2 rounded-3 border border-light bg-secondary flex-grow-1">
                  <FiMapPin className="text-muted me-2.5 mt-1" size={16} />
                  <textarea 
                    id="address"
                    name="address"
                    required
                    rows={4}
                    className="form-control bg-transparent border-0 outline-none w-100 h-100 text-white fs-7"
                    placeholder="Enter street, city, state, country and ZIP code..."
                    value={settings.address}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Action Controls Row */}
        <div className="d-flex justify-content-end gap-2 mt-2">
          <button 
            type="button" 
            className="btn btn-secondary d-flex align-items-center gap-1.5 px-4"
            onClick={handleReset}
          >
            <FiRefreshCw size={15} /> Reset
          </button>
          <button 
            type="submit" 
            className="btn btn-primary d-flex align-items-center gap-1.5 px-4"
          >
            <FiSave size={15} /> Save Settings
          </button>
        </div>

      </form>

      {/* Success Notification Alert toast */}
      {showToast && (
        <div className="toast-feedback p-3 d-flex align-items-center gap-2">
          <FiCheckCircle className="text-success" size={18} />
          <span className="small">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default VendorSettings;
