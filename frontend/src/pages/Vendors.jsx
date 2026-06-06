import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FiPlus, FiSearch, FiSliders, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import './Vendors.css';
import { fetchVendors, addVendor, updateVendorDetails, blockVendor } from '../services/vendorService';

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [formData, setFormData] = useState({
    id: '',
    companyName: '',
    gstNumber: '',
    category: 'Raw Materials',
    contactPerson: '',
    email: '',
    phone: '',
    status: 'ACTIVE'
  });
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const location = useLocation();

  const loadVendors = async () => {
    try {
      const data = await fetchVendors();
      setVendors(data);
    } catch (err) {
      console.error('Failed to load vendors', err);
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('add') === 'true') {
      openAddModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, vendors]);

  // Extract categories dynamically
  const categories = Array.from(new Set(vendors.map(v => v.category)));

  // Filter handlers
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  // Filter logic matching search term and category status
  const filteredVendors = vendors.filter((vendor) => {
    const name = vendor.companyName || vendor.name || '';
    const matchesSearch = 
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vendor.gstNumber || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter ? vendor.category === categoryFilter : true;
    const matchesStatus = statusFilter ? vendor.status === statusFilter : true;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredVendors.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredVendors.slice(indexOfFirstRow, indexOfLastRow);

  // Form operations
  const openAddModal = () => {
    setModalMode('add');
    setFormData({
      id: '',
      companyName: '',
      gstNumber: '',
      category: 'Raw Materials',
      contactPerson: '',
      email: '',
      phone: '',
      status: 'ACTIVE'
    });
    setFormError('');
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (vendor) => {
    setModalMode('edit');
    setFormData({
      id: vendor.id,
      companyName: vendor.companyName || vendor.name || '',
      gstNumber: vendor.gstNumber || '',
      category: vendor.category || 'Raw Materials',
      contactPerson: vendor.contactPerson || '',
      email: vendor.email || '',
      phone: vendor.phone || '',
      status: vendor.status || 'ACTIVE'
    });
    setFormError('');
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to block or delete this vendor?')) {
      try {
        await blockVendor(id);
        await loadVendors();
        if (currentPage > Math.ceil((vendors.length - 1) / rowsPerPage) && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (err) {
        console.error('Failed to delete/block vendor', err);
      }
    }
  };

  const validateVendorForm = () => {
    const errors = {};
    if (!formData.companyName.trim()) errors.companyName = 'Company name is required.';
    if (!formData.gstNumber.trim()) {
      errors.gstNumber = 'GSTIN is required.';
    } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstNumber)) {
      errors.gstNumber = 'Invalid GSTIN format (e.g. 27AAACA1111A1Z1).';
    }
    if (!formData.contactPerson.trim()) errors.contactPerson = 'Contact person is required.';
    if (!formData.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Enter a valid email address.';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = 'Phone must be exactly 10 digits.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!validateVendorForm()) return;

    try {
      if (modalMode === 'add') {
        await addVendor(formData);
      } else {
        await updateVendorDetails(formData.id, formData);
      }
      setIsModalOpen(false);
      await loadVendors();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors 
        ? Object.values(err.response.data.errors).flat().join(', ')
        : 'Failed to submit vendor form';
      setFormError(msg);
      console.error('Failed to submit vendor form', err);
    }
  };

  // Helper status color mapping
  const getStatusMeta = (status) => {
    switch (status) {
      case 'ACTIVE':
        return { badge: 'badge-success', label: 'Active' };
      case 'PENDING':
        return { badge: 'badge-warning', label: 'Pending' };
      case 'BLOCKED':
        return { badge: 'badge-danger', label: 'Blocked' };
      default:
        return { badge: 'badge-secondary', label: status };
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header Panel */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
        <div>
          <h1 className="h3 mb-1 text-white fw-bold">Vendor Directory</h1>
          <p className="text-secondary small">Maintain procurement partners, GST details, and status reviews.</p>
        </div>
        <button 
          type="button" 
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={openAddModal}
        >
          <FiPlus /> Add New Vendor
        </button>
      </div>

      {/* KPI Overview */}
      <div className="row g-3">
        <div className="col-12 col-md-3">
          <div className="card p-3 animate-fade" style={{ backgroundColor: 'var(--bg-card)' }}>
            <span className="text-secondary extra-small fw-semibold uppercase tracking-wider">Total Partners</span>
            <div className="fs-3 fw-bold text-white mt-1">{vendors.length}</div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="card p-3" style={{ backgroundColor: 'var(--bg-card)' }}>
            <span className="text-success extra-small fw-semibold uppercase tracking-wider">Active Suppliers</span>
            <div className="fs-3 fw-bold text-white mt-1">{vendors.filter(v => v.status === 'ACTIVE').length}</div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="card p-3" style={{ backgroundColor: 'var(--bg-card)' }}>
            <span className="text-warning extra-small fw-semibold uppercase tracking-wider">Pending Audit</span>
            <div className="fs-3 fw-bold text-white mt-1">{vendors.filter(v => v.status === 'PENDING').length}</div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="card p-3" style={{ backgroundColor: 'var(--bg-card)' }}>
            <span className="text-danger extra-small fw-semibold uppercase tracking-wider">Blocked</span>
            <div className="fs-3 fw-bold text-white mt-1">{vendors.filter(v => v.status === 'BLOCKED').length}</div>
          </div>
        </div>
      </div>

      {/* Filtering Toolbar */}
      <div className="card p-3.5">
        <div className="d-flex flex-column flex-lg-row gap-3 justify-content-between align-items-stretch">
          {/* Search field */}
          <div className="d-flex align-items-center bg-secondary px-3 py-1.5 rounded-3 border border-light flex-grow-1" style={{ maxWidth: '450px' }}>
            <FiSearch className="text-muted me-2" size={16} />
            <input 
              type="text" 
              className="bg-transparent border-0 text-white w-100 fs-7 outline-none" 
              placeholder="Search by vendor name, GSTIN..." 
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          {/* Category / Status dropdowns */}
          <div className="d-flex flex-wrap gap-2">
            <div className="d-flex align-items-center bg-secondary px-2.5 py-1 rounded-3 border border-light">
              <FiSliders className="text-muted me-2" size={14} />
              <select 
                className="form-select form-select-sm bg-transparent border-0 text-white cursor-pointer py-0 outline-none" 
                style={{ width: '150px' }}
                value={categoryFilter}
                onChange={handleCategoryChange}
              >
                <option value="" style={{ backgroundColor: 'var(--bg-secondary)' }}>All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat} style={{ backgroundColor: 'var(--bg-secondary)' }}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="d-flex align-items-center bg-secondary px-2.5 py-1 rounded-3 border border-light">
              <select 
                className="form-select form-select-sm bg-transparent border-0 text-white cursor-pointer py-0 outline-none" 
                style={{ width: '130px' }}
                value={statusFilter}
                onChange={handleStatusChange}
              >
                <option value="" style={{ backgroundColor: 'var(--bg-secondary)' }}>All Statuses</option>
                <option value="ACTIVE" style={{ backgroundColor: 'var(--bg-secondary)' }}>Active</option>
                <option value="PENDING" style={{ backgroundColor: 'var(--bg-secondary)' }}>Pending</option>
                <option value="BLOCKED" style={{ backgroundColor: 'var(--bg-secondary)' }}>Blocked</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Directory */}
      <div className="card p-4">
        <div className="table-responsive border-0">
          <table className="table custom-table text-nowrap align-middle">
            <thead>
              <tr>
                <th scope="col">Vendor Name</th>
                <th scope="col">GST Number</th>
                <th scope="col">Category</th>
                <th scope="col">Status</th>
                <th scope="col" className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-5 text-secondary">
                    No suppliers match search filters.
                  </td>
                </tr>
              ) : (
                currentRows.map((vendor) => {
                  const statusMeta = getStatusMeta(vendor.status);
                  return (
                    <tr key={vendor.id}>
                      <td className="fw-semibold text-white">{vendor.companyName || vendor.name}</td>
                      <td className="font-monospace text-secondary small">{vendor.gstNumber}</td>
                      <td>{vendor.category}</td>
                      <td>
                        <span className={`badge-status ${statusMeta.badge}`}>
                          {statusMeta.label}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="d-inline-flex gap-2">
                          <button 
                            type="button" 
                            className="btn btn-secondary btn-sm p-1.5 rounded-circle d-inline-flex"
                            onClick={() => openEditModal(vendor)}
                            title="Edit Details"
                          >
                            <FiEdit2 size={12} />
                          </button>
                          <button 
                            type="button" 
                            className="btn btn-danger btn-sm p-1.5 rounded-circle d-inline-flex bg-opacity-10 border-0"
                            onClick={() => handleDelete(vendor.id)}
                            title="Block Supplier"
                            style={{ color: 'var(--danger)', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                          >
                            <FiTrash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top border-light">
            <span className="text-secondary small">
              Showing <strong className="text-white">{indexOfFirstRow + 1}</strong> to <strong className="text-white">{Math.min(indexOfLastRow, filteredVendors.length)}</strong> of <strong className="text-white">{filteredVendors.length}</strong> suppliers
            </span>
            <div className="d-flex gap-1.5 align-items-center">
              <button 
                type="button" 
                className="pagination-btn"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                <button
                  key={num}
                  type="button"
                  className={`pagination-number ${currentPage === num ? 'active' : ''}`}
                  onClick={() => setCurrentPage(num)}
                >
                  {num}
                </button>
              ))}
              <button 
                type="button" 
                className="pagination-btn"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Form overlay modal */}
      {isModalOpen && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content card p-4 glass border border-light">
            <div className="d-flex justify-content-between align-items-center mb-4 pb-2.5 border-bottom border-light">
              <h5 className="text-white fw-bold m-0">{modalMode === 'add' ? 'Add New Vendor' : 'Edit Vendor Details'}</h5>
              <button 
                type="button" 
                className="btn border-0 p-0 text-white text-muted-hover"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="d-flex flex-column gap-3.5">
              {formError && (
                <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger small py-2 px-3 rounded-3">
                  <span className="fw-medium">{formError}</span>
                </div>
              )}
              <div className="row g-3">
                {/* Company Name */}
                <div className="col-12">
                  <label className="text-secondary small mb-1 fw-medium" htmlFor="vendor-name-input">Company Name *</label>
                  <div className="form-input-wrapper px-3 py-2 rounded-3">
                    <input 
                      id="vendor-name-input"
                      type="text" 
                      required 
                      className="bg-transparent border-0 text-white w-100 fs-7 outline-none" 
                      placeholder="e.g. Apex Metals Ltd"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    />
                  </div>
                  {fieldErrors.companyName && <span className="text-warning extra-small mt-1 d-block">{fieldErrors.companyName}</span>}
                </div>

                {/* Contact Person */}
                <div className="col-12 col-sm-6">
                  <label className="text-secondary small mb-1 fw-medium" htmlFor="vendor-contact-input">Contact Person *</label>
                  <div className="form-input-wrapper px-3 py-2 rounded-3">
                    <input 
                      id="vendor-contact-input"
                      type="text" 
                      required 
                      className="bg-transparent border-0 text-white w-100 fs-7 outline-none" 
                      placeholder="e.g. John Smith"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    />
                  </div>
                  {fieldErrors.contactPerson && <span className="text-warning extra-small mt-1 d-block">{fieldErrors.contactPerson}</span>}
                </div>

                {/* Email */}
                <div className="col-12 col-sm-6">
                  <label className="text-secondary small mb-1 fw-medium" htmlFor="vendor-email-input">Email Address *</label>
                  <div className="form-input-wrapper px-3 py-2 rounded-3">
                    <input 
                      id="vendor-email-input"
                      type="email" 
                      required 
                      className="bg-transparent border-0 text-white w-100 fs-7 outline-none" 
                      placeholder="vendor@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  {fieldErrors.email && <span className="text-warning extra-small mt-1 d-block">{fieldErrors.email}</span>}
                </div>

                {/* Phone */}
                <div className="col-12 col-sm-6">
                  <label className="text-secondary small mb-1 fw-medium" htmlFor="vendor-phone-input">Phone (10 digits) *</label>
                  <div className="form-input-wrapper px-3 py-2 rounded-3">
                    <input 
                      id="vendor-phone-input"
                      type="text" 
                      required 
                      maxLength={10}
                      className="bg-transparent border-0 text-white w-100 fs-7 outline-none" 
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                    />
                  </div>
                  {fieldErrors.phone && <span className="text-warning extra-small mt-1 d-block">{fieldErrors.phone}</span>}
                </div>

                {/* GST Number */}
                <div className="col-12 col-sm-6">
                  <label className="text-secondary small mb-1 fw-medium" htmlFor="vendor-gst-input">GSTIN Number *</label>
                  <div className="form-input-wrapper px-3 py-2 rounded-3">
                    <input 
                      id="vendor-gst-input"
                      type="text" 
                      required 
                      maxLength={15}
                      className="bg-transparent border-0 text-white w-100 fs-7 outline-none font-monospace" 
                      placeholder="27AAACA1111A1Z1"
                      value={formData.gstNumber}
                      onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
                    />
                  </div>
                  {fieldErrors.gstNumber && <span className="text-warning extra-small mt-1 d-block">{fieldErrors.gstNumber}</span>}
                </div>

                {/* Category Selector */}
                <div className="col-12 col-sm-6">
                  <label className="text-secondary small mb-1 fw-medium" htmlFor="vendor-category-input">Category</label>
                  <div className="form-input-wrapper px-3 py-2 rounded-3">
                    <select 
                      id="vendor-category-input"
                      className="bg-transparent border-0 text-white w-100 fs-7 outline-none cursor-pointer"
                      style={{ backgroundColor: 'var(--bg-secondary)' }}
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Raw Materials" style={{ backgroundColor: 'var(--bg-secondary)' }}>Raw Materials</option>
                      <option value="IT Solutions" style={{ backgroundColor: 'var(--bg-secondary)' }}>IT Solutions</option>
                      <option value="Office Goods" style={{ backgroundColor: 'var(--bg-secondary)' }}>Office Goods</option>
                      <option value="Heavy Equipment" style={{ backgroundColor: 'var(--bg-secondary)' }}>Heavy Equipment</option>
                      <option value="Logistics" style={{ backgroundColor: 'var(--bg-secondary)' }}>Logistics</option>
                      <option value="Supplies" style={{ backgroundColor: 'var(--bg-secondary)' }}>Supplies</option>
                    </select>
                  </div>
                </div>

                {/* Status Selector */}
                <div className="col-12 col-sm-6">
                  <label className="text-secondary small mb-1 fw-medium" htmlFor="vendor-status-input">Partner Status</label>
                  <div className="form-input-wrapper px-3 py-2 rounded-3">
                    <select 
                      id="vendor-status-input"
                      className="bg-transparent border-0 text-white w-100 fs-7 outline-none cursor-pointer"
                      style={{ backgroundColor: 'var(--bg-secondary)' }}
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="ACTIVE" style={{ backgroundColor: 'var(--bg-secondary)' }}>Active</option>
                      <option value="PENDING" style={{ backgroundColor: 'var(--bg-secondary)' }}>Pending</option>
                      <option value="BLOCKED" style={{ backgroundColor: 'var(--bg-secondary)' }}>Blocked</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
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
                  {modalMode === 'add' ? 'Save Vendor' : 'Update Details'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vendors;
