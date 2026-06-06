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

// Initial listing dataset matching GET /rfqs backend format
const initialRFQs = [
  { id: 1, title: 'Raw Steel Sheet Coils', category: 'Raw Materials', description: 'Grade A coils', deadline: '2026-06-15', submissions: 3, status: 'Active' },
  { id: 2, title: 'Cloud server hardware racks', category: 'IT Solutions', description: 'Power racks', deadline: '2026-06-18', submissions: 1, status: 'Pending Review' },
  { id: 3, title: 'Warehouse Forklifts replacement', category: 'Heavy Equipment', description: 'Dual fork lifts', deadline: '2026-06-25', submissions: 0, status: 'Draft' }
];

// Mock suppliers list with integer IDs matching DB schemas
const mockVendors = [
  { id: 1, name: 'Apex Metals Ltd', category: 'Raw Materials' },
  { id: 2, name: 'NetScale Solutions', category: 'IT Solutions' },
  { id: 3, name: 'Habitat Crafts', category: 'Office Goods' },
  { id: 4, name: 'Titan Heavy Machinery', category: 'Heavy Equipment' },
  { id: 5, name: 'Global Logistics Inc', category: 'Logistics' },
  { id: 6, name: 'Stark Industries', category: 'Raw Materials' }
];

const RFQs = () => {
  const [rfqs, setRfqs] = useState(initialRFQs);
  const [isCreating, setIsCreating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Form State matching API payload fields exactly
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Raw Materials');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [items, setItems] = useState([
    { id: 1, itemName: '', quantity: 1, unit: 'NOS' }
  ]);
  const [selectedVendors, setSelectedVendors] = useState([]); // array of vendor IDs: [1, 2]
  const [attachments, setAttachments] = useState([]);

  // Search Filter state
  const [listFilter, setListFilter] = useState('');

  // Step 2 products list handlers
  const handleAddProductRow = () => {
    setItems([
      ...items,
      { id: Date.now(), itemName: '', quantity: 1, unit: 'NOS' }
    ]);
  };

  const handleRemoveProductRow = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleProductChange = (id, field, value) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  // Vendor Assignment handlers (stores IDs: [1, 2, 3])
  const toggleVendorSelection = (vendorId) => {
    if (selectedVendors.includes(vendorId)) {
      setSelectedVendors(selectedVendors.filter(id => id !== vendorId));
    } else {
      setSelectedVendors([...selectedVendors, vendorId]);
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
    setTitle('');
    setDescription('');
    setCategory('Raw Materials');
    setDeadline('');
    setItems([{ id: 1, itemName: '', quantity: 1, unit: 'NOS' }]);
    setSelectedVendors([]);
    setAttachments([]);
    setCurrentStep(1);
    setIsCreating(false);
  };

  const submitRfq = (status) => {
    // Aligns state back to payload for API readiness
    const payload = {
      title,
      category,
      description,
      deadline,
      vendors: selectedVendors, // array of IDs
      items: items.map(({ itemName, quantity, unit }) => ({ itemName, quantity, unit }))
    };

    console.log('Sending API Payload to Axios Client:', payload);

    const newRfq = {
      id: rfqs.length + 1,
      title: payload.title || 'Untitled Procurement',
      category: payload.category || 'General',
      description: payload.description,
      deadline: payload.deadline || '2026-06-30',
      submissions: 0,
      status: status
    };

    setRfqs([newRfq, ...rfqs]);
    resetForm();
  };

  // Filter list of RFQs
  const filteredRfqs = rfqs.filter(r => 
    r.title.toLowerCase().includes(listFilter.toLowerCase()) ||
    r.category.toLowerCase().includes(listFilter.toLowerCase())
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
                placeholder="Search RFQs by name, code or category..." 
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
                    <th scope="col">Category</th>
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
                        <td className="text-primary fw-medium">RFQ-2026-00{rfq.id}</td>
                        <td className="fw-semibold text-white">{rfq.title}</td>
                        <td>{rfq.category}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <FiCalendar className="text-muted" size={14} />
                            <span className="text-secondary small">{new Date(rfq.deadline).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="text-center text-white fw-bold">{rfq.submissions}</td>
                        <td>
                          <span className={`badge-status ${rfq.status === 'Active' ? 'badge-success' : rfq.status === 'Draft' ? 'badge-info' : 'badge-warning'}`}>
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
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
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
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="Raw Materials" style={{ backgroundColor: 'var(--bg-secondary)' }}>Raw Materials</option>
                        <option value="IT Solutions" style={{ backgroundColor: 'var(--bg-secondary)' }}>IT Solutions</option>
                        <option value="Office Goods" style={{ backgroundColor: 'var(--bg-secondary)' }}>Office Goods</option>
                        <option value="Heavy Equipment" style={{ backgroundColor: 'var(--bg-secondary)' }}>Heavy Equipment</option>
                        <option value="Logistics" style={{ backgroundColor: 'var(--bg-secondary)' }}>Logistics</option>
                        <option value="Construction" style={{ backgroundColor: 'var(--bg-secondary)' }}>Construction</option>
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
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
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
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
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
                      {items.map((item, index) => (
                        <tr key={item.id}>
                          <td>
                            <div className="form-input-wrapper px-3 py-1.5 rounded-3">
                              <input 
                                type="text"
                                required
                                className="bg-transparent border-0 text-white w-100 fs-7 outline-none" 
                                placeholder="e.g. Grade A Steel Sheets (4mm)"
                                value={item.itemName}
                                onChange={(e) => handleProductChange(item.id, 'itemName', e.target.value)}
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
                                placeholder="25"
                                value={item.quantity}
                                onChange={(e) => handleProductChange(item.id, 'quantity', parseInt(e.target.value) || '')}
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
                                <option value="NOS" style={{ backgroundColor: 'var(--bg-secondary)' }}>NOS</option>
                                <option value="KG" style={{ backgroundColor: 'var(--bg-secondary)' }}>KG</option>
                                <option value="TONS" style={{ backgroundColor: 'var(--bg-secondary)' }}>TONS</option>
                                <option value="LTR" style={{ backgroundColor: 'var(--bg-secondary)' }}>LTR</option>
                                <option value="MTR" style={{ backgroundColor: 'var(--bg-secondary)' }}>MTR</option>
                              </select>
                            </div>
                          </td>
                          <td className="text-center">
                            <button 
                              type="button" 
                              className="btn btn-danger btn-sm p-1.5 rounded-circle d-inline-flex bg-opacity-10 border-0"
                              disabled={items.length === 1}
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
                        .filter(v => v.category === category)
                        .map(vendor => (
                          <div 
                            key={vendor.id} 
                            className="vendor-select-item p-2 d-flex align-items-center justify-content-between cursor-pointer rounded"
                            onClick={() => toggleVendorSelection(vendor.id)}
                          >
                            <div className="d-flex align-items-center gap-2.5">
                              <input 
                                type="checkbox" 
                                className="form-check-input bg-secondary border-color cursor-pointer"
                                checked={selectedVendors.includes(vendor.id)}
                                onChange={() => {}} // handled by outer click div
                              />
                              <span className="text-white small fw-medium">{vendor.name}</span>
                            </div>
                            <span className="badge-status badge-info extra-small">{vendor.category}</span>
                          </div>
                        ))}
                      {mockVendors.filter(v => v.category === category).length === 0 && (
                        <div className="text-center p-4 text-secondary small">
                          No vendors matching {category} category.
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
                  disabled={currentStep === 1 && (!title || !deadline || !description)}
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
