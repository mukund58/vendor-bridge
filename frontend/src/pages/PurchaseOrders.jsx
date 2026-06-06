import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiPlus, 
  FiX, 
  FiChevronRight, 
  FiCheckCircle, 
  FiTruck, 
  FiClock, 
  FiAlertCircle 
} from 'react-icons/fi';
import './PurchaseOrders.css';

const initialPOs = [
  { id: 1, po_number: 'PO-2026-1029', quotation_id: 103, vendor_name: 'Stark Industries', status: 'IN_TRANSIT', created_at: '2026-06-05T10:00:00Z', amount: 39500 },
  { id: 2, po_number: 'PO-2026-1028', quotation_id: 102, vendor_name: 'Titan Heavy Machinery', status: 'DELIVERED', created_at: '2026-05-30T14:15:00Z', amount: 115000 },
  { id: 3, po_number: 'PO-2026-1027', quotation_id: 201, vendor_name: 'NetScale Solutions', status: 'ACKNOWLEDGED', created_at: '2026-05-28T09:30:00Z', amount: 18900 }
];

const mockQuotations = [
  { quotationId: 101, vendor: 'Apex Metals Ltd', amount: 42500, rfq: 'RFQ-0041' },
  { quotationId: 102, vendor: 'Titan Heavy Machinery', amount: 45000, rfq: 'RFQ-0041' },
  { quotationId: 202, vendor: 'Barry Labs', amount: 19500, rfq: 'RFQ-0040' }
];

const PurchaseOrders = () => {
  const [pos, setPos] = useState(initialPOs);
  const [selectedPoId, setSelectedPoId] = useState(1);
  const navigate = useNavigate();

  // Modal states
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [selectedQuoteId, setSelectedQuoteId] = useState('');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const activePo = pos.find(p => p.id === selectedPoId) || pos[0];

  // Helper status color mapping
  const getStatusMeta = (status) => {
    switch (status) {
      case 'DELIVERED':
        return { badge: 'po-status-delivered', label: 'Delivered', icon: FiCheckCircle };
      case 'IN_TRANSIT':
        return { badge: 'po-status-acknowledged', label: 'In Transit', icon: FiTruck };
      case 'ACKNOWLEDGED':
        return { badge: 'po-status-pending', label: 'Acknowledged', icon: FiClock };
      default:
        return { badge: 'badge-secondary', label: status, icon: FiAlertCircle };
    }
  };

  // Generate PO simulation (POST /purchase-orders)
  const handleGeneratePO = (e) => {
    e.preventDefault();
    if (!selectedQuoteId) return;

    const chosenQuote = mockQuotations.find(q => q.quotationId === parseInt(selectedQuoteId));
    const payload = {
      quotationId: parseInt(selectedQuoteId)
    };

    console.log('Axios POST /purchase-orders payload:', payload);

    const newPO = {
      id: pos.length + 1,
      po_number: `PO-2026-10${30 + pos.length}`,
      quotation_id: payload.quotationId,
      vendor_name: chosenQuote ? chosenQuote.vendor : 'Unknown Supplier',
      status: 'ACKNOWLEDGED',
      created_at: new Date().toISOString(),
      amount: chosenQuote ? chosenQuote.amount : 0
    };

    setPos([newPO, ...pos]);
    setIsGenerateOpen(false);
    setSelectedQuoteId('');
  };

  // Generate Invoice simulation (POST /invoices)
  const handleGenerateInvoice = (po) => {
    const payload = {
      purchaseOrderId: po.id
    };
    
    console.log('Axios POST /invoices payload:', payload);
    
    // Simulate navigation to invoice page passing generated invoice data or simply redirecting
    alert(`Invoice simulation request generated for ${po.po_number}. Redirecting to Invoices...`);
    navigate('/invoices');
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Title Header */}
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h1 className="h3 mb-1 text-white fw-bold">Purchase Orders</h1>
          <p className="text-secondary small">Review authorized purchase agreements and trigger supplier shipments.</p>
        </div>
        <button 
          type="button" 
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => setIsGenerateOpen(true)}
        >
          <FiPlus /> Generate PO
        </button>
      </div>

      {/* Main Grid split */}
      <div className="row g-4">
        {/* Left Col: PO list */}
        <div className="col-12 col-xl-8">
          <div className="card p-4">
            <h5 className="text-white mb-3.5 fw-semibold fs-6">Dispatched Purchase Orders</h5>
            
            <div className="table-responsive border-0">
              <table className="table custom-table text-nowrap align-middle">
                <thead>
                  <tr>
                    <th scope="col">PO Number</th>
                    <th scope="col">Vendor</th>
                    <th scope="col">Quotation ID</th>
                    <th scope="col">Status</th>
                    <th scope="col">Created Date</th>
                    <th scope="col" className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pos.map((po) => {
                    const isSelected = po.id === selectedPoId;
                    const statusMeta = getStatusMeta(po.status);
                    return (
                      <tr 
                        key={po.id}
                        className={`cursor-pointer ${isSelected ? 'highlight-lowest' : ''}`}
                        onClick={() => setSelectedPoId(po.id)}
                      >
                        <td className="text-primary fw-medium">{po.po_number}</td>
                        <td className="fw-semibold text-white">{po.vendor_name}</td>
                        <td className="small text-secondary">QTN-{po.quotation_id}</td>
                        <td>
                          <span className={`po-badge-status ${statusMeta.badge}`}>
                            {statusMeta.label}
                          </span>
                        </td>
                        <td className="text-secondary small">{new Date(po.created_at).toLocaleDateString()}</td>
                        <td className="text-end" onClick={(e) => e.stopPropagation()}>
                          <div className="d-inline-flex gap-2">
                            <button 
                              type="button" 
                              className="btn btn-secondary btn-sm"
                              onClick={() => {
                                setSelectedPoId(po.id);
                                setIsDetailsOpen(true);
                              }}
                            >
                              View Details
                            </button>
                            <button 
                              type="button" 
                              className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                              onClick={() => handleGenerateInvoice(po)}
                            >
                              Invoice <FiChevronRight />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Quick PO specs preview */}
        <div className="col-12 col-xl-4">
          <div className="card p-4">
            <div className="border-bottom border-light pb-2.5 mb-3">
              <span className="text-primary extra-small fw-semibold uppercase tracking-wider">Purchase Summary</span>
              <h5 className="text-white fw-bold mb-0 mt-0.5">{activePo.po_number}</h5>
            </div>

            <div className="d-flex flex-column gap-3.5">
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-secondary small">Vendor Partner:</span>
                <span className="text-white fw-medium small">{activePo.vendor_name}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-secondary small">Linked Quotation:</span>
                <span className="text-white small">QTN-{activePo.quotation_id}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-secondary small">Created Date:</span>
                <span className="text-white small">{new Date(activePo.created_at).toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-secondary small">Billed Cost:</span>
                <span className="text-success fw-bold">${activePo.amount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Dialog Modal */}
      {isDetailsOpen && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content card p-4 glass border border-light" style={{ width: '450px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3.5 pb-2.5 border-bottom border-light">
              <h5 className="text-white fw-bold m-0">Purchase Order Details</h5>
              <button 
                type="button" 
                className="btn border-0 p-0 text-white text-muted-hover"
                onClick={() => setIsDetailsOpen(false)}
                aria-label="Close modal"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="d-flex flex-column gap-3">
              <div className="row g-3 py-2">
                <div className="col-6">
                  <span className="text-muted extra-small uppercase">PO Number</span>
                  <div className="text-white small fw-bold mt-0.5">{activePo.po_number}</div>
                </div>
                <div className="col-6">
                  <span className="text-muted extra-small uppercase">Linked Quotation</span>
                  <div className="text-white small fw-bold mt-0.5">QTN-{activePo.quotation_id}</div>
                </div>
              </div>

              <div className="p-3 rounded-3" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-secondary small">Vendor:</span>
                  <span className="text-white fw-medium small">{activePo.vendor_name}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-secondary small">Date Dispatched:</span>
                  <span className="text-white small">{new Date(activePo.created_at).toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-secondary small">Transaction Amount:</span>
                  <span className="text-success fw-bold">${activePo.amount.toLocaleString()}</span>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4 pt-2 border-top border-light">
                <button type="button" className="btn btn-secondary btn-sm px-4" onClick={() => setIsDetailsOpen(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generate PO Overlay Modal */}
      {isGenerateOpen && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content card p-4 glass border border-light" style={{ width: '450px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3.5 pb-2.5 border-bottom border-light">
              <h5 className="text-white fw-bold m-0">Generate Purchase Order</h5>
              <button 
                type="button" 
                className="btn border-0 p-0 text-white text-muted-hover"
                onClick={() => setIsGenerateOpen(false)}
                aria-label="Close modal"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleGeneratePO} className="d-flex flex-column gap-3.5">
              <p className="text-secondary small mb-1">
                Select an approved quotation to authorize and dispatch a new Purchase Order:
              </p>

              <div className="form-group">
                <label className="text-secondary small mb-1 fw-medium" htmlFor="quotation-select">Quotation Scope</label>
                <div className="form-input-wrapper px-3 py-2 rounded-3">
                  <select 
                    id="quotation-select"
                    required
                    className="bg-transparent border-0 text-white w-100 fs-7 outline-none cursor-pointer"
                    style={{ backgroundColor: 'var(--bg-secondary)' }}
                    value={selectedQuoteId}
                    onChange={(e) => setSelectedQuoteId(e.target.value)}
                  >
                    <option value="" style={{ backgroundColor: 'var(--bg-secondary)' }}>Select approved quote...</option>
                    {mockQuotations.map(q => (
                      <option key={q.quotationId} value={q.quotationId} style={{ backgroundColor: 'var(--bg-secondary)' }}>
                        QTN-{q.quotationId} - {q.vendor} (${q.amount.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4 pt-2 border-top border-light">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsGenerateOpen(false)}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary btn-sm px-4 fw-medium"
                >
                  Generate PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrders;
