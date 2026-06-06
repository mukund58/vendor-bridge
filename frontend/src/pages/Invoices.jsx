import { useState, useEffect } from 'react';
import { 
  FiPlus, 
  FiFileText, 
  FiMail, 
  FiPrinter, 
  FiDownload, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiX, 
  FiBriefcase 
} from 'react-icons/fi';
import './Invoices.css';
import { fetchInvoices, createInvoice, markInvoiceAsPaid, fetchInvoicePdfUrl, sendInvoiceEmail } from '../services/invoiceService';
import { fetchPurchaseOrders } from '../services/purchaseOrderService';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [selectedPoId, setSelectedPoId] = useState('');
  const [pos, setPos] = useState([]);

  const loadData = async () => {
    try {
      const invoiceList = await fetchInvoices();
      setInvoices(invoiceList);
      if (invoiceList.length > 0) {
        setSelectedInvoiceId(invoiceList[0].id);
      } else {
        setSelectedInvoiceId(null);
      }
      const poList = await fetchPurchaseOrders();
      setPos(poList);
    } catch (err) {
      console.error("Failed to load invoice/PO data", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeInvoice = invoices.find(inv => inv.id === selectedInvoiceId) || invoices[0] || null;

  // Helper status color mapping
  const getStatusMeta = (status) => {
    switch (status) {
      case 'PAID':
        return { badge: 'badge-success', label: 'Paid', icon: FiCheckCircle };
      case 'UNPAID':
        return { badge: 'badge-warning', label: 'Unpaid / Open', icon: FiAlertCircle };
      default:
        return { badge: 'badge-secondary', label: status, icon: FiAlertCircle };
    }
  };

  // Generate Invoice (POST /invoices)
  const handleGenerateInvoiceSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPoId) return;

    try {
      await createInvoice(parseInt(selectedPoId));
      setIsGenerateOpen(false);
      setSelectedPoId('');
      await loadData();
    } catch (err) {
      console.error("Failed to generate invoice", err);
    }
  };

  // Mark Paid (PATCH /invoices/{id}/mark-paid)
  const handleMarkPaid = async (id) => {
    try {
      await markInvoiceAsPaid(id);
      await loadData();
    } catch (err) {
      console.error("Failed to mark invoice as paid", err);
    }
  };

  // Download PDF (GET /invoices/{id}/pdf)
  const handleDownloadPDF = async (id, invoiceNumber) => {
    try {
      const pdfEndpoint = await fetchInvoicePdfUrl(id);
      // Wait, endpoint is root-relative or absolute. The service returns '/invoices/{id}/pdf' or similar.
      // Since fetchInvoicePdfUrl returns the path, let's prepend backend host if needed or use relative.
      // The frontend config uses relative path mapped through proxy or baseURL.
      // Let's use the baseURL from api service or open URL dynamically.
      const baseUrl = '/api/v1'; // fallback
      window.open(`http://localhost:5000${baseUrl}${pdfEndpoint}`, '_blank');
    } catch (err) {
      console.error("Failed to open invoice PDF", err);
    }
  };

  // Email Invoice (POST /invoices/{id}/email)
  const handleEmailInvoice = async (id, invoiceNumber) => {
    try {
      await sendInvoiceEmail(id);
      alert(`Invoice document dispatch queued. Sent email to supplier for invoice: ${invoiceNumber}`);
    } catch (err) {
      console.error("Failed to dispatch email", err);
    }
  };

  // Print Invoice simulation
  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header Panel */}
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h1 className="h3 mb-1 text-white fw-bold">Supplier Invoicing & Ledger</h1>
          <p className="text-secondary small">Review supplier bill submissions, reconcile GST values, and process vendor payouts.</p>
        </div>
        <button 
          type="button" 
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => setIsGenerateOpen(true)}
        >
          <FiPlus /> Generate Invoice
        </button>
      </div>

      {/* Main split viewport layout */}
      <div className="row g-4">
        {/* Left Col: Invoice Table Ledger */}
        <div className="col-12 col-xl-7">
          <div className="card p-4">
            <h5 className="text-white mb-3.5 fw-semibold fs-6">Billing Ledger</h5>
            
            <div className="table-responsive border-0">
              <table className="table custom-table text-nowrap align-middle">
                <thead>
                  <tr>
                    <th scope="col">Invoice Number</th>
                    <th scope="col">Vendor</th>
                    <th scope="col">Subtotal</th>
                    <th scope="col">Tax Amount</th>
                    <th scope="col">Total Amount</th>
                    <th scope="col">Status</th>
                    <th scope="col" className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => {
                    const isSelected = inv.id === selectedInvoiceId;
                    const statusMeta = getStatusMeta(inv.status);
                    return (
                      <tr 
                        key={inv.id}
                        className={`cursor-pointer ${isSelected ? 'highlight-lowest' : ''}`}
                        onClick={() => setSelectedInvoiceId(inv.id)}
                      >
                        <td className="text-primary fw-medium">{inv.invoice_number}</td>
                        <td className="fw-semibold text-white">{inv.vendor_name}</td>
                        <td>${inv.subtotal.toLocaleString()}</td>
                        <td className="text-secondary small">${inv.tax_amount.toLocaleString()}</td>
                        <td className="fw-bold">${inv.total_amount.toLocaleString()}</td>
                        <td>
                          <span className={`badge-status ${statusMeta.badge}`}>
                            {statusMeta.label}
                          </span>
                        </td>
                        <td className="text-end" onClick={(e) => e.stopPropagation()}>
                          <button 
                            type="button" 
                            className="btn btn-secondary btn-sm"
                            onClick={() => setSelectedInvoiceId(inv.id)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Invoice Details Card (Physical Sheet design style) */}
        <div className="col-12 col-xl-5">
          {activeInvoice ? (
            <div className="invoice-slip p-4 d-flex flex-column gap-3.5 position-relative">
              {/* Watermark badge status */}
              <div className="status-watermark text-success">
                {activeInvoice.status}
              </div>

              {/* Invoice Header */}
              <div className="invoice-header d-flex justify-content-between align-items-start">
                <div>
                  <div className="d-flex align-items-center gap-2">
                    <FiBriefcase className="text-primary" />
                    <span className="text-white fw-bold tracking-tight">VendorBridge ERP</span>
                  </div>
                  <span className="text-muted extra-small d-block mt-1">Billing Reference Document</span>
                </div>
                <div className="text-end">
                  <h6 className="text-white fw-bold m-0 fs-6">{activeInvoice.invoice_number}</h6>
                  <span className="text-muted extra-small">Date: {new Date(activeInvoice.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Bill To & Associated PO details */}
              <div className="invoice-bill-info row g-3 pb-3 border-bottom border-light">
                <div className="col-6">
                  <span className="text-muted extra-small uppercase fw-semibold">Supplier Partner</span>
                  <div className="text-white small fw-bold mt-1">{activeInvoice.vendor_name}</div>
                </div>
                <div className="col-6 text-end">
                  <span className="text-muted extra-small uppercase fw-semibold">Associated PO</span>
                  <div className="text-white small fw-bold mt-1">PO-2026-10{27 + activeInvoice.purchase_order_id}</div>
                </div>
              </div>

              {/* Mock Item lines table */}
              <div className="invoice-items-summary">
                <span className="text-muted extra-small uppercase fw-semibold mb-2 d-inline-block">Summary Details</span>
                <div className="p-3 rounded bg-secondary border border-light d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <FiFileText className="text-primary" />
                    <span className="text-white small fw-semibold">Procurement Fulfillment Items</span>
                  </div>
                  <span className="text-white small fw-bold">${activeInvoice.subtotal.toLocaleString()}</span>
                </div>
              </div>

              {/* GST Tax Calculations Section */}
              <div className="invoice-totals">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-secondary small">Base Subtotal:</span>
                  <span className="text-white small">${activeInvoice.subtotal.toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-secondary small">GST Tax (18%):</span>
                  <span className="text-white small">${activeInvoice.tax_amount.toLocaleString()}</span>
                </div>
                
                {/* Grand Total Calculation Display */}
                <div className="d-flex justify-content-between align-items-center mt-2.5 pt-2.5 border-top border-light">
                  <span className="text-white fw-bold small">Grand Total:</span>
                  <span className="text-success fw-bold fs-5">${activeInvoice.total_amount.toLocaleString()}</span>
                </div>
              </div>

              {/* Action buttons list */}
              <div className="invoice-actions-panel mt-4 pt-3 border-top border-light">
                {activeInvoice.status === 'UNPAID' && (
                  <button 
                    type="button" 
                    className="btn btn-success btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1.5"
                    onClick={() => handleMarkPaid(activeInvoice.id)}
                  >
                    <FiCheckCircle /> Mark Paid
                  </button>
                )}
                <button 
                  type="button" 
                  className="btn btn-secondary btn-sm d-flex align-items-center justify-content-center gap-1"
                  onClick={() => handleDownloadPDF(activeInvoice.id, activeInvoice.invoice_number)}
                >
                  <FiDownload size={14} /> PDF
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary btn-sm d-flex align-items-center justify-content-center gap-1"
                  onClick={() => handleEmailInvoice(activeInvoice.id, activeInvoice.invoice_number)}
                >
                  <FiMail size={14} /> Send Email
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary btn-sm d-flex align-items-center justify-content-center gap-1"
                  onClick={handlePrintInvoice}
                >
                  <FiPrinter size={14} /> Print
                </button>
              </div>
            </div>
          ) : (
            <div className="card p-4 text-center text-secondary">
              Select an invoice to view summary ledger.
            </div>
          )}
        </div>
      </div>

      {/* Generate Invoice Overlay Modal */}
      {isGenerateOpen && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content card p-4 glass border border-light" style={{ width: '450px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3.5 pb-2.5 border-bottom border-light">
              <h5 className="text-white fw-bold m-0">Generate Invoice</h5>
              <button 
                type="button" 
                className="btn border-0 p-0 text-white text-muted-hover"
                onClick={() => setIsGenerateOpen(false)}
                aria-label="Close modal"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleGenerateInvoiceSubmit} className="d-flex flex-column gap-3.5">
              <p className="text-secondary small mb-1">
                Select a completed Purchase Order to generate the matching tax invoice:
              </p>

              <div className="form-group">
                <label className="text-secondary small mb-1 fw-medium" htmlFor="po-select">Purchase Order Scope</label>
                <div className="form-input-wrapper px-3 py-2 rounded-3">
                  <select 
                    id="po-select"
                    required
                    className="bg-transparent border-0 text-white w-100 fs-7 outline-none cursor-pointer"
                    style={{ backgroundColor: 'var(--bg-secondary)' }}
                    value={selectedPoId}
                    onChange={(e) => setSelectedPoId(e.target.value)}
                  >
                    <option value="" style={{ backgroundColor: 'var(--bg-secondary)' }}>Select Purchase Order...</option>
                    {pos.map(po => (
                      <option key={po.id} value={po.id} style={{ backgroundColor: 'var(--bg-secondary)' }}>
                        {po.po_number} - {po.vendor_name} (${(po.amount || 0).toLocaleString()})
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
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;
