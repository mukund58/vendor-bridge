import { mockDashboardData } from '../data/mockDashboardData';
import { 
  FiUsers, 
  FiFileText, 
  FiCheckSquare, 
  FiShoppingBag, 
  FiDollarSign, 
  FiTrendingUp, 
  FiArrowUpRight, 
  FiArrowDownRight,
  FiCheck, 
  FiX, 
  FiExternalLink,
  FiShare2,
  FiAlertCircle
} from 'react-icons/fi';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar
} from 'recharts';

const Dashboard = () => {
  const { kpis, spendingTrend, vendorPerformance, recentRfqs, recentPOs, pendingApprovals, activities } = mockDashboardData;

  // Helper to map KPI key to icons and accent border styling
  const getKpiMeta = (id) => {
    switch (id) {
      case 'vendors':
        return { icon: FiUsers, border: 'border-start-blue', colorClass: 'text-primary', bgClass: 'bg-primary' };
      case 'rfqs':
        return { icon: FiFileText, border: 'border-start-green', colorClass: 'text-success', bgClass: 'bg-success' };
      case 'approvals':
        return { icon: FiCheckSquare, border: 'border-start-orange', colorClass: 'text-warning', bgClass: 'bg-warning' };
      case 'pos':
        return { icon: FiShoppingBag, border: 'border-start-cyan', colorClass: 'text-info', bgClass: 'bg-info' };
      case 'invoices':
        return { icon: FiDollarSign, border: 'border-start-indigo', colorClass: 'text-indigo', bgClass: 'bg-indigo' };
      case 'spend':
        return { icon: FiTrendingUp, border: 'border-start-violet', colorClass: 'text-violet', bgClass: 'bg-violet' };
      default:
        return { icon: FiFileText, border: '', colorClass: 'text-secondary', bgClass: 'bg-secondary' };
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header Panel */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
        <div>
          <h1 className="h3 mb-1 text-white fw-bold tracking-tight">Procurement Dashboard</h1>
          <p className="text-secondary small mb-0">Control panel for bidding timelines, vendor audits, and payouts.</p>
        </div>
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-secondary btn-sm d-flex align-items-center gap-2">
            <FiShare2 size={14} /> Export Report
          </button>
          <button type="button" className="btn btn-primary btn-sm px-3 fw-medium">
            New RFQ
          </button>
        </div>
      </div>

      {/* 6-Grid KPI Cards Section */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xxl-6 g-3">
        {kpis.map((kpi) => {
          const meta = getKpiMeta(kpi.id);
          const Icon = meta.icon;
          return (
            <div key={kpi.id} className="col">
              <div className={`card h-100 p-3.5 border-0 border-start border-4 ${meta.border}`} style={{ backgroundColor: 'var(--bg-card)' }}>
                <div className="d-flex justify-content-between align-items-center mb-2.5">
                  <span className="text-secondary small fw-medium">{kpi.label}</span>
                  <div className={`p-2 rounded-3 bg-opacity-10 border border-opacity-10 ${meta.colorClass} ${meta.bgClass}`} style={{ borderColor: 'currentColor' }}>
                    <Icon size={16} />
                  </div>
                </div>
                <div className="fs-4 fw-bold text-white mb-1.5">{kpi.value}</div>
                <div className="d-flex align-items-center gap-1.5 extra-small">
                  <span className={`fw-semibold d-flex align-items-center gap-0.5 ${kpi.up ? 'text-success' : 'text-danger'}`}>
                    {kpi.up ? <FiArrowUpRight size={13} /> : <FiArrowDownRight size={13} />} {kpi.change}
                  </span>
                  <span className="text-muted">{kpi.subtitle}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="row g-4">
        {/* Spending Trend Line Chart */}
        <div className="col-12 col-xl-7">
          <div className="card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h5 className="text-white mb-1 fw-semibold fs-6">Procurement Spend Trend</h5>
                <p className="text-secondary extra-small mb-0">Monthly purchase order billing aggregates (YTD)</p>
              </div>
              <span className="badge-status badge-info">Line Analytics</span>
            </div>
            <div style={{ width: '100%', height: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={spendingTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                    formatter={(val) => [`$${val.toLocaleString()}`, 'Spent Amount']}
                  />
                  <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, stroke: '#3b82f6', strokeWidth: 2, fill: '#090d16' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Vendor Performance Bar Chart */}
        <div className="col-12 col-xl-5">
          <div className="card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h5 className="text-white mb-1 fw-semibold fs-6">Vendor Performance Analysis</h5>
                <p className="text-secondary extra-small mb-0">Supplier rating score percentages by audit category</p>
              </div>
              <span className="badge-status badge-success">Comparative</span>
            </div>
            <div style={{ width: '100%', height: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vendorPerformance} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" fontSize={11} wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }} />
                  <Bar dataKey="delivery" name="Delivery Accuracy" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="quality" name="Quality Audit" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Tables & Feed Sections Grid */}
      <div className="row g-4">
        {/* Left Side: Recent RFQs & POs */}
        <div className="col-12 col-lg-8 d-flex flex-column gap-4">
          
          {/* Section 1: Recent RFQs */}
          <div className="card p-4">
            <div className="d-flex justify-content-between align-items-center mb-3.5">
              <div>
                <h5 className="text-white mb-1 fw-semibold fs-6">Recent Requests for Quotations (RFQs)</h5>
                <p className="text-secondary extra-small mb-0">Ongoing tender invitations and submission tallies</p>
              </div>
              <button type="button" className="btn btn-secondary btn-sm d-flex align-items-center gap-1.5">
                View RFQs <FiExternalLink />
              </button>
            </div>

            <div className="table-responsive border-0">
              <table className="table custom-table text-nowrap align-middle">
                <thead>
                  <tr>
                    <th scope="col">RFQ Reference</th>
                    <th scope="col">Subject</th>
                    <th scope="col">Assigned Buyer</th>
                    <th scope="col">Date Issued</th>
                    <th scope="col" className="text-center">Bids Received</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRfqs.map((rfq) => (
                    <tr key={rfq.id}>
                      <td>
                        <a href={`#rfq-${rfq.id}`} className="text-primary fw-medium text-decoration-none">{rfq.id}</a>
                      </td>
                      <td className="fw-semibold text-white">{rfq.title}</td>
                      <td>{rfq.buyer}</td>
                      <td className="text-secondary small">{rfq.date}</td>
                      <td className="text-center text-white fw-bold">{rfq.bids}</td>
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

          {/* Section 2: Recent Purchase Orders */}
          <div className="card p-4">
            <div className="d-flex justify-content-between align-items-center mb-3.5">
              <div>
                <h5 className="text-white mb-1 fw-semibold fs-6">Recent Purchase Orders (POs)</h5>
                <p className="text-secondary extra-small mb-0">Active supplier delivery slips and processing status</p>
              </div>
              <button type="button" className="btn btn-secondary btn-sm d-flex align-items-center gap-1.5">
                View POs <FiExternalLink />
              </button>
            </div>

            <div className="table-responsive border-0">
              <table className="table custom-table text-nowrap align-middle">
                <thead>
                  <tr>
                    <th scope="col">PO Number</th>
                    <th scope="col">Vendor Partner</th>
                    <th scope="col">Order Date</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Delivery State</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPOs.map((po) => (
                    <tr key={po.id}>
                      <td>
                        <a href={`#po-${po.id}`} className="text-primary fw-medium text-decoration-none">{po.id}</a>
                      </td>
                      <td className="fw-semibold text-white">{po.vendor}</td>
                      <td className="text-secondary small">{po.date}</td>
                      <td className="fw-bold">{po.amount}</td>
                      <td>
                        <span className={`badge-status ${po.badge}`}>
                          {po.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Side: Pending Approvals & Activity Feed */}
        <div className="col-12 col-lg-4 d-flex flex-column gap-4">
          
          {/* Section 3: Pending Approvals */}
          <div className="card p-4">
            <div className="d-flex justify-content-between align-items-center mb-3.5">
              <div>
                <h5 className="text-white mb-1 fw-semibold fs-6">Awaiting Approval</h5>
                <p className="text-secondary extra-small mb-0">Procurement authorization workflow queue</p>
              </div>
              <span className="badge rounded-pill bg-warning bg-opacity-10 text-warning px-2.5 py-1 text-xs">{pendingApprovals.length} pending</span>
            </div>

            <div className="d-flex flex-column gap-3">
              {pendingApprovals.map((app) => (
                <div key={app.id} className="p-3 rounded-3 border border-light" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <span className="text-primary extra-small fw-semibold uppercase tracking-wider">{app.type}</span>
                      <h6 className="text-white small fw-bold mb-0 mt-0.5">{app.subject}</h6>
                    </div>
                    <span className="text-white small fw-bold">{app.amount}</span>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center mt-3 pt-2.5 border-top border-light">
                    <span className="text-muted extra-small">By: {app.requester}</span>
                    <div className="d-flex gap-1.5">
                      <button type="button" className="btn btn-danger btn-sm p-1 d-inline-flex align-items-center justify-content-center rounded-circle" style={{ width: '24px', height: '24px' }} title="Reject">
                        <FiX size={12} />
                      </button>
                      <button type="button" className="btn btn-success btn-sm p-1 d-inline-flex align-items-center justify-content-center rounded-circle" style={{ width: '24px', height: '24px' }} title="Approve">
                        <FiCheck size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Activity Feed */}
          <div className="card p-4">
            <div className="d-flex justify-content-between align-items-center mb-3.5">
              <div>
                <h5 className="text-white mb-1 fw-semibold fs-6">System Activity Feed</h5>
                <p className="text-secondary extra-small mb-0">Procurement event streams and operator actions</p>
              </div>
              <button type="button" className="btn p-0 text-muted cursor-pointer" aria-label="Settings">
                <FiAlertCircle size={16} />
              </button>
            </div>

            <div className="timeline-wrapper d-flex flex-column gap-3.5">
              {activities.map((act, index) => {
                let indicatorColor = 'bg-primary';
                if (act.type === 'success') indicatorColor = 'bg-success';
                if (act.type === 'warning') indicatorColor = 'bg-warning';
                if (act.type === 'danger') indicatorColor = 'bg-danger';

                return (
                  <div key={index} className="d-flex gap-3 position-relative timeline-item">
                    {/* Event Dot and Connecting Line */}
                    <div className="d-flex flex-column align-items-center">
                      <span className={`d-inline-block rounded-circle ${indicatorColor}`} style={{ width: '10px', height: '10px', marginTop: '5px', boxShadow: '0 0 8px currentColor' }}></span>
                      {index < activities.length - 1 && (
                        <div className="flex-grow-1 border-start border-light border-dashed my-1" style={{ width: '1px', borderStyle: 'dashed', opacity: 0.15 }}></div>
                      )}
                    </div>
                    {/* Event Description */}
                    <div className="d-flex flex-column flex-grow-1">
                      <span className="text-secondary small">
                        <strong className="text-white">{act.user}</strong> {act.action}
                      </span>
                      <span className="text-muted extra-small mt-0.5">{act.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
