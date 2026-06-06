import { useState } from 'react';
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

const initialInvoices = [
  { id: 1, invoice_number: 'INV-2026-7790', purchase_order_id: 2, vendor_name: 'Titan Heavy Machinery', subtotal: 97457.63, tax_amount: 17542.37, total_amount: 115000, status: 'PAID', created_at: '2026-06-01T10:00:00Z' },
  { id: 2, invoice_number: 'INV-2026-7791', purchase_order_id: 1, vendor_name: 'Stark Industries', subtotal: 33474.58, tax_amount: 6025.42, total_amount: 39500, status: 'UNPAID', created_at: '2026-06-05T15:30:00Z' },
];

const mockPOs = [
  { id: 1, po_number: 'PO-2026-1029', vendor_name: 'Stark Industries', amount: 39500 },
  { id: 2, po_number: 'PO-2026-1028', vendor_name: 'Titan Heavy Machinery', amount: 115000 },
  { id: 3, po_number: 'PO-2026-1027', vendor_name: 'NetScale Solutions', amount: 18900 }
];

const Invoices = () => {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(2);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [selectedPoId, setSelectedPoId] = useState('');

  const activeInvoice = invoices.find(inv => inv.id === selectedInvoiceId) || invoices[0];

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
  const handleGenerateInvoiceSubmit = (e) => {
    e.preventDefault();
    if (!selectedPoId) return;

    const chosenPo = mockPOs.find(p => p.id === parseInt(selectedPoId));
    if (!chosenPo) return;

    // Calculate tax (18% GST calculation)
    const total = chosenPo.amount;
    const sub = total / 1.18;
    const tax = total - sub;

    const payload = {
      purchaseOrderId: chosenPo.id
    };

    console.log('Axios POST /invoices payload:', payload);

    const newInvoice = {
      id: invoices.length + 1,
      invoice_number: `INV-2026-77${90 + invoices.length}`,
      purchase_order_id: chosenPo.id,
      vendor_name: chosenPo.vendor_name,
      subtotal: parseFloat(sub.toFixed(2)),
      tax_amount: parseFloat(tax.toFixed(2)),
      total_amount: total,
      status: 'UNPAID',
      created_at: new Date().toISOString()
    };

    setInvoices([newInvoice, ...invoices]);
    setSelectedInvoiceId(newInvoice.id);
    setIsGenerateOpen(false);
    setSelectedPoId('');
  };

  // Mark Paid (PATCH /invoices/{id}/mark-paid)
  const handleMarkPaid = (id) => {
    console.log(`Axios PATCH /invoices/${id}/mark-paid payload: {}`);
    setInvoices(invoices.map(inv => {
      if (inv.id === id) {
        return { ...inv, status: 'PAID' };
      }
      return inv;
    }));
  };

  // Download PDF (GET /invoices/{id}/pdf)
  const handleDownloadPDF = (id, invoiceNumber) => {
    console.log(`Axios GET /invoices/${id}/pdf trigger`);
    alert(`Downloading PDF document for invoice reference: ${invoiceNumber}`);
  };

  // Email Invoice (POST /invoices/{id}/email)
  const handleEmailInvoice = (id, invoiceNumber) => {
    console.log(`Axios POST /invoices/${id}/email trigger`);
    alert(`Invoice document dispatch queued. Sent email to supplier for invoice: ${invoiceNumber}`);
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
                    {mockPOs.map(po => (
                      <option key={po.id} value={po.id} style={{ backgroundColor: 'var(--bg-secondary)' }}>
                        {po.po_number} - {po.vendor_name} (${po.amount.toLocaleString()})
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
