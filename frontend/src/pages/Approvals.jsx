import { useState } from 'react';
import { 
  FiCheckCircle, 
  FiAlertCircle, 
  FiXCircle, 
  FiCalendar, 
  FiCheck, 
  FiX, 
  FiEye,
  FiShoppingBag,
  FiFileText,
  FiInfo
} from 'react-icons/fi';
import './Approvals.css';

const initialApprovals = [
  { id: 1, rfqId: 1, rfq_title: 'Raw Steel Sheet Coils', vendor_name: 'Stark Industries', amount: 39500, status: 'PENDING', created_at: '2026-06-06T09:52:00Z', requester: 'Sarah Jenkins', description: 'Grade A coils for production run Q3' },
  { id: 2, rfqId: 2, rfq_title: 'Cloud server hardware racks', vendor_name: 'NetScale Solutions', amount: 18900, status: 'PENDING', created_at: '2026-06-05T14:15:00Z', requester: 'Sarah Jenkins', description: 'Rack switches and patch panels for server room migration' },
  { id: 3, rfqId: 3, rfq_title: 'Warehouse Forklifts replacement', vendor_name: 'Titan Heavy Machinery', amount: 115000, status: 'APPROVED', created_at: '2026-06-04T11:30:00Z', requester: 'Marcus Cole', description: 'Electric forklift purchase order request', remarks: 'Looks good and approved by Director' },
];

const Approvals = () => {
  const [approvals, setApprovals] = useState(initialApprovals);
  const [selectedId, setSelectedId] = useState(1);
  const [remarksText, setRemarksText] = useState('');
  
  // Modals state
  const [isRemarksOpen, setIsRemarksOpen] = useState(false);
  const [remarksMode, setRemarksMode] = useState('approve'); // 'approve' or 'reject'
  const [targetApproval, setTargetApproval] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const activeApproval = approvals.find(a => a.id === selectedId) || approvals[0];

  // Helper status color mapping
  const getStatusMeta = (status) => {
    switch (status) {
      case 'APPROVED':
        return { badge: 'badge-success', label: 'Approved', icon: FiCheckCircle };
      case 'PENDING':
        return { badge: 'badge-warning', label: 'Pending Review', icon: FiAlertCircle };
      case 'REJECTED':
        return { badge: 'badge-danger', label: 'Rejected', icon: FiXCircle };
      default:
        return { badge: 'badge-secondary', label: status, icon: FiInfo };
    }
  };

  // Open modal for remarks input
  const handleActionClick = (approval, mode) => {
    setTargetApproval(approval);
    setRemarksMode(mode);
    setRemarksText('');
    setIsRemarksOpen(true);
  };

  // Submit remarks to simulated API endpoints
  const handleRemarksSubmit = (e) => {
    e.preventDefault();

    const endpoint = remarksMode === 'approve' 
      ? `/approvals/${targetApproval.id}/approve` 
      : `/approvals/${targetApproval.id}/reject`;

    const payload = {
      remarks: remarksText
    };

    console.log(`Axios POST ${endpoint} payload:`, payload);

    const updatedStatus = remarksMode === 'approve' ? 'APPROVED' : 'REJECTED';
    setApprovals(approvals.map(a => {
      if (a.id === targetApproval.id) {
        return { ...a, status: updatedStatus, remarks: remarksText };
      }
      return a;
    }));

    setIsRemarksOpen(false);
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header section */}
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h1 className="h3 mb-1 text-white fw-bold">Approval Workflows</h1>
          <p className="text-secondary small">Review, comment, and authorize procurement contracts before PO dispatch.</p>
        </div>
        <span className="badge rounded-pill bg-warning bg-opacity-10 text-warning px-3 py-1.5 fs-7 fw-semibold border border-warning border-opacity-20">
          {approvals.filter(a => a.status === 'PENDING').length} Action Required
        </span>
      </div>

      {/* Main Workflow View Split */}
      <div className="row g-4">
        {/* Left Col: Pending Approvals list */}
        <div className="col-12 col-xl-8">
          <div className="card p-4">
            <h5 className="text-white mb-3.5 fw-semibold fs-6">Approval Workflow Queue</h5>
            
            <div className="table-responsive border-0">
              <table className="table custom-table text-nowrap align-middle">
                <thead>
                  <tr>
                    <th scope="col">RFQ Subject</th>
                    <th scope="col">Vendor</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Status</th>
                    <th scope="col">Created Date</th>
                    <th scope="col" className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {approvals.map((app) => {
                    const statusMeta = getStatusMeta(app.status);
                    const isSelected = app.id === selectedId;
                    return (
                      <tr 
                        key={app.id} 
                        className={`cursor-pointer ${isSelected ? 'highlight-lowest' : ''}`}
                        onClick={() => setSelectedId(app.id)}
                      >
                        <td className="fw-semibold text-white">
                          <div className="d-flex align-items-center gap-2">
                            <FiFileText className="text-muted" />
                            <span>{app.rfq_title}</span>
                          </div>
                        </td>
                        <td>{app.vendor_name}</td>
                        <td className="fw-bold">${app.amount.toLocaleString()}</td>
                        <td>
                          <span className={`badge-status ${statusMeta.badge}`}>
                            {statusMeta.label}
                          </span>
                        </td>
                        <td className="text-secondary small">
                          <div className="d-flex align-items-center gap-1.5">
                            <FiCalendar size={13} />
                            <span>{new Date(app.created_at).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="text-end" onClick={(e) => e.stopPropagation()}>
                          <div className="d-inline-flex gap-2">
                            {app.status === 'PENDING' ? (
                              <>
                                <button 
                                  type="button" 
                                  className="btn btn-success btn-sm p-1.5 rounded-circle d-inline-flex"
                                  onClick={() => handleActionClick(app, 'approve')}
                                  title="Approve Request"
                                >
                                  <FiCheck size={12} />
                                </button>
                                <button 
                                  type="button" 
                                  className="btn btn-danger btn-sm p-1.5 rounded-circle d-inline-flex bg-opacity-10 border-0"
                                  onClick={() => handleActionClick(app, 'reject')}
                                  title="Reject Request"
                                  style={{ color: 'var(--danger)', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                                >
                                  <FiX size={12} />
                                </button>
                              </>
                            ) : null}
                            <button 
                              type="button" 
                              className="btn btn-secondary btn-sm d-inline-flex align-items-center gap-1"
                              onClick={() => {
                                setSelectedId(app.id);
                                setIsDetailsOpen(true);
                              }}
                            >
                              <FiEye size={12} /> Details
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

        {/* Right Col: Details Summary & Stepper visualizer */}
        <div className="col-12 col-xl-4">
          <div className="d-flex flex-column gap-4">
            
            {/* Stepper Workflow Visualization */}
            <div className="card p-4">
              <h6 className="text-secondary small fw-bold uppercase tracking-wider mb-3.5">Approval Progress Visualizer</h6>
              
              <div className="workflow-timeline my-2">
                {/* Step 1: Pending */}
                <div className={`timeline-step ${activeApproval.status === 'PENDING' ? 'active' : 'completed'}`}>
                  <div className="timeline-step-indicator">
                    <FiCalendar size={12} />
                  </div>
                  <span className="timeline-step-label">Pending</span>
                </div>

                {/* Step 2: Approved / Rejected */}
                <div className={`timeline-step ${
                  activeApproval.status === 'APPROVED' 
                    ? 'completed' 
                    : activeApproval.status === 'REJECTED' 
                      ? 'rejected' 
                      : ''
                }`}>
                  <div className="timeline-step-indicator">
                    {activeApproval.status === 'APPROVED' ? (
                      <FiCheck size={12} />
                    ) : activeApproval.status === 'REJECTED' ? (
                      <FiX size={12} />
                    ) : '2'}
                  </div>
                  <span className="timeline-step-label">
                    {activeApproval.status === 'REJECTED' ? 'Rejected' : 'Approved'}
                  </span>
                </div>

                {/* Step 3: Purchase Order */}
                <div className={`timeline-step ${activeApproval.status === 'APPROVED' ? 'active' : ''}`}>
                  <div className="timeline-step-indicator">
                    <FiShoppingBag size={12} />
                  </div>
                  <span className="timeline-step-label">PO Issued</span>
                </div>
              </div>

              {activeApproval.status === 'APPROVED' && (
                <div className="mt-3 text-center">
                  <div className="badge-status badge-success py-2 w-100 d-flex align-items-center justify-content-center gap-1.5">
                    <FiShoppingBag /> Ready to Dispatch Purchase Order
                  </div>
                </div>
              )}
            </div>

            {/* Quick Details card */}
            <div className="card p-4">
              <div className="border-bottom border-light pb-2.5 mb-3">
                <span className="text-primary extra-small fw-semibold uppercase tracking-wider">Reviewing Proposal</span>
                <h5 className="text-white fw-bold mb-0 mt-0.5">{activeApproval.rfq_title}</h5>
              </div>

              <div className="d-flex flex-column gap-3.5">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-secondary small">Vendor Partner:</span>
                  <span className="text-white fw-medium small">{activeApproval.vendor_name}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-secondary small">Total Cost:</span>
                  <span className="text-white fw-bold small">${activeApproval.amount.toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-secondary small">Requester:</span>
                  <span className="text-white small">{activeApproval.requester}</span>
                </div>
                
                {activeApproval.remarks && (
                  <div className="p-3 rounded-3 mt-1.5" style={{ backgroundColor: 'var(--bg-secondary)', borderLeft: '3px solid var(--accent-color)' }}>
                    <span className="text-muted extra-small uppercase fw-bold">Evaluation Remarks:</span>
                    <p className="text-white small mb-0 mt-1">{activeApproval.remarks}</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Details Dialog Modal */}
      {isDetailsOpen && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content card p-4 glass border border-light" style={{ width: '500px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3.5 pb-2.5 border-bottom border-light">
              <h5 className="text-white fw-bold m-0">Proposal Audit Details</h5>
              <button 
                type="button" 
                className="btn border-0 p-0 text-white text-muted-hover"
                onClick={() => setIsDetailsOpen(false)}
                aria-label="Close details modal"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="d-flex flex-column gap-3">
              <div>
                <span className="text-muted extra-small uppercase">RFQ Description</span>
                <p className="text-white small mt-1 mb-0">{activeApproval.description}</p>
              </div>

              <div className="row g-3 py-2 border-top border-bottom border-light">
                <div className="col-6">
                  <span className="text-muted extra-small uppercase">Requested By</span>
                  <div className="text-white small fw-medium mt-0.5">{activeApproval.requester}</div>
                </div>
                <div className="col-6">
                  <span className="text-muted extra-small uppercase">Status</span>
                  <div className="mt-0.5">
                    <span className={`badge-status ${getStatusMeta(activeApproval.status).badge}`}>
                      {getStatusMeta(activeApproval.status).label}
                    </span>
                  </div>
                </div>
              </div>

              {activeApproval.remarks && (
                <div className="p-3 rounded-3" style={{ backgroundColor: 'var(--bg-secondary)', borderLeft: '3px solid var(--accent-color)' }}>
                  <span className="text-muted extra-small uppercase fw-bold">Approval Remarks</span>
                  <p className="text-white small mb-0 mt-1">{activeApproval.remarks}</p>
                </div>
              )}

              <div className="d-flex justify-content-end gap-2 mt-4 pt-2 border-top border-light">
                {activeApproval.status === 'PENDING' ? (
                  <>
                    <button 
                      type="button" 
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        setIsDetailsOpen(false);
                        handleActionClick(activeApproval, 'reject');
                      }}
                    >
                      Reject
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-success btn-sm"
                      onClick={() => {
                        setIsDetailsOpen(false);
                        handleActionClick(activeApproval, 'approve');
                      }}
                    >
                      Approve
                    </button>
                  </>
                ) : (
                  <button type="button" className="btn btn-secondary btn-sm px-4" onClick={() => setIsDetailsOpen(false)}>
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Remarks Input Modal Overlay */}
      {isRemarksOpen && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content card p-4 glass border border-light" style={{ width: '450px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3.5 pb-2.5 border-bottom border-light">
              <h5 className="text-white fw-bold m-0">
                {remarksMode === 'approve' ? 'Approve Proposal' : 'Reject Proposal'}
              </h5>
              <button 
                type="button" 
                className="btn border-0 p-0 text-white text-muted-hover"
                onClick={() => setIsRemarksOpen(false)}
                aria-label="Close remarks modal"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleRemarksSubmit} className="d-flex flex-column gap-3.5">
              <p className="text-secondary small mb-1">
                Input your evaluation feedback for <strong className="text-white">{targetApproval.rfq_title}</strong>:
              </p>
              
              <div className="form-group">
                <label className="text-secondary small mb-1 fw-medium" htmlFor="approval-remarks">Remarks / Justification</label>
                <div className="form-input-wrapper px-3 py-2 rounded-3">
                  <textarea 
                    id="approval-remarks"
                    rows={3}
                    required
                    placeholder={remarksMode === 'approve' ? "e.g. Price meets Q3 budget. Approved." : "e.g. Price exceeded initial estimate by 15%."}
                    className="bg-transparent border-0 text-white w-100 fs-7 outline-none"
                    value={remarksText}
                    onChange={(e) => setRemarksText(e.target.value)}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4 pt-2 border-top border-light">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsRemarksOpen(false)}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={`btn btn-sm px-4 fw-medium ${remarksMode === 'approve' ? 'btn-success' : 'btn-danger'}`}
                >
                  {remarksMode === 'approve' ? 'Approve Request' : 'Reject Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Approvals;
