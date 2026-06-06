import { FiUserCheck } from 'react-icons/fi';

const ActivityLogs = () => {
  const auditLogs = [
    { time: 'Jun 06, 09:52', user: 'Sarah Jenkins', action: 'Created RFQ reference RFQ-2026-0041', ip: '192.168.1.45' },
    { time: 'Jun 05, 14:15', user: 'Marcus Cole', action: 'Approved Vendor application VND-004', ip: '192.168.1.12' },
    { time: 'Jun 05, 11:30', user: 'Sarah Jenkins', action: 'Dispatched Purchase Order PO-2026-1029', ip: '192.168.1.45' },
    { time: 'Jun 04, 16:50', user: 'System Agent', action: 'Auto-closed RFQ-2026-0035 due to deadline', ip: 'localhost' },
  ];

  return (
    <div className="d-flex flex-column gap-4">
      <div>
        <h1 className="h3 mb-1 text-white fw-bold">System Activity Logs</h1>
        <p className="text-secondary small">Comprehensive audit trails of user transactions, logins, and API actions.</p>
      </div>

      <div className="card p-4">
        <h6 className="text-white mb-3 fw-semibold">Audit Records</h6>
        <div className="table-responsive border-0">
          <table className="table custom-table text-nowrap align-middle">
            <thead>
              <tr>
                <th scope="col">Timestamp</th>
                <th scope="col">Operator User</th>
                <th scope="col">Activity Description</th>
                <th scope="col">Origin IP</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log, index) => (
                <tr key={index}>
                  <td className="text-secondary small">{log.time}</td>
                  <td className="fw-semibold text-white">{log.user}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <FiUserCheck className="text-success" />
                      <span className="text-white small">{log.action}</span>
                    </div>
                  </td>
                  <td className="text-muted extra-small">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
