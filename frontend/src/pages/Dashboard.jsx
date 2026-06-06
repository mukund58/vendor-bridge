import { 
  FiUsers, 
  FiFileText, 
  FiDollarSign, 
  FiShield, 
  FiArrowUpRight, 
  FiClock,
  FiExternalLink
} from 'react-icons/fi';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const mockSpendingData = [
  { month: 'Jan', rfqValue: 120, spent: 80 },
  { month: 'Feb', rfqValue: 150, spent: 95 },
  { month: 'Mar', rfqValue: 220, spent: 140 },
  { month: 'Apr', rfqValue: 180, spent: 110 },
  { month: 'May', rfqValue: 270, spent: 195 },
  { month: 'Jun', rfqValue: 310, spent: 240 },
];

const mockCategoryData = [
  { name: 'Logistics', value: 450, color: '#3b82f6' },
  { name: 'Raw Material', value: 780, color: '#10b981' },
  { name: 'IT Infrastructure', value: 320, color: '#06b6d4' },
  { name: 'Consulting', value: 210, color: '#f59e0b' },
];

const mockRecentTransactions = [
  { id: 'RFQ-2026-0041', title: 'Steel Sheet Coils', vendor: 'Apex Metals Ltd', date: 'Jun 05, 2026', amount: '$42,500.00', status: 'Approved', badge: 'badge-success' },
  { id: 'RFQ-2026-0040', title: 'Cloud Server Migration', vendor: 'NetScale Solutions', date: 'Jun 04, 2026', amount: '$18,900.00', status: 'Pending Review', badge: 'badge-warning' },
  { id: 'RFQ-2026-0039', title: 'Office Refurbishment', vendor: 'Habitat Crafts', date: 'Jun 02, 2026', amount: '$12,300.00', status: 'Draft', badge: 'badge-info' },
  { id: 'RFQ-2026-0038', title: 'Forklift Maintenance', vendor: 'Titan Heavy Machinery', date: 'May 30, 2026', amount: '$8,400.00', status: 'Approved', badge: 'badge-success' },
  { id: 'RFQ-2026-0037', title: 'Warehouse Sensors', vendor: 'IoT Tech Corp', date: 'May 28, 2026', amount: '$29,000.00', status: 'Declined', badge: 'badge-danger' },
];

const Dashboard = () => {
  return (
    <div className="d-flex flex-column gap-4">
      {/* Page Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
        <div>
          <h1 className="h3 mb-1 text-white fw-bold">Enterprise Overview</h1>
          <p className="text-secondary small">Real-time indicators, active RFQs, and procurement operations.</p>
        </div>
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-secondary btn-sm d-flex align-items-center gap-2">
            <FiClock /> Activity Log
          </button>
          <button type="button" className="btn btn-primary btn-sm">
            Create RFQ
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="row g-4">
        {/* Metric 1 */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card h-100 p-4">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className="text-secondary small fw-medium">Active Vendors</div>
              <div className="bg-primary bg-opacity-10 p-2 rounded-3 border border-primary border-opacity-25">
                <FiUsers className="text-primary" size={20} />
              </div>
            </div>
            <div className="fs-3 fw-bold text-white mb-2">142</div>
            <div className="d-flex align-items-center gap-1.5 small">
              <span className="text-success fw-medium d-flex align-items-center gap-0.5">
                <FiArrowUpRight /> +12.4%
              </span>
              <span className="text-muted">vs last month</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card h-100 p-4">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className="text-secondary small fw-medium">Open RFQs</div>
              <div className="bg-success bg-opacity-10 p-2 rounded-3 border border-success border-opacity-25">
                <FiFileText className="text-success" size={20} />
              </div>
            </div>
            <div className="fs-3 fw-bold text-white mb-2">28</div>
            <div className="d-flex align-items-center gap-1.5 small">
              <span className="text-success fw-medium d-flex align-items-center gap-0.5">
                <FiArrowUpRight /> +4
              </span>
              <span className="text-muted">since yesterday</span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card h-100 p-4">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className="text-secondary small fw-medium">Total Spent</div>
              <div className="bg-info bg-opacity-10 p-2 rounded-3 border border-info border-opacity-25">
                <FiDollarSign className="text-info" size={20} />
              </div>
            </div>
            <div className="fs-3 fw-bold text-white mb-2">$382,400</div>
            <div className="d-flex align-items-center gap-1.5 small">
              <span className="text-success fw-medium d-flex align-items-center gap-0.5">
                <FiArrowUpRight /> +8.4%
              </span>
              <span className="text-muted">quarter-to-quarter</span>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card h-100 p-4">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className="text-secondary small fw-medium">Compliance Rate</div>
              <div className="bg-warning bg-opacity-10 p-2 rounded-3 border border-warning border-opacity-25">
                <FiShield className="text-warning" size={20} />
              </div>
            </div>
            <div className="fs-3 fw-bold text-white mb-2">98.6%</div>
            <div className="d-flex align-items-center gap-1.5 small">
              <span className="text-success fw-medium d-flex align-items-center gap-0.5">
                <FiArrowUpRight /> +1.2%
              </span>
              <span className="text-muted">audit standard</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="row g-4">
        {/* Main Chart Area */}
        <div className="col-12 col-xl-8">
          <div className="card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h5 className="text-white mb-1 fw-semibold">Procurement Trend</h5>
                <p className="text-secondary extra-small mb-0">RFQ issuance vs final billing value (in thousands)</p>
              </div>
              <select className="form-select form-select-sm bg-secondary border-color text-white" style={{ width: '120px' }}>
                <option value="6">Last 6 Months</option>
                <option value="12">Last 12 Months</option>
              </select>
            </div>
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={mockSpendingData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRfq" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                    labelStyle={{ fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="rfqValue" name="RFQ Volume" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRfq)" />
                  <Area type="monotone" dataKey="spent" name="Spent Value" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorSpent)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Secondary Category Distribution Chart */}
        <div className="col-12 col-xl-4">
          <div className="card p-4 h-100">
            <h5 className="text-white mb-4 fw-semibold">Allocation by Sector</h5>
            <div style={{ width: '100%', height: '200px' }} className="mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockCategoryData} layout="vertical" barSize={12}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} />
                  <XAxis type="number" stroke="#94a3b8" fontSize={10} hide />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} tickLine={false} width={80} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                  />
                  <Bar dataKey="value" name="Allocated ($k)">
                    {mockCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Custom Legends list */}
            <div className="d-flex flex-column gap-2.5">
              {mockCategoryData.map((item) => (
                <div key={item.name} className="d-flex align-items-center justify-content-between border-bottom border-light pb-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="d-inline-block rounded-circle" style={{ width: '8px', height: '8px', backgroundColor: item.color }}></span>
                    <span className="text-secondary small">{item.name}</span>
                  </div>
                  <span className="text-white small fw-semibold">${item.value}k</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recents Activity Table Card */}
      <div className="card p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h5 className="text-white mb-1 fw-semibold">Recent Quotations & RFQs</h5>
            <p className="text-secondary extra-small mb-0">Overview of recent submissions and process status.</p>
          </div>
          <button type="button" className="btn btn-secondary btn-sm d-flex align-items-center gap-1.5">
            View All <FiExternalLink />
          </button>
        </div>

        <div className="table-responsive border-0">
          <table className="table custom-table text-nowrap align-middle">
            <thead>
              <tr>
                <th scope="col">RFQ Reference</th>
                <th scope="col">Subject</th>
                <th scope="col">Vendor</th>
                <th scope="col">Date Created</th>
                <th scope="col">Est. Value</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockRecentTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td>
                    <a href={`#rfq-details-${tx.id}`} className="text-primary fw-medium text-decoration-none">{tx.id}</a>
                  </td>
                  <td className="fw-medium text-white">{tx.title}</td>
                  <td>{tx.vendor}</td>
                  <td className="text-secondary small">{tx.date}</td>
                  <td className="fw-bold">{tx.amount}</td>
                  <td>
                    <span className={`badge-status ${tx.badge}`}>
                      {tx.status}
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

export default Dashboard;
