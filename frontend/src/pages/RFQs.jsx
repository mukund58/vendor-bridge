import { useState } from 'react';
import { 
  FiPlus, 
  FiTrash2, 
  FiArrowRight, 
  FiArrowLeft, 
  FiUploadCloud, 
  FiPaperclip, 
  FiCheck, 
  FiX, 
  FiFilter, 
  FiCalendar,
  FiFileText
} from 'react-icons/fi';
import './RFQs.css';

const initialRFQs = [
  { id: 'RFQ-2026-0041', title: 'Raw Steel Sheet Coils', department: 'Operations', deadline: '2026-06-15', submissions: 3, status: 'Active', badge: 'badge-success' },
  { id: 'RFQ-2026-0040', title: 'Cloud server hardware racks', department: 'IT Infrastructure', deadline: '2026-06-18', submissions: 1, status: 'Pending Review', badge: 'badge-warning' },
  { id: 'RFQ-2026-0039', title: 'Warehouse Forklifts replacement', department: 'Facilities', deadline: '2026-06-25', submissions: 0, status: 'Draft', badge: 'badge-info' },
];

const mockVendors = [
  { id: 'VND-001', name: 'Apex Metals Ltd', category: 'Raw Materials' },
  { id: 'VND-002', name: 'NetScale Solutions', category: 'IT Solutions' },
  { id: 'VND-003', name: 'Habitat Crafts', category: 'Office Goods' },
  { id: 'VND-004', name: 'Titan Heavy Machinery', category: 'Heavy Equipment' },
  { id: 'VND-005', name: 'Global Logistics Inc', category: 'Logistics' },
  { id: 'VND-006', name: 'Stark Industries', category: 'Raw Materials' }
];

const RFQs = () => {
  const [rfqs, setRfqs] = useState(initialRFQs);
  const [isCreating, setIsCreating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [rfqTitle, setRfqTitle] = useState('');
  const [rfqDesc, setRfqDesc] = useState('');
  const [rfqCategory, setRfqCategory] = useState('Raw Materials');
  const [rfqDeadline, setRfqDeadline] = useState('');
  const [products, setProducts] = useState([
    { id: 1, name: '', qty: 1, unit: 'Units' }
  ]);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [attachments, setAttachments] = useState([]);

  // Filter List state
  const [listFilter, setListFilter] = useState('');

  // Step 2 products list handlers
  const handleAddProductRow = () => {
    setProducts([
      ...products,
      { id: Date.now(), name: '', qty: 1, unit: 'Units' }
    ]);
  };

  const handleRemoveProductRow = (id) => {
    if (products.length > 1) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleProductChange = (id, field, value) => {
    setProducts(products.map(p => {
      if (p.id === id) {
        return { ...p, [field]: value };
      }
      return p;
    }));
  };

  // Vendor Assignment handlers
  const toggleVendorSelection = (vendorName) => {
    if (selectedVendors.includes(vendorName)) {
      setSelectedVendors(selectedVendors.filter(v => v !== vendorName));
    } else {
      setSelectedVendors([...selectedVendors, vendorName]);
    }
  };

  // Attachment upload simulation
  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files).map(file => ({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB'
      }));
      setAttachments([...attachments, ...filesArray]);
    }
  };

  const addMockFile = () => {
    setAttachments([
      ...attachments,
      { name: 'material_specifications_v2.pdf', size: '425.2 KB' }
    ]);
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  // Stepper flows
  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetForm = () => {
    setRfqTitle('');
    setRfqDesc('');
    setRfqCategory('Raw Materials');
    setRfqDeadline('');
    setProducts([{ id: 1, name: '', qty: 1, unit: 'Units' }]);
    setSelectedVendors([]);
    setAttachments([]);
    setCurrentStep(1);
    setIsCreating(false);
  };

  const submitRfq = (status) => {
    const badgeMap = {
      'Active': 'badge-success',
      'Draft': 'badge-info',
      'Pending Review': 'badge-warning'
    };

    const newRfq = {
      id: `RFQ-2026-00${rfqs.length + 39}`,
      title: rfqTitle || 'Untitled Procurement',
      department: rfqCategory || 'General',
      deadline: rfqDeadline || '2026-06-30',
      submissions: 0,
      status: status,
      badge: badgeMap[status] || 'badge-info'
    };

    setRfqs([newRfq, ...rfqs]);
    resetForm();
  };

  // Filter list of RFQs
  const filteredRfqs = rfqs.filter(r => 
    r.title.toLowerCase().includes(listFilter.toLowerCase()) ||
    r.id.toLowerCase().includes(listFilter.toLowerCase()) ||
    r.department.toLowerCase().includes(listFilter.toLowerCase())
  );

  return (
    <div className="d-flex flex-column gap-4">
      {/* Title Header */}
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h1 className="h3 mb-1 text-white fw-bold">Request for Quotations (RFQs)</h1>
          <p className="text-secondary small">
            {isCreating ? 'Draft and publish technical specifications to suppliers.' : 'Invite vendor bids, audit compliance profiles, and review pricing.'}
          </p>
        </div>
        {!isCreating && (
          <button 
            type="button" 
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={() => setIsCreating(true)}
          >
            <FiPlus /> New RFQ
          </button>
        )}
      </div>

      {/* Main Container Switch */}
      {!isCreating ? (
        /* ================= LIST VIEW ================= */
        <div className="d-flex flex-column gap-4">
          {/* Filtering bar */}
          <div className="card p-3">
            <div className="d-flex align-items-center bg-secondary px-3 py-1.5 rounded-3 border border-light" style={{ maxWidth: '400px' }}>
              <FiFilter className="text-muted me-2" size={16} />
              <input 
                type="text" 
                className="bg-transparent border-0 text-white w-100 fs-7 outline-none" 
                placeholder="Search RFQs by name, code or department..." 
                value={listFilter}
                onChange={(e) => setListFilter(e.target.value)}
              />
            </div>
          </div>

          {/* List Table Card */}
          <div className="card p-4">
            <div className="table-responsive border-0">
              <table className="table custom-table text-nowrap align-middle">
                <thead>
                  <tr>
                    <th scope="col">RFQ Reference</th>
                    <th scope="col">RFQ Title</th>
                    <th scope="col">Department</th>
                    <th scope="col">Response Deadline</th>
                    <th scope="col" className="text-center">Submissions</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRfqs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-5 text-secondary">
                        No RFQ templates match search query.
                      </td>
                    </tr>
                  ) : (
                    filteredRfqs.map((rfq) => (
                      <tr key={rfq.id}>
                        <td className="text-primary fw-medium">{rfq.id}</td>
                        <td className="fw-semibold text-white">{rfq.title}</td>
                        <td>{rfq.department}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <FiCalendar className="text-muted" size={14} />
                            <span className="text-secondary small">{rfq.deadline}</span>
                          </div>
                        </td>
                        <td className="text-center text-white fw-bold">{rfq.submissions}</td>
                        <td>
                          <span className={`badge-status ${rfq.badge}`}>
                            {rfq.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* ================= MULTI-STEP CREATION VIEW ================= */
        <div className="card p-4 p-md-5">
          {/* Form Cancel header */}
          <div className="d-flex justify-content-between align-items-center mb-4.5 pb-2.5 border-bottom border-light">
            <h5 className="text-white fw-bold m-0 d-flex align-items-center gap-2">
              <FiFileText className="text-primary" /> Create Request for Quotation
            </h5>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm p-1 px-2.5 d-flex align-items-center gap-1.5"
              onClick={resetForm}
            >
              <FiX /> Cancel
            </button>
          </div>

          {/* Stepper Progress component */}
          <div className="stepper-wrapper">
            <div className={`step-item ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
              <div className="step-indicator">
                {currentStep > 1 ? <FiCheck /> : '1'}
              </div>
              <span className="step-label">RFQ Details</span>
            </div>
            <div className={`step-item ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
              <div className="step-indicator">
                {currentStep > 2 ? <FiCheck /> : '2'}
              </div>
              <span className="step-label">Products Table</span>
            </div>
            <div className={`step-item ${currentStep === 3 ? 'active' : ''}`}>
              <div className="step-indicator">3</div>
              <span className="step-label">Assignment & Attach</span>
            </div>
          </div>

          {/* Stepper Wizard Panels */}
          <div className="wizard-panels-content mt-4.5 py-2.5">
            
            {/* STEP 1: RFQ Details Form */}
            {currentStep === 1 && (
              <div className="d-flex flex-column gap-3.5 animation-fade">
                <div className="row g-4">
                  {/* RFQ Title */}
                  <div className="col-12">
                    <label className="text-secondary small mb-1.5 fw-medium" htmlFor="rfq-title">RFQ Title / Subject</label>
                    <div className="form-input-wrapper px-3 py-2 rounded-3">
                      <input 
                        id="rfq-title"
                        type="text" 
                        required
                        className="bg-transparent border-0 text-white w-100 fs-7 outline-none" 
                        placeholder="e.g. Annual Steel Procurement Q3"
                        value={rfqTitle}
                        onChange={(e) => setRfqTitle(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Category Selection */}
                  <div className="col-12 col-md-6">
                    <label className="text-secondary small mb-1.5 fw-medium" htmlFor="rfq-category">Category Sector</label>
                    <div className="form-input-wrapper px-3 py-2 rounded-3">
                      <select 
                        id="rfq-category"
                        className="bg-transparent border-0 text-white w-100 fs-7 outline-none cursor-pointer"
                        style={{ backgroundColor: 'var(--bg-secondary)' }}
                        value={rfqCategory}
                        onChange={(e) => setRfqCategory(e.target.value)}
                      >
                        <option value="Raw Materials" style={{ backgroundColor: 'var(--bg-secondary)' }}>Raw Materials</option>
                        <option value="IT Solutions" style={{ backgroundColor: 'var(--bg-secondary)' }}>IT Solutions</option>
                        <option value="Office Goods" style={{ backgroundColor: 'var(--bg-secondary)' }}>Office Goods</option>
                        <option value="Heavy Equipment" style={{ backgroundColor: 'var(--bg-secondary)' }}>Heavy Equipment</option>
                        <option value="Logistics" style={{ backgroundColor: 'var(--bg-secondary)' }}>Logistics</option>
                      </select>
                    </div>
                  </div>

                  {/* Response Deadline */}
                  <div className="col-12 col-md-6">
                    <label className="text-secondary small mb-1.5 fw-medium" htmlFor="rfq-deadline">Bidding Deadline Date</label>
                    <div className="form-input-wrapper px-3 py-2 rounded-3">
                      <input 
                        id="rfq-deadline"
                        type="date" 
                        required
                        className="bg-transparent border-0 text-white w-100 fs-7 outline-none cursor-pointer" 
                        value={rfqDeadline}
                        onChange={(e) => setRfqDeadline(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="col-12">
                    <label className="text-secondary small mb-1.5 fw-medium" htmlFor="rfq-desc">Detailed Description & Specifications</label>
                    <div className="form-input-wrapper px-3 py-2 rounded-3">
                      <textarea 
                        id="rfq-desc"
                        rows={5}
                        required
                        className="bg-transparent border-0 text-white w-100 fs-7 outline-none" 
                        placeholder="Provide detailed material qualities, delivery parameters, and structural expectations..."
                        value={rfqDesc}
                        onChange={(e) => setRfqDesc(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Products Line Items */}
            {currentStep === 2 && (
              <div className="d-flex flex-column gap-4 animation-fade">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="text-white fw-bold m-0 fs-6">Material Line Items</h6>
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-sm d-flex align-items-center gap-1.5"
                    onClick={handleAddProductRow}
                  >
                    <FiPlus /> Add Line Item
                  </button>
                </div>

                <div className="table-responsive border-0">
                  <table className="table custom-table align-middle">
                    <thead>
                      <tr>
                        <th scope="col" style={{ width: '60%' }}>Item Name / Spec</th>
                        <th scope="col" style={{ width: '20%' }}>Quantity</th>
                        <th scope="col" style={{ width: '15%' }}>Unit</th>
                        <th scope="col" style={{ width: '5%' }} className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((item, index) => (
                        <tr key={item.id}>
                          <td>
                            <div className="form-input-wrapper px-3 py-1.5 rounded-3">
                              <input 
                                type="text"
                                required
                                className="bg-transparent border-0 text-white w-100 fs-7 outline-none" 
                                placeholder="e.g. Grade A Steel Sheets (4mm)"
                                value={item.name}
                                onChange={(e) => handleProductChange(item.id, 'name', e.target.value)}
                                aria-label={`Item ${index + 1} Name`}
                              />
                            </div>
                          </td>
                          <td>
                            <div className="form-input-wrapper px-3 py-1.5 rounded-3">
                              <input 
                                type="number" 
                                min={1}
                                required
                                className="bg-transparent border-0 text-white w-100 fs-7 outline-none" 
                                placeholder="100"
                                value={item.qty}
                                onChange={(e) => handleProductChange(item.id, 'qty', parseInt(e.target.value) || '')}
                                aria-label={`Item ${index + 1} Quantity`}
                              />
                            </div>
                          </td>
                          <td>
                            <div className="form-input-wrapper px-2 py-1.5 rounded-3">
                              <select 
                                className="bg-transparent border-0 text-white w-100 fs-7 outline-none cursor-pointer"
                                style={{ backgroundColor: 'var(--bg-secondary)' }}
                                value={item.unit}
                                onChange={(e) => handleProductChange(item.id, 'unit', e.target.value)}
                                aria-label={`Item ${index + 1} Unit`}
                              >
                                <option value="Units" style={{ backgroundColor: 'var(--bg-secondary)' }}>Units</option>
                                <option value="kg" style={{ backgroundColor: 'var(--bg-secondary)' }}>kg</option>
                                <option value="Tons" style={{ backgroundColor: 'var(--bg-secondary)' }}>Tons</option>
                                <option value="Liters" style={{ backgroundColor: 'var(--bg-secondary)' }}>Liters</option>
                                <option value="Meters" style={{ backgroundColor: 'var(--bg-secondary)' }}>Meters</option>
                              </select>
                            </div>
                          </td>
                          <td className="text-center">
                            <button 
                              type="button" 
                              className="btn btn-danger btn-sm p-1.5 rounded-circle d-inline-flex bg-opacity-10 border-0"
                              disabled={products.length === 1}
                              onClick={() => handleRemoveProductRow(item.id)}
                              title="Delete Item Row"
                              style={{ color: 'var(--danger)', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                            >
                              <FiTrash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* STEP 3: Vendor Assignment & Attachments */}
            {currentStep === 3 && (
              <div className="row g-4 animation-fade">
                {/* Left col: Vendor Assignment */}
                <div className="col-12 col-md-6">
                  <div className="d-flex flex-column gap-2">
                    <label className="text-secondary small fw-medium">Supplier Assignment</label>
                    <span className="text-muted extra-small">Select partners matching this category to dispatch notifications</span>
                    
                    <div className="vendor-select-list rounded-3 p-2 d-flex flex-column gap-1.5 mt-2">
                      {mockVendors
                        .filter(v => v.category === rfqCategory || rfqCategory === 'General')
                        .map(vendor => (
                          <div 
                            key={vendor.id} 
                            className="vendor-select-item p-2 d-flex align-items-center justify-content-between cursor-pointer rounded"
                            onClick={() => toggleVendorSelection(vendor.name)}
                          >
                            <div className="d-flex align-items-center gap-2.5">
                              <input 
                                type="checkbox" 
                                className="form-check-input bg-secondary border-color cursor-pointer"
                                checked={selectedVendors.includes(vendor.name)}
                                onChange={() => {}} // handled by outer click div
                              />
                              <span className="text-white small fw-medium">{vendor.name}</span>
                            </div>
                            <span className="badge-status badge-info extra-small">{vendor.category}</span>
                          </div>
                        ))}
                      {mockVendors.filter(v => v.category === rfqCategory).length === 0 && (
                        <div className="text-center p-4 text-secondary small">
                          No vendors matching {rfqCategory} category.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right col: Attachments dropzone */}
                <div className="col-12 col-md-6">
                  <div className="d-flex flex-column gap-2">
                    <label className="text-secondary small fw-medium">Upload Documents</label>
                    <span className="text-muted extra-small">Attach design blueprints, spec PDFs, or QA sheets (max 10MB)</span>
                    
                    {/* Simulated Dropzone */}
                    <div className="file-dropzone mt-2 d-flex flex-column align-items-center justify-content-center" onClick={addMockFile}>
                      <FiUploadCloud className="text-primary mb-2" size={32} />
                      <span className="text-white small fw-semibold">Click to browse or drop files here</span>
                      <span className="text-muted extra-small mt-1">Simulates file attachments</span>
                      <input 
                        type="file" 
                        multiple 
                        className="d-none" 
                        onChange={handleFileUpload} 
                      />
                    </div>

                    {/* Attachment List */}
                    {attachments.length > 0 && (
                      <div className="d-flex flex-column gap-2 mt-3">
                        <span className="text-secondary extra-small fw-bold uppercase">Attached Files ({attachments.length})</span>
                        {attachments.map((file, index) => (
                          <div key={index} className="d-flex align-items-center justify-content-between p-2 rounded bg-secondary border border-light">
                            <div className="d-flex align-items-center gap-2">
                              <FiPaperclip className="text-primary" size={14} />
                              <span className="text-white small text-truncate" style={{ maxWidth: '180px' }}>{file.name}</span>
                              <span className="text-muted extra-small">({file.size})</span>
                            </div>
                            <button 
                              type="button" 
                              className="btn border-0 p-0 text-danger"
                              onClick={() => removeAttachment(index)}
                              title="Remove File"
                            >
                              <FiX size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Stepper Navigation Footer buttons */}
          <div className="d-flex justify-content-between align-items-center mt-5 pt-3.5 border-top border-light">
            <button 
              type="button" 
              className="btn btn-secondary btn-sm d-flex align-items-center gap-1.5"
              onClick={handleBackStep}
              disabled={currentStep === 1}
            >
              <FiArrowLeft /> Back
            </button>

            <div className="d-flex gap-2">
              {currentStep < 3 ? (
                <button 
                  type="button" 
                  className="btn btn-primary btn-sm d-flex align-items-center gap-1.5"
                  onClick={handleNextStep}
                  disabled={currentStep === 1 && (!rfqTitle || !rfqDeadline || !rfqDesc)}
                >
                  Next <FiArrowRight />
                </button>
              ) : (
                <>
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-sm px-3"
                    onClick={() => submitRfq('Draft')}
                  >
                    Save Draft
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary btn-sm px-4 fw-medium d-flex align-items-center gap-1.5"
                    onClick={() => submitRfq('Active')}
                  >
                    <FiCheck /> Publish RFQ
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RFQs;
