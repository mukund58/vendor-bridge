import { useState } from 'react';
import { 
  FiPlus, 
  FiSearch, 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiBriefcase, 
  FiEdit2, 
  FiTrash2, 
  FiX, 
  FiCheckCircle 
} from 'react-icons/fi';
import './Users.css';

const initialUsers = [
  { id: 1, name: 'Admin User', email: 'admin@vendorbridge.com', phone: '+1 (555) 019-2834', role: 'ADMIN', status: 'ACTIVE' },
  { id: 2, name: 'Apex Metal Solutions', email: 'vendor@vendorbridge.com', phone: '+91 98765 43210', role: 'VENDOR', status: 'ACTIVE' },
  { id: 3, name: 'Manager Marcus', email: 'manager@vendorbridge.com', phone: '+1 (555) 042-8891', role: 'MANAGER', status: 'ACTIVE' },
  { id: 4, name: 'Officer Jenkins', email: 'officer@vendorbridge.com', phone: '+1 (555) 011-4920', role: 'PROCUREMENT_OFFICER', status: 'ACTIVE' }
];

const Users = () => {
  const [users, setUsers] = useState(() => {
    const localDb = localStorage.getItem('vb_users_db');
    if (!localDb) {
      localStorage.setItem('vb_users_db', JSON.stringify(initialUsers));
      return initialUsers;
    }
    return JSON.parse(localDb);
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    role: 'PROCUREMENT_OFFICER',
    status: 'ACTIVE'
  });

  // Toast notification
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const saveToLocalStorage = (updatedList) => {
    setUsers(updatedList);
    localStorage.setItem('vb_users_db', JSON.stringify(updatedList));
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Filter handlers
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRoleFilter = (e) => {
    setRoleFilter(e.target.value);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter ? u.role === roleFilter : true;

    return matchesSearch && matchesRole;
  });

  const openAddModal = () => {
    setModalMode('add');
    setFormData({
      id: '',
      name: '',
      email: '',
      phone: '',
      role: 'PROCUREMENT_OFFICER',
      status: 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (targetUser) => {
    setModalMode('edit');
    setFormData({ ...targetUser });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to deactivate or remove this user?')) {
      const updated = users.filter(u => u.id !== id);
      saveToLocalStorage(updated);
      triggerToast('User workspace removed successfully.');
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (modalMode === 'add') {
      const newUser = {
        ...formData,
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1
      };
      
      const updated = [newUser, ...users];
      saveToLocalStorage(updated);
      setIsModalOpen(false);
      triggerToast('User registration complete.');
      
      console.log('Axios POST /auth/register simulated payload:', newUser);
    } else {
      const updated = users.map(u => u.id === formData.id ? { ...formData } : u);
      saveToLocalStorage(updated);
      setIsModalOpen(false);
      triggerToast('User workspace settings updated.');
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'badge bg-opacity-10 text-danger bg-danger';
      case 'MANAGER':
        return 'badge bg-opacity-10 text-warning bg-warning';
      case 'PROCUREMENT_OFFICER':
        return 'badge bg-opacity-10 text-primary bg-primary';
      case 'VENDOR':
        return 'badge bg-opacity-10 text-success bg-success';
      default:
        return 'badge bg-opacity-10 text-secondary bg-secondary';
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Title Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
        <div>
          <h1 className="h3 mb-1 text-white fw-bold">Users Directory</h1>
          <p className="text-secondary small">Manage system login accounts, authorization roles, and operator access.</p>
        </div>
        <button 
          type="button" 
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={openAddModal}
        >
          <FiPlus /> Add Operator
        </button>
      </div>

      {/* Filter panel */}
      <div className="card p-3">
        <div className="d-flex flex-column flex-md-row gap-3 justify-content-between align-items-stretch">
          <div className="d-flex align-items-center bg-secondary px-3 py-1.5 rounded-3 border border-light flex-grow-1" style={{ maxWidth: '400px' }}>
            <FiSearch className="text-muted me-2" size={16} />
            <input 
              type="text" 
              className="bg-transparent border-0 text-white w-100 fs-7 outline-none" 
              placeholder="Search users by name, email..." 
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className="d-flex align-items-center bg-secondary px-2.5 py-1 rounded-3 border border-light">
            <FiBriefcase className="text-muted me-2" size={14} />
            <select 
              className="form-select form-select-sm bg-transparent border-0 text-white cursor-pointer py-0 outline-none" 
              style={{ width: '160px' }}
              value={roleFilter}
              onChange={handleRoleFilter}
            >
              <option value="" style={{ backgroundColor: 'var(--bg-secondary)' }}>All System Roles</option>
              <option value="ADMIN" style={{ backgroundColor: 'var(--bg-secondary)' }}>ADMIN</option>
              <option value="PROCUREMENT_OFFICER" style={{ backgroundColor: 'var(--bg-secondary)' }}>PROCUREMENT_OFFICER</option>
              <option value="MANAGER" style={{ backgroundColor: 'var(--bg-secondary)' }}>MANAGER</option>
              <option value="VENDOR" style={{ backgroundColor: 'var(--bg-secondary)' }}>VENDOR</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users List Grid */}
      <div className="card p-4">
        <div className="table-responsive border-0">
          <table className="table custom-table text-nowrap align-middle">
            <thead>
              <tr>
                <th scope="col">Full Name</th>
                <th scope="col">Email Address</th>
                <th scope="col">Phone</th>
                <th scope="col">Role</th>
                <th scope="col">Status</th>
                <th scope="col" className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-5 text-secondary">
                    No operator accounts match filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((item) => (
                  <tr key={item.id} className="users-grid-row">
                    <td className="fw-semibold text-white">{item.name}</td>
                    <td className="text-secondary small">{item.email}</td>
                    <td className="text-secondary small">{item.phone}</td>
                    <td>
                      <span className={`${getRoleBadgeClass(item.role)} user-profile-badge`}>
                        {item.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge-status ${item.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-2">
                        <button 
                          type="button" 
                          className="btn btn-secondary btn-sm p-1.5 rounded-circle d-inline-flex"
                          onClick={() => openEditModal(item)}
                          title="Edit Operator Settings"
                        >
                          <FiEdit2 size={12} />
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-danger btn-sm p-1.5 rounded-circle d-inline-flex bg-opacity-10 border-0"
                          onClick={() => handleDelete(item.id)}
                          title="Block User"
                          style={{ color: 'var(--danger)', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                        >
                          <FiTrash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal Overlay */}
      {isModalOpen && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content card p-4 glass border border-light" style={{ width: '450px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-light">
              <h5 className="text-white fw-bold m-0">{modalMode === 'add' ? 'Register Operator Account' : 'Edit Operator Details'}</h5>
              <button 
                type="button" 
                className="btn border-0 p-0 text-white text-muted-hover"
                onClick={() => setIsModalOpen(false)}
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="d-flex flex-column gap-3">
              <div>
                <label className="text-secondary small mb-1 fw-medium" htmlFor="modal-name">Full Name</label>
                <div className="form-input-wrapper px-3 py-2 rounded-3">
                  <FiUser className="text-muted me-2" size={14} />
                  <input 
                    id="modal-name"
                    type="text" 
                    required 
                    className="bg-transparent border-0 text-white w-100 fs-7 outline-none" 
                    placeholder="e.g. John Miller"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-secondary small mb-1 fw-medium" htmlFor="modal-email">Email Address</label>
                <div className="form-input-wrapper px-3 py-2 rounded-3">
                  <FiMail className="text-muted me-2" size={14} />
                  <input 
                    id="modal-email"
                    type="email" 
                    required 
                    className="bg-transparent border-0 text-white w-100 fs-7 outline-none" 
                    placeholder="john@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-secondary small mb-1 fw-medium" htmlFor="modal-phone">Phone Number</label>
                <div className="form-input-wrapper px-3 py-2 rounded-3">
                  <FiPhone className="text-muted me-2" size={14} />
                  <input 
                    id="modal-phone"
                    type="text" 
                    required 
                    className="bg-transparent border-0 text-white w-100 fs-7 outline-none" 
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="row g-3">
                <div className="col-12 col-sm-6">
                  <label className="text-secondary small mb-1 fw-medium" htmlFor="modal-role">System Role</label>
                  <div className="form-input-wrapper px-3 py-2 rounded-3">
                    <select
                      id="modal-role"
                      className="bg-transparent border-0 text-white w-100 fs-7 outline-none cursor-pointer"
                      style={{ backgroundColor: 'var(--bg-secondary)' }}
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option value="PROCUREMENT_OFFICER">PROCUREMENT_OFFICER</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="MANAGER">MANAGER</option>
                      <option value="VENDOR">VENDOR</option>
                    </select>
                  </div>
                </div>

                <div className="col-12 col-sm-6">
                  <label className="text-secondary small mb-1 fw-medium" htmlFor="modal-status">Status</label>
                  <div className="form-input-wrapper px-3 py-2 rounded-3">
                    <select
                      id="modal-status"
                      className="bg-transparent border-0 text-white w-100 fs-7 outline-none cursor-pointer"
                      style={{ backgroundColor: 'var(--bg-secondary)' }}
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INACTIVE">INACTIVE</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4 pt-2.5 border-top border-light">
                <button 
                  type="button" 
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary btn-sm px-4 fw-medium"
                >
                  {modalMode === 'add' ? 'Add User' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

export default Users;
