import { useState, useEffect } from 'react';
import { 
  FiFileText, 
  FiDollarSign, 
  FiTruck, 
  FiCheckCircle, 
  FiGrid, 
  FiSend,
  FiInfo
} from 'react-icons/fi';
import { fetchRFQs } from '../services/rfqService';
import { submitQuotation } from '../services/quotationService';
import './QuotationSubmission.css';

const QuotationSubmission = () => {
  const [rfqs, setRfqs] = useState([]);
  const [selectedRfqId, setSelectedRfqId] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Bid Form state
  const [deliveryDays, setDeliveryDays] = useState(10);
  const [gstRate, setGstRate] = useState(18); // default GST rate in %
  const [bidRemarks, setBidRemarks] = useState('');
  
  // Material pricing items state
  const [bidItems, setBidItems] = useState([]);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadRFQs = async () => {
      try {
        const list = await fetchRFQs();
        const activeRfqs = list.filter(r => r.status === 'Active' || r.status === 'Published');
        setRfqs(activeRfqs);
        if (activeRfqs.length > 0) {
          const initialId = activeRfqs[0].id;
          setSelectedRfqId(initialId);
          const items = activeRfqs[0].items || [];
          setBidItems(items.map(item => ({
            itemId: item.id,
            name: item.itemName,
            quantity: item.quantity,
            unit: item.unit,
            unitPrice: ''
          })));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadRFQs();
  }, []);

  const activeRfq = rfqs.find(r => r.id === selectedRfqId);

  const handlePriceChange = (index, value) => {
    const updated = [...bidItems];
    updated[index].unitPrice = value === '' ? '' : parseFloat(value) || 0;
    setBidItems(updated);
  };

  const calculateSubtotal = () => {
    return bidItems.reduce((acc, item) => acc + ((item.unitPrice || 0) * item.quantity), 0);
  };

  const subtotal = calculateSubtotal();
  const taxAmount = Math.round(subtotal * (gstRate / 100));
  const totalAmount = subtotal + taxAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate that all items have price
    if (bidItems.some(item => item.unitPrice === '')) {
      triggerToast('⚠️ Please fill out prices for all line items before submitting.');
      return;
    }

    if (deliveryDays < 1 || deliveryDays > 365) {
      triggerToast('⚠️ Delivery days must be between 1 and 365.');
      return;
    }

    if (gstRate < 0 || gstRate > 100) {
      triggerToast('⚠️ GST rate must be between 0% and 100%.');
      return;
    }

    if (!selectedRfqId) {
      triggerToast('⚠️ Please select an RFQ to bid on.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      rfqId: selectedRfqId,
      gstPercentage: parseFloat(gstRate),
      notes: bidRemarks,
      items: bidItems.map(item => ({
        itemId: item.itemId,
        unitPrice: parseFloat(item.unitPrice),
        deliveryDays: parseInt(deliveryDays)
      }))
    };

    try {
      await submitQuotation(selectedRfqId, payload);
      triggerToast('✅ Bidding Quotation submitted successfully!');
      
      // Reset input fields
      setDeliveryDays(10);
      setGstRate(18);
      setBidRemarks('');
      setBidItems(prev => prev.map(item => ({ ...item, unitPrice: '' })));
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit quotation.';
      triggerToast(`⚠️ ${msg}`);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading RFQs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-4">
      {/* Title Header */}
      <div>
        <h1 className="h3 mb-1 text-white fw-bold">Quotation Submission</h1>
        <p className="text-secondary small">Submit technical material specs, pricing bids, and delivery timelines for open RFQs.</p>
      </div>

      <div className="row g-4">
        {/* Left column: Selection of RFQ & details review */}
        <div className="col-12 col-lg-5 d-flex flex-column gap-4">
          
          {/* RFQ Scope card */}
          <div className="card p-4">
            <h5 className="text-white mb-3 fw-semibold d-flex align-items-center gap-2 fs-6">
              <FiGrid className="text-primary" /> Select Tender RFQ
            </h5>
            
            <div className="form-group mb-0">
              <label className="text-secondary small mb-1.5 fw-medium" htmlFor="rfq-select">Active RFQs Roster</label>
              <div className="input-group-custom d-flex align-items-center px-3 py-2 rounded-3 border border-light bg-secondary">
                <FiFileText className="text-muted me-2.5" size={16} />
                <select
                  id="rfq-select"
                  className="bg-transparent border-0 text-white w-100 fs-7 outline-none cursor-pointer"
                  value={selectedRfqId}
                  onChange={(e) => {
                    const rfqId = parseInt(e.target.value);
                    setSelectedRfqId(rfqId);
                    const selected = rfqs.find(r => r.id === rfqId);
                    const items = selected?.items || [];
                    setBidItems(items.map(item => ({
                      itemId: item.id,
                      name: item.itemName,
                      quantity: item.quantity,
                      unit: item.unit,
                      unitPrice: ''
                    })));
                  }}
                >
                  {rfqs.map(rfq => (
                    <option key={rfq.id} value={rfq.id} style={{ backgroundColor: 'var(--bg-secondary)' }}>
                      RFQ-00{rfq.id}: {rfq.title}
                    </option>
                  ))}
                  {rfqs.length === 0 && (
                    <option value="" disabled>No active RFQs available</option>
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* Selected RFQ specifications details */}
          {activeRfq && (
            <div className="card p-4">
              <div className="d-flex justify-content-between align-items-start border-bottom border-light pb-2.5 mb-3">
                <div>
                  <h6 className="text-white fw-bold mb-1 fs-6">{activeRfq.title}</h6>
                  <span className="text-muted extra-small">RFQ Ref: RFQ-2026-00{activeRfq.id}</span>
                </div>
                <span className="badge-status badge-success rfq-info-badge">{activeRfq.category}</span>
              </div>

              <div className="d-flex flex-column gap-3">
                <div>
                  <span className="text-muted extra-small d-block mb-1">Specifications Description</span>
                  <p className="text-secondary small mb-0">{activeRfq.description}</p>
                </div>

                <div className="p-3 bg-secondary rounded border border-light d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <FiInfo className="text-warning" size={16} />
                    <span className="text-white small fw-medium">Submission Deadline</span>
                  </div>
                  <span className="text-warning small fw-bold">{new Date(activeRfq.deadline).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right column: Line Item pricing & submit form */}
        <div className="col-12 col-lg-7">
          <div className="card p-4">
            <h5 className="text-white mb-4 fw-semibold d-flex align-items-center gap-2 fs-6">
              <FiDollarSign className="text-primary" /> Bidding Details & Cost Matrix
            </h5>

            <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
              
              {/* Product Pricing Lines list */}
              <div className="d-flex flex-column gap-3">
                <span className="text-secondary extra-small fw-bold uppercase tracking-wider">Line Item Specifications</span>
                
                {bidItems.map((item, idx) => (
                  <div key={idx} className="p-3 bg-secondary rounded border border-light d-flex flex-column gap-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <span className="text-white small fw-semibold d-block">{item.name}</span>
                        <span className="text-muted extra-small">Quantity Requested: {item.quantity} {item.unit}</span>
                      </div>
                      <span className="badge bg-opacity-10 text-primary bg-primary extra-small py-1 px-2 rounded">
                        Item {idx + 1}
                      </span>
                    </div>

                    <div className="form-group mb-0" style={{ maxWidth: '240px' }}>
                      <label className="text-secondary small mb-1 fw-medium">Bidding Unit Price ($)</label>
                      <div className="input-group-custom d-flex align-items-center px-3 py-1.5 rounded-3 border border-light bg-dark">
                        <FiDollarSign className="text-muted me-1.5" size={14} />
                        <input 
                          type="number"
                          required
                          min={1}
                          className="bg-transparent border-0 text-white w-100 fs-7 outline-none"
                          placeholder="0.00"
                          value={item.unitPrice}
                          onChange={(e) => handlePriceChange(idx, e.target.value)}
                          aria-label={`Item ${idx + 1} Bidding Unit Price`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Speed & Tax Rates */}
              <div className="row g-3">
                <div className="col-12 col-sm-6">
                  <label className="text-secondary small mb-1.5 fw-medium" htmlFor="delivery-days">Delivery Timeframe (Days)</label>
                  <div className="input-group-custom d-flex align-items-center px-3 py-2 rounded-3 border border-light bg-secondary">
                    <FiTruck className="text-muted me-2.5" size={16} />
                    <input 
                      id="delivery-days"
                      type="number"
                      required
                      min={1}
                      className="bg-transparent border-0 text-white w-100 fs-7 outline-none"
                      placeholder="10"
                      value={deliveryDays}
                      onChange={(e) => setDeliveryDays(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <label className="text-secondary small mb-1.5 fw-medium" htmlFor="gst-rate">Tax Rate / GST (%)</label>
                  <div className="input-group-custom d-flex align-items-center px-3 py-2 rounded-3 border border-light bg-secondary">
                    <FiFileText className="text-muted me-2.5" size={16} />
                    <input 
                      id="gst-rate"
                      type="number"
                      required
                      min={0}
                      max={100}
                      className="bg-transparent border-0 text-white w-100 fs-7 outline-none"
                      placeholder="18"
                      value={gstRate}
                      onChange={(e) => setGstRate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Remarks/Notes */}
              <div className="form-group">
                <label className="text-secondary small mb-1.5 fw-medium" htmlFor="bid-remarks">Bidding Remarks & Compliance Comments</label>
                <div className="input-group-custom d-flex align-items-start px-3 py-2 rounded-3 border border-light bg-secondary">
                  <textarea 
                    id="bid-remarks"
                    rows={3}
                    className="form-control bg-transparent border-0 text-white fs-7 outline-none w-100 p-0"
                    placeholder="Enter compliance details, custom warranties, or quality details..."
                    value={bidRemarks}
                    onChange={(e) => setBidRemarks(e.target.value)}
                  />
                </div>
              </div>

              {/* Invoice subtotal calculations display */}
              <div className="p-3 bg-secondary rounded border border-light d-flex flex-column gap-2">
                <div className="d-flex justify-content-between align-items-center extra-small text-secondary">
                  <span>Subtotal Value:</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center extra-small text-secondary">
                  <span>GST Amount ({gstRate}%):</span>
                  <span>${taxAmount.toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center small text-white fw-bold pt-2 border-top border-light">
                  <span>Total Bid Value:</span>
                  <span>${totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Submit button */}
              <button 
                type="submit" 
                disabled={isSubmitting || totalAmount === 0}
                className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2 py-2.5 fw-semibold"
              >
                {isSubmitting ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                ) : (
                  <FiSend />
                )}
                Submit Quotation Bid
              </button>

            </form>
          </div>
        </div>
      </div>

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

export default QuotationSubmission;
