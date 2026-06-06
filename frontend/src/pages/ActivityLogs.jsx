import { useState, useEffect } from 'react';
import { 
  FiFileText, 
  FiCheckSquare, 
  FiDollarSign, 
  FiShoppingBag, 
  FiAlertCircle, 
  FiX, 
  FiSearch, 
  FiClock,
  FiCheck,
  FiInfo
} from 'react-icons/fi';
import './ActivityLogs.css';
import api from '../services/api';

// Mock logs conforming exactly to GET /activities API structure
const mockActivities = [
  { id: 1, action: 'RFQ Published for Raw Steel Sheet Coils', timestamp: '2026-06-06T09:52:00Z', type: 'RFQ', status: 'SUCCESS', user: 'Sarah Jenkins' },
  { id: 2, action: 'Approval Pending for Cloud Infrastructure PO', timestamp: '2026-06-06T08:15:00Z', type: 'APPROVAL', status: 'WARNING', user: 'System Agent' },
  { id: 3, action: 'PO PO-2026-1029 generated for Stark Industries', timestamp: '2026-06-05T14:30:00Z', type: 'PURCHASE ORDER', status: 'SUCCESS', user: 'Sarah Jenkins' },
  { id: 4, action: 'Invoice INV-2026-7791 marked Paid in ledger', timestamp: '2026-06-05T11:00:00Z', type: 'INVOICE', status: 'SUCCESS', user: 'Marcus Cole' },
  { id: 5, action: 'RFQ QTN-4170 rejected due to compliance score variance', timestamp: '2026-06-04T16:50:00Z', type: 'RFQ', status: 'DANGER', user: 'Emily Ross' },
  { id: 6, action: 'New Supplier Apex Metals onboarded', timestamp: '2026-06-03T10:15:00Z', type: 'APPROVAL', status: 'SUCCESS', user: 'System Agent' },
  { id: 7, action: 'Draft PO PO-2026-1026 cancelled due to budget cuts', timestamp: '2026-05-25T16:45:00Z', type: 'PURCHASE ORDER', status: 'DANGER', user: 'Emily Ross' }
];

const initialNotifications = [
  { id: 101, title: 'Action Required: 3 approvals pending', time: '10 mins ago', type: 'APPROVAL', unread: true },
  { id: 102, title: 'New bid submitted for RFQ-2026-0041', time: '1 hr ago', type: 'RFQ', unread: true },
  { id: 103, title: 'Invoice INV-2026-7791 processed successfully', time: '3 hrs ago', type: 'INVOICE', unread: false },
  { id: 104, title: 'PO PO-2026-1029 acknowledged by Apex Metals', time: '1 day ago', type: 'PURCHASE ORDER', unread: false }
];

const ActivityLogs = () => {
  const [activities, setActivities] = useState([]);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeFilter, setActiveFilter] = useState('ALL'); // ALL, RFQ, APPROVAL, INVOICE, PURCHASE ORDER
  const [searchQuery, setSearchQuery] = useState('');

  const fetchActivities = async () => {
    try {
      const endpoint = activeFilter === 'ALL' 
        ? '/activities' 
        : `/activities?type=${activeFilter}`;
      const response = await api.get(endpoint);
      setActivities(response.data);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [activeFilter]);

  // Handle filter changes (Simulates GET /activities?type=...)
  const handleFilterChange = (filterType) => {
    setActiveFilter(filterType);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter logs dynamically
  const filteredActivities = activities.filter((act) => {
    const matchesSearch = 
      act.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = activeFilter === 'ALL' ? true : act.type === activeFilter;

    return matchesSearch && matchesType;
  });

  // Action: Dismiss notification
  const dismissNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  // Action: Mark all read
  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  // Helper status color mapping
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'SUCCESS':
        return 'badge-success';
      case 'WARNING':
        return 'badge-warning';
      case 'DANGER':
        return 'badge-danger';
      default:
        return 'badge-info';
    }
  };

  // Helper type icon mapping
  const getTypeMeta = (type) => {
    switch (type) {
      case 'RFQ':
        return { icon: FiFileText, badge: 'badge-info', label: 'RFQ' };
      case 'APPROVAL':
        return { icon: FiCheckSquare, badge: 'badge-warning', label: 'Approval' };
      case 'INVOICE':
        return { icon: FiDollarSign, badge: 'badge-success', label: 'Invoice' };
      case 'PURCHASE ORDER':
        return { icon: FiShoppingBag, badge: 'badge-primary', label: 'PO' };
      default:
        return { icon: FiInfo, badge: 'badge-secondary', label: type };
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Title Header */}
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h1 className="h3 mb-1 text-white fw-bold">System Activity & Alerts</h1>
          <p className="text-secondary small">Real-time audit ledger, background transaction monitoring, and notifications.</p>
        </div>
      </div>

      {/* Dynamic Filter Buttons Row */}
      <div className="d-flex flex-wrap gap-2 pb-1.5 border-bottom border-light">
        {['ALL', 'RFQ', 'APPROVAL', 'INVOICE', 'PURCHASE ORDER'].map((type) => (
          <button
            key={type}
            type="button"
            className={`btn btn-sm px-3 ${activeFilter === type ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => handleFilterChange(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Main Grid View */}
      <div className="row g-4">
        {/* Left Side: Audit Table & Timeline */}
        <div className="col-12 col-xl-8 d-flex flex-column gap-4">
          
          {/* Filtering search bar */}
          <div className="card p-3">
            <div className="d-flex align-items-center bg-secondary px-3 py-1.5 rounded-3 border border-light" style={{ maxWidth: '400px' }}>
              <FiSearch className="text-muted me-2" size={16} />
              <input 
                type="text" 
                className="bg-transparent border-0 text-white w-100 fs-7 outline-none" 
                placeholder="Search audit trail..." 
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>

          {/* Section 3: Audit Logs Table */}
          <div className="card p-4">
            <h5 className="text-white mb-3.5 fw-semibold fs-6">Audit Logs Ledger</h5>
            
            <div className="table-responsive border-0">
              <table className="table custom-table text-nowrap align-middle">
                <thead>
                  <tr>
                    <th scope="col">Action</th>
                    <th scope="col">Type</th>
                    <th scope="col">Timestamp</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredActivities.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-5 text-secondary">
                        No activity records match filters.
                      </td>
                    </tr>
                  ) : (
                    filteredActivities.map((act) => {
                      const typeMeta = getTypeMeta(act.type);
                      const TypeIcon = typeMeta.icon;
                      return (
                        <tr key={act.id}>
                          <td className="fw-semibold text-white">
                            <div className="d-flex flex-column">
                              <span>{act.action}</span>
                              <span className="text-muted extra-small">By: {act.user}</span>
                            </div>
                          </td>
                          <td>
                            <span className={`badge-status ${typeMeta.badge} d-flex align-items-center gap-1`} style={{ width: 'fit-content' }}>
                              <TypeIcon size={11} /> {typeMeta.label}
                            </span>
                          </td>
                          <td className="text-secondary small">
                            {new Date(act.timestamp).toLocaleString()}
                          </td>
                          <td>
                            <span className={`badge bg-opacity-10 text-xs px-2.5 py-1 ${getStatusBadgeClass(act.status)}`} style={{ color: 'currentColor' }}>
                              {act.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 1: Activity Timeline Visualization */}
          <div className="card p-4">
            <h5 className="text-white mb-4 fw-semibold fs-6">Activity Timeline</h5>
            
            <div className="activity-timeline">
              {filteredActivities.map((act) => {
                const typeMeta = getTypeMeta(act.type);
                const TypeIcon = typeMeta.icon;
                const statusColorClass = act.status.toLowerCase();

                return (
                  <div key={act.id} className={`activity-item ${statusColorClass}`}>
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <h6 className="text-white small fw-bold mb-0">{act.action}</h6>
                      <span className="text-muted extra-small">{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="text-muted extra-small">Operated by: {act.user}</span>
                      <span className="text-muted extra-small">&bull;</span>
                      <span className={`badge bg-opacity-10 extra-small px-1.5 py-0.5 ${typeMeta.badge}`} style={{ color: 'currentColor' }}>
                        <TypeIcon size={9} className="me-1" /> {typeMeta.label}
                      </span>
                    </div>
                  </div>
                );
              })}
              {filteredActivities.length === 0 && (
                <div className="text-center py-4 text-secondary small">
                  No timeline logs to display.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Side: Notifications panel */}
        <div className="col-12 col-xl-4">
          <div className="card p-4">
            <div className="d-flex justify-content-between align-items-center mb-3.5 border-bottom border-light pb-2.5">
              <div>
                <h5 className="text-white mb-0 fw-semibold fs-6">Alert Notifications</h5>
                <span className="text-muted extra-small">Requires operator review</span>
              </div>
              {notifications.some(n => n.unread) && (
                <button 
                  type="button" 
                  className="btn btn-secondary btn-sm d-flex align-items-center gap-1"
                  onClick={markAllRead}
                  style={{ fontSize: '0.75rem' }}
                >
                  <FiCheck /> Mark all read
                </button>
              )}
            </div>

            <div className="d-flex flex-column gap-3">
              {notifications.map((notif) => {
                const typeMeta = getTypeMeta(notif.type);
                const TypeIcon = typeMeta.icon;
                return (
                  <div 
                    key={notif.id} 
                    className={`notification-card p-3 rounded bg-secondary border border-light d-flex justify-content-between align-items-start ${
                      notif.unread ? 'unread' : ''
                    }`}
                  >
                    <div className="d-flex gap-2.5">
                      <div className={`p-2 rounded-circle bg-opacity-10 text-primary ${typeMeta.badge}`} style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'currentColor' }}>
                        <TypeIcon size={12} />
                      </div>
                      <div>
                        <h6 className="text-white small fw-bold mb-0.5 mt-0.5">{notif.title}</h6>
                        <div className="d-flex align-items-center gap-2 text-muted extra-small">
                          <FiClock size={10} />
                          <span>{notif.time}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      className="btn border-0 p-0 text-muted cursor-pointer"
                      onClick={() => dismissNotification(notif.id)}
                      title="Dismiss Alert"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                );
              })}
              {notifications.length === 0 && (
                <div className="text-center py-5 text-secondary">
                  <FiAlertCircle size={32} className="mb-2" />
                  <p className="small mb-0">No active alerts at this time.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
