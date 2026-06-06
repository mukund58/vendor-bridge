import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiBriefcase, 
  FiGlobe, 
  FiCalendar, 
  FiCamera, 
  FiKey, 
  FiCheck, 
  FiX, 
  FiCheckCircle 
} from 'react-icons/fi';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  
  // Initial states based on logged-in user
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user ? user.name : 'Sarah Jenkins',
    email: user ? user.email : 'sarah.j@vendorbridge.com',
    phone: '+1 (555) 019-2834',
    country: 'United States',
    role: user ? user.role : 'ADMIN',
    joinedDate: 'January 15, 2026',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&fit=crop'
  });

  // Temporarily holds changes during editing
  const [tempData, setTempData] = useState({ ...profileData });

  // Password Change Modal states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordFields, setPasswordFields] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Notification Toast states
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [modalError, setModalError] = useState('');

  const handleEditToggle = () => {
    setTempData({ ...profileData });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    setProfileData({ ...tempData });
    setIsEditing(false);

    // Simulate backend PUT /auth/me payload log
    console.log('Axios PUT /auth/me requested with payload:', {
      fullName: tempData.fullName,
      email: tempData.email,
      phone: tempData.phone,
      country: tempData.country
    });

    triggerToast('Profile changes saved successfully!');
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handlePasswordModalSubmit = (e) => {
    e.preventDefault();
    setModalError('');

    if (passwordFields.newPassword !== passwordFields.confirmPassword) {
      setModalError('New passwords do not match.');
      return;
    }

    if (passwordFields.newPassword.length < 6) {
      setModalError('Password must be at least 6 characters long.');
      return;
    }

    // Simulate backend PATCH /auth/change-password payload log
    console.log('Axios PATCH /auth/change-password requested with payload:', {
      currentPassword: passwordFields.currentPassword,
      newPassword: passwordFields.newPassword
    });

    setShowPasswordModal(false);
    setPasswordFields({ currentPassword: '', newPassword: '', confirmPassword: '' });
    triggerToast('Password updated successfully!');
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Title Header */}
      <div>
        <h1 className="h3 mb-1 text-white fw-bold">Profile Details</h1>
        <p className="text-secondary small">Manage your personal settings, avatar configurations, and credentials.</p>
      </div>

      <div className="row g-4">
        {/* Left Side: Photo & Quick Actions */}
        <div className="col-12 col-lg-4">
          <div className="card p-4 text-center profile-card h-100 d-flex flex-column justify-content-center">
            <div className="profile-avatar-container mb-3.5">
              <img 
                src={profileData.avatar} 
                alt="Profile Avatar" 
                className="img-fluid rounded-circle border border-3 border-primary"
                style={{ width: '120px', height: '120px', objectFit: 'cover' }}
              />
              <div className="profile-avatar-overlay" title="Update Profile Picture">
                <FiCamera size={14} />
              </div>
            </div>

            <h4 className="text-white fw-bold mb-1">{profileData.fullName}</h4>
            <span className="badge bg-opacity-10 text-primary bg-primary px-3 py-1.5 rounded-pill uppercase text-xs mb-4" style={{ width: 'fit-content', margin: '0 auto' }}>
              {profileData.role}
            </span>

            <div className="d-flex flex-column gap-2 mt-2">
              {!isEditing && (
                <button 
                  type="button" 
                  className="btn btn-primary d-flex align-items-center justify-content-center gap-2"
                  onClick={handleEditToggle}
                >
                  Edit Profile
                </button>
              )}
              <button 
                type="button" 
                className="btn btn-secondary d-flex align-items-center justify-content-center gap-2"
                onClick={() => setShowPasswordModal(true)}
              >
                <FiKey /> Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Account Details Info Form */}
        <div className="col-12 col-lg-8">
          <div className="card p-4 profile-card h-100">
            <h5 className="text-white mb-4 fw-semibold">Personal Information</h5>

            <form onSubmit={handleSaveChanges} className="d-flex flex-column gap-3.5">
              {/* Row 1: Full Name & Email */}
              <div className="row g-3">
                <div className="col-12 col-sm-6">
                  <label className="text-secondary small mb-1.5 fw-medium" htmlFor="fullName">Full Name</label>
                  <div className="input-group-custom d-flex align-items-center px-3 py-2 rounded-3 border border-light bg-secondary">
                    <FiUser className="text-muted me-2.5" size={16} />
                    <input 
                      id="fullName"
                      name="fullName"
                      type="text"
                      className="bg-transparent border-0 text-white w-100 fs-7 outline-none"
                      disabled={!isEditing}
                      value={isEditing ? tempData.fullName : profileData.fullName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <label className="text-secondary small mb-1.5 fw-medium" htmlFor="email">Email Address</label>
                  <div className="input-group-custom d-flex align-items-center px-3 py-2 rounded-3 border border-light bg-secondary">
                    <FiMail className="text-muted me-2.5" size={16} />
                    <input 
                      id="email"
                      name="email"
                      type="email"
                      className="bg-transparent border-0 text-white w-100 fs-7 outline-none"
                      disabled={!isEditing}
                      value={isEditing ? tempData.email : profileData.email}
                      onChange={handleInputChange}
                    />
                  </div>
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
                      type="text"
                      className="bg-transparent border-0 text-white w-100 fs-7 outline-none"
                      disabled={!isEditing}
                      value={isEditing ? tempData.phone : profileData.phone}
                      onChange={handleInputChange}
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
                      className="bg-transparent border-0 text-white w-100 fs-7 outline-none"
                      disabled={!isEditing}
                      value={isEditing ? tempData.country : profileData.country}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Role & Joined Date */}
              <div className="row g-3 mt-1">
                <div className="col-12 col-sm-6">
                  <label className="text-secondary small mb-1.5 fw-medium">System Role</label>
                  <div className="input-group-custom d-flex align-items-center px-3 py-2 rounded-3 border border-light bg-secondary opacity-75">
                    <FiBriefcase className="text-muted me-2.5" size={16} />
                    <input 
                      type="text"
                      className="bg-transparent border-0 text-white w-100 fs-7 outline-none"
                      disabled
                      value={profileData.role}
                    />
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <label className="text-secondary small mb-1.5 fw-medium">Joined Date</label>
                  <div className="input-group-custom d-flex align-items-center px-3 py-2 rounded-3 border border-light bg-secondary opacity-75">
                    <FiCalendar className="text-muted me-2.5" size={16} />
                    <input 
                      type="text"
                      className="bg-transparent border-0 text-white w-100 fs-7 outline-none"
                      disabled
                      value={profileData.joinedDate}
                    />
                  </div>
                </div>
              </div>

              {/* Save/Cancel Action Buttons */}
              {isEditing && (
                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button 
                    type="button" 
                    className="btn btn-secondary d-flex align-items-center gap-1.5 px-3"
                    onClick={handleCancel}
                  >
                    <FiX /> Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary d-flex align-items-center gap-1.5 px-3"
                  >
                    <FiCheck /> Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Change Password Modal Overlay */}
      {showPasswordModal && (
        <div className="modal-overlay-glass">
          <div className="modal-content-card p-4">
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-light">
              <h5 className="text-white mb-0 fw-semibold">Change Account Password</h5>
              <button 
                type="button" 
                className="btn border-0 p-0 text-muted cursor-pointer"
                onClick={() => setShowPasswordModal(false)}
              >
                <FiX size={18} />
              </button>
            </div>

            {modalError && (
              <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger small py-1.5 px-3 mb-3 rounded">
                <span className="fw-medium">{modalError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordModalSubmit} className="d-flex flex-column gap-3">
              <div>
                <label className="text-secondary small mb-1.5 fw-medium">Current Password</label>
                <input 
                  type="password"
                  required
                  className="form-control bg-secondary text-white border-light fs-7 px-3 py-2 outline-none"
                  value={passwordFields.currentPassword}
                  onChange={(e) => setPasswordFields(prev => ({ ...prev, currentPassword: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-secondary small mb-1.5 fw-medium">New Password</label>
                <input 
                  type="password"
                  required
                  className="form-control bg-secondary text-white border-light fs-7 px-3 py-2 outline-none"
                  value={passwordFields.newPassword}
                  onChange={(e) => setPasswordFields(prev => ({ ...prev, newPassword: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-secondary small mb-1.5 fw-medium">Confirm New Password</label>
                <input 
                  type="password"
                  required
                  className="form-control bg-secondary text-white border-light fs-7 px-3 py-2 outline-none"
                  value={passwordFields.confirmPassword}
                  onChange={(e) => setPasswordFields(prev => ({ ...prev, confirmPassword: e.target.value }))}
                />
              </div>

              <div className="d-flex justify-content-end gap-2 mt-3 pt-2 border-top border-light">
                <button 
                  type="button" 
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary btn-sm"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Feedback Toast */}
      {showToast && (
        <div className="toast-feedback p-3 d-flex align-items-center gap-2">
          <FiCheckCircle className="text-success" size={18} />
          <span className="small">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default Profile;
