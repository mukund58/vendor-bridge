import { FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';

const Approvals = () => {
  const approvalQueue = [
    { id: 'APP-0091', requester: 'Sarah Jenkins', type: 'Purchase Order', item: 'Server Infrastructure Migration', amount: '$18,900.00', status: 'Pending Approval' },
    { id: 'APP-0092', requester: 'Marcus Cole', type: 'Vendor Onboarding', item: 'Global Logistics Inc (Probationary)', amount: 'N/A', status: 'Pending Review' },
  ];

  return (
    <div className="d-flex flex-column gap-4">
      <div>
        <h1 className="h3 mb-1 text-white fw-bold">Approval Workflow Queue</h1>
        <p className="text-secondary small">Review, authorize or reject procurement requests and supplier applications.</p>
      </div>

      <div className="card p-4">
        <h6 className="text-white mb-3 fw-semibold">Requests Awaiting Authorization</h6>
        
        {approvalQueue.length === 0 ? (
          <div className="text-center py-5">
            <FiAlertCircle size={40} className="text-muted mb-2" />
            <p className="text-secondary mb-0">All clear! No items are currently waiting for approval.</p>
          </div>
        ) : (
          <div className="table-responsive border-0">
            <table className="table custom-table text-nowrap align-middle">
              <thead>
                <tr>
                  <th scope="col">Approval ID</th>
                  <th scope="col">Requested By</th>
                  <th scope="col">Type</th>
                  <th scope="col">Subject / Contract</th>
                  <th scope="col">Cost Impact</th>
                  <th scope="col" className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {approvalQueue.map((item) => (
                  <tr key={item.id}>
                    <td className="text-primary fw-medium">{item.id}</td>
                    <td>{item.requester}</td>
                    <td><span className="text-white small">{item.type}</span></td>
                    <td className="fw-semibold text-white">{item.item}</td>
                    <td className="fw-bold">{item.amount}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <button type="button" className="btn btn-success btn-sm px-3 d-flex align-items-center gap-1">
                          <FiCheck /> Approve
                        </button>
                        <button type="button" className="btn btn-danger btn-sm px-3 d-flex align-items-center gap-1">
                          <FiX /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Approvals;
