import { FiPlus, FiFilter } from 'react-icons/fi';

const RFQs = () => {
  const rfqsList = [
    { id: 'RFQ-2026-0041', title: 'Steel Sheet Coils', department: 'Operations', deadline: 'Jun 15, 2026', submissions: 3, status: 'Active', badge: 'badge-success' },
    { id: 'RFQ-2026-0040', title: 'Cloud Server Migration', department: 'IT Infrastructure', deadline: 'Jun 18, 2026', submissions: 1, status: 'Pending Review', badge: 'badge-warning' },
    { id: 'RFQ-2026-0039', title: 'Office Refurbishment', department: 'Facilities', deadline: 'Jun 25, 2026', submissions: 0, status: 'Draft', badge: 'badge-info' },
  ];

  return (
    <div className="d-flex flex-column gap-4">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h1 className="h3 mb-1 text-white fw-bold">Request for Quotations (RFQs)</h1>
          <p className="text-secondary small">Invite vendors, submit specifications, and set bidding deadlines.</p>
        </div>
        <button type="button" className="btn btn-primary d-flex align-items-center gap-2">
          <FiPlus /> New RFQ
        </button>
      </div>

      <div className="card p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="text-white mb-0 fw-semibold">All Active RFQs</h6>
          <button type="button" className="btn btn-secondary btn-sm d-flex align-items-center gap-2">
            <FiFilter /> Filter
          </button>
        </div>

        <div className="table-responsive border-0">
          <table className="table custom-table text-nowrap align-middle">
            <thead>
              <tr>
                <th scope="col">RFQ Reference</th>
                <th scope="col">RFQ Title</th>
                <th scope="col">Department</th>
                <th scope="col">Response Deadline</th>
                <th scope="col">Submissions</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {rfqsList.map((rfq) => (
                <tr key={rfq.id}>
                  <td className="text-primary fw-medium">{rfq.id}</td>
                  <td className="fw-semibold text-white">{rfq.title}</td>
                  <td>{rfq.department}</td>
                  <td className="text-secondary small">{rfq.deadline}</td>
                  <td className="text-center fw-bold text-white">{rfq.submissions}</td>
                  <td>
                    <span className={`badge-status ${rfq.badge}`}>
                      {rfq.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RFQs;
