import { useState } from 'react';
import { FiPlus, FiSearch, FiSliders, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import './Vendors.css';

const initialVendors = [
  { id: 1, name: 'Apex Metals Ltd', gstNumber: '27AAACA1111A1Z1', category: 'Raw Materials', status: 'ACTIVE' },
  { id: 2, name: 'NetScale Solutions', gstNumber: '27BBBCB2222B2Z2', category: 'IT Solutions', status: 'ACTIVE' },
  { id: 3, name: 'Habitat Crafts', gstNumber: '27CCCC3333C3Z3', category: 'Office Goods', status: 'PENDING' },
  { id: 4, name: 'Titan Heavy Machinery', gstNumber: '27DDDD4444D4Z4', category: 'Heavy Equipment', status: 'ACTIVE' },
  { id: 5, name: 'Global Logistics Inc', gstNumber: '27EEEE5555E5Z5', category: 'Logistics', status: 'BLOCKED' },
  { id: 6, name: 'Stark Industries', gstNumber: '27FFFF6666F6Z6', category: 'Raw Materials', status: 'ACTIVE' },
  { id: 7, name: 'Daily Bugle Media', gstNumber: '27GGGG7777G7Z7', category: 'Marketing', status: 'ACTIVE' },
  { id: 8, name: 'Metropolis Power', gstNumber: '27HHHH8888H8Z8', category: 'Utilities', status: 'ACTIVE' },
  { id: 9, name: 'Gamma Laboratories', gstNumber: '27IIII9999I9Z9', category: 'R&D', status: 'ACTIVE' },
  { id: 10, name: 'Atlantis Marine', gstNumber: '27JJJJ0000J0Z0', category: 'Logistics', status: 'PENDING' },
  { id: 11, name: 'Themyscira Artifacts', gstNumber: '27KKKK1111K1Z1', category: 'Consulting', status: 'ACTIVE' },
  { id: 12, name: 'Central Labs', gstNumber: '27LLLL2222L2Z2', category: 'IT Solutions', status: 'BLOCKED' }
];

const Vendors = () => {
  const [vendors, setVendors] = useState(initialVendors);
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
    name: '',
    gstNumber: '',
    category: 'Raw Materials',
    status: 'ACTIVE'
  });

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
    const matchesSearch = 
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.gstNumber.toLowerCase().includes(searchTerm.toLowerCase());

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
      id: vendors.length + 1,
      name: '',
      gstNumber: '',
      category: 'Raw Materials',
      status: 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (vendor) => {
    setModalMode('edit');
    setFormData({ ...vendor });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to block or delete this vendor?')) {
      // For block/delete simulation, we filter out from list or toggle status
      const updated = vendors.filter(v => v.id !== id);
      setVendors(updated);
      if (currentPage > Math.ceil(updated.length / rowsPerPage) && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (modalMode === 'add') {
      setVendors([{ ...formData, id: vendors.length + 1 }, ...vendors]);
      setIsModalOpen(false);
    } else {
      const updated = vendors.map(v => (v.id === formData.id ? { ...formData } : v));
      setVendors(updated);
      setIsModalOpen(false);
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
                      <td className="fw-semibold text-white">{vendor.name}</td>
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
              <div className="row g-3">
                {/* Vendor Name */}
                <div className="col-12">
                  <label className="text-secondary small mb-1 fw-medium" htmlFor="vendor-name-input">Vendor Partner Name</label>
                  <div className="form-input-wrapper px-3 py-2 rounded-3">
                    <input 
                      id="vendor-name-input"
                      type="text" 
                      required 
                      className="bg-transparent border-0 text-white w-100 fs-7 outline-none" 
                      placeholder="e.g. Apex Metals Ltd"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>

                {/* GST Number */}
                <div className="col-12">
                  <label className="text-secondary small mb-1 fw-medium" htmlFor="vendor-gst-input">GSTIN Number</label>
                  <div className="form-input-wrapper px-3 py-2 rounded-3">
                    <input 
                      id="vendor-gst-input"
                      type="text" 
                      required 
                      pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
                      className="bg-transparent border-0 text-white w-100 fs-7 outline-none font-monospace" 
                      placeholder="e.g. 27AAACA1111A1Z1"
                      value={formData.gstNumber}
                      onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
                    />
                  </div>
                  <span className="text-muted extra-small mt-1 d-inline-block">Format: 15-digit Alpha-Numeric GSTIN</span>
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
                      <option value="Construction" style={{ backgroundColor: 'var(--bg-secondary)' }}>Construction</option>
                      <option value="Consulting" style={{ backgroundColor: 'var(--bg-secondary)' }}>Consulting</option>
                      <option value="R&D" style={{ backgroundColor: 'var(--bg-secondary)' }}>R&D</option>
                      <option value="Marketing" style={{ backgroundColor: 'var(--bg-secondary)' }}>Marketing</option>
                      <option value="Utilities" style={{ backgroundColor: 'var(--bg-secondary)' }}>Utilities</option>
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
