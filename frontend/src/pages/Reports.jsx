import { useState, useEffect } from 'react';
import { mockDashboardData } from '../data/mockDashboardData';
import { 
  FiDownload, 
  FiCalendar, 
  FiDollarSign, 
  FiUsers, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiSearch, 
  FiTrendingUp, 
  FiRefreshCw 
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
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import './Reports.css';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

// Custom Pie Chart tooltip (declared outside of render to prevent hooks lint warning)
const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 border border-light rounded bg-slate-900 text-white" style={{ backgroundColor: '#0f172a', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <p className="mb-0 small fw-bold">{payload[0].name}</p>
        <p className="mb-0 small text-primary">${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const Reports = () => {
  const { reportsSummary, spendingTrend, vendorPerformance, spendingDistribution } = mockDashboardData;

  // Filter & Form States
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-06-30');
  const [datePreset, setDatePreset] = useState('H1'); // H1, Q2, YTD, CUSTOM
  const [searchTerm, setSearchTerm] = useState('');
  
  // Simulated Toast Feedback
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [exporting, setExporting] = useState(null); // 'pdf' or 'excel' or null

  // Triggered when date filter updates - logs the endpoint parameters
  useEffect(() => {
    console.log(`Axios GET /reports/summary?startDate=${startDate}&endDate=${endDate}`);
    console.log(`Axios GET /reports/vendors?startDate=${startDate}&endDate=${endDate}`);
    console.log(`Axios GET /reports/monthly-trend?startDate=${startDate}&endDate=${endDate}`);
  }, [startDate, endDate]);

  const handlePresetChange = (preset) => {
    setDatePreset(preset);
    if (preset === 'Q2') {
      setStartDate('2026-04-01');
      setEndDate('2026-06-30');
    } else if (preset === 'H1') {
      setStartDate('2026-01-01');
      setEndDate('2026-06-30');
    } else if (preset === 'YTD') {
      setStartDate('2026-01-01');
      setEndDate('2026-12-31');
    }
  };

  const triggerExport = (format) => {
    setExporting(format);
    const endpoint = `/reports/export?format=${format}`;
    console.log(`Axios GET ${endpoint} initiated.`);
    
    setTimeout(() => {
      setExporting(null);
      setToastMessage(`Export Successful! Generated and downloaded report in ${format.toUpperCase()} format.`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }, 1200);
  };

  const handleResetFilters = () => {
    setStartDate('2026-01-01');
    setEndDate('2026-06-30');
    setDatePreset('H1');
    setSearchTerm('');
    setToastMessage('Filters and Date Range reset to default.');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Filter vendors in local state based on Search
  const filteredVendors = vendorPerformance.filter(vendor => 
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );



  return (
    <div className="d-flex flex-column gap-4">
      {/* Title Header Section */}
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3">
        <div>
          <h1 className="h3 mb-1 text-white fw-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-secondary small mb-0">Review procurement KPI summaries, monitor spending trends, and audit vendor performance metrics.</p>
        </div>
        <div className="d-flex gap-2">
          <button 
            type="button" 
            className="btn btn-secondary btn-sm d-flex align-items-center gap-2 px-3 py-2 fw-medium"
            onClick={() => triggerExport('pdf')}
            disabled={exporting !== null}
          >
            {exporting === 'pdf' ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
            ) : (
              <FiDownload />
            )}
            Export PDF
          </button>
          <button 
            type="button" 
            className="btn btn-primary btn-sm d-flex align-items-center gap-2 px-3 py-2 fw-medium"
            onClick={() => triggerExport('excel')}
            disabled={exporting !== null}
          >
            {exporting === 'excel' ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
            ) : (
              <FiDownload />
            )}
            Export Excel
          </button>
        </div>
      </div>

      {/* Date & Search Filters Panel */}
      <div className="card p-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3">
          {/* Preset Buttons */}
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <span className="text-secondary small fw-medium me-1">Range:</span>
            <button 
              type="button" 
              className={`btn-preset ${datePreset === 'Q2' ? 'active' : ''}`}
              onClick={() => handlePresetChange('Q2')}
            >
              Q2 (Apr - Jun)
            </button>
            <button 
              type="button" 
              className={`btn-preset ${datePreset === 'H1' ? 'active' : ''}`}
              onClick={() => handlePresetChange('H1')}
            >
              H1 (Jan - Jun)
            </button>
            <button 
              type="button" 
              className={`btn-preset ${datePreset === 'YTD' ? 'active' : ''}`}
              onClick={() => handlePresetChange('YTD')}
            >
              Year to Date (YTD)
            </button>
          </div>

          {/* Date Picker Range Inputs */}
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <div className="d-flex align-items-center gap-2">
              <FiCalendar className="text-muted" size={15} />
              <input 
                type="date" 
                className="date-input-custom" 
                value={startDate} 
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setDatePreset('CUSTOM');
                }}
              />
              <span className="text-secondary small">to</span>
              <input 
                type="date" 
                className="date-input-custom" 
                value={endDate} 
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setDatePreset('CUSTOM');
                }}
              />
            </div>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm p-2 d-flex align-items-center justify-content-center"
              onClick={handleResetFilters}
              title="Reset Filters"
            >
              <FiRefreshCw size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 4 KPI summary cards aligned with GET /reports/summary */}
      <div className="row g-4">
        {/* KPI: Total Spend */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card h-100 p-4 border-0 border-start border-4 border-start-blue reports-kpi-card">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-secondary small fw-medium">Total Spend</span>
              <div className="p-2 rounded bg-opacity-10 text-primary bg-primary">
                <FiDollarSign size={18} />
              </div>
            </div>
            <h3 className="text-white fw-bold mb-1">${reportsSummary.totalSpend.toLocaleString()}</h3>
            <span className="text-muted extra-small d-flex align-items-center gap-1">
              <FiTrendingUp className="text-success" /> +14.2% YTD budget aggregate
            </span>
          </div>
        </div>

        {/* KPI: Active Vendors */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card h-100 p-4 border-0 border-start border-4 border-start-green reports-kpi-card">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-secondary small fw-medium">Active Vendors</span>
              <div className="p-2 rounded bg-opacity-10 text-success bg-success">
                <FiUsers size={18} />
              </div>
            </div>
            <h3 className="text-white fw-bold mb-1">{reportsSummary.activeVendors}</h3>
            <span className="text-muted extra-small">Suppliers currently under active POs</span>
          </div>
        </div>

        {/* KPI: PO Fulfillment */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card h-100 p-4 border-0 border-start border-4 border-start-orange reports-kpi-card">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-secondary small fw-medium">PO Fulfillment</span>
              <div className="p-2 rounded bg-opacity-10 text-warning bg-warning">
                <FiCheckCircle size={18} />
              </div>
            </div>
            <h3 className="text-white fw-bold mb-1">{reportsSummary.poFulfillment}%</h3>
            <span className="text-muted extra-small">Average contract delivery accuracy</span>
          </div>
        </div>

        {/* KPI: Overdue Invoices */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card h-100 p-4 border-0 border-start border-4 border-start-cyan reports-kpi-card">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-secondary small fw-medium">Overdue Invoices</span>
              <div className="p-2 rounded bg-opacity-10 text-info bg-info">
                <FiAlertCircle size={18} />
              </div>
            </div>
            <h3 className="text-white fw-bold mb-1">{reportsSummary.overdueInvoices}</h3>
            <span className="text-danger extra-small fw-semibold">Requires immediate review</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="row g-4">
        {/* Monthly Procurement Trend (Line Chart) */}
        <div className="col-12 col-xl-8">
          <div className="card p-4 h-100 chart-container-card">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h5 className="text-white mb-1 fw-semibold fs-6">Monthly Procurement Trend</h5>
                <p className="text-secondary extra-small mb-0">Total volume of purchase orders generated month-on-month</p>
              </div>
              <span className="badge-status badge-info">GET /reports/monthly-trend</span>
            </div>
            <div style={{ width: '100%', height: '320px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={spendingTrend} margin={{ top: 10, right: 20, left: -5, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                    formatter={(val) => [`$${val.toLocaleString()}`, 'Total Spent']}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Line 
                    name="Spent Amount ($)" 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    dot={{ r: 4, stroke: '#3b82f6', strokeWidth: 2, fill: '#090d16' }} 
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Spending Distribution (Pie Chart) */}
        <div className="col-12 col-xl-4">
          <div className="card p-4 h-100 chart-container-card">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h5 className="text-white mb-1 fw-semibold fs-6">Spending Distribution</h5>
                <p className="text-secondary extra-small mb-0">Aggregates classified by product category</p>
              </div>
              <span className="badge-status badge-success">Category-wise</span>
            </div>
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ width: '100%', height: '320px' }}>
              <ResponsiveContainer width="100%" height="70%">
                <PieChart>
                  <Pie
                    data={spendingDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {spendingDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Custom Legend */}
              <div className="d-flex flex-wrap justify-content-center gap-3 mt-2">
                {spendingDistribution.map((entry, idx) => (
                  <div key={entry.name} className="d-flex align-items-center gap-1.5 extra-small">
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="text-secondary">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vendor Performance Analytics (Bar Chart) */}
      <div className="card p-4 chart-container-card">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h5 className="text-white mb-1 fw-semibold fs-6">Vendor Performance Analytics</h5>
            <p className="text-secondary extra-small mb-0">Detailed review of active supplier scorecards (Compliance, Delivery speed, and Quality assurance)</p>
          </div>
          <span className="badge-status badge-warning">GET /reports/vendors</span>
        </div>
        <div style={{ width: '100%', height: '340px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={vendorPerformance} margin={{ top: 10, right: 20, left: -5, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                formatter={(val) => [`${val}%`]}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Bar name="Compliance Score" dataKey="compliance" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar name="Delivery Performance" dataKey="delivery" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar name="Quality Index" dataKey="quality" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Procurement Statistics Table & Vendor Analytics Directory */}
      <div className="row g-4">
        {/* Statistics & Spending Summaries */}
        <div className="col-12 col-lg-5">
          <div className="card p-4 h-100">
            <h5 className="text-white mb-3 fw-semibold fs-6">Procurement Statistics</h5>
            <p className="text-secondary small mb-4">A summary of the cycle KPIs and automated validations metrics.</p>

            <div className="d-flex flex-column gap-3">
              {[
                { label: 'Average RFQ Response Time', value: '4.8 Days', type: 'info' },
                { label: 'Invoice Match Accuracy (Odoo)', value: '98.2%', type: 'success' },
                { label: 'Late Delivery Incidence Rate', value: '2.4%', type: 'danger' },
                { label: 'Active Service Contracts Count', value: '18 Active', type: 'success' },
                { label: 'Average Quotations Per RFQ', value: '4.2 Bids', type: 'info' }
              ].map((stat, i) => (
                <div key={i} className="d-flex justify-content-between align-items-center p-3 rounded bg-secondary border border-light">
                  <span className="text-secondary small fw-medium">{stat.label}</span>
                  <span className={`badge-status badge-${stat.type} fw-bold`}>
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vendor Analytics Performance directory */}
        <div className="col-12 col-lg-7">
          <div className="card p-4 h-100">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-stretch align-items-sm-center gap-3 mb-3">
              <div>
                <h5 className="text-white mb-0 fw-semibold fs-6">Vendor Performance Scorecard</h5>
                <p className="text-secondary extra-small mb-0">On-time metrics audit directory</p>
              </div>
              
              {/* Local Search input */}
              <div className="d-flex align-items-center bg-secondary px-3 py-1.5 rounded-3 border border-light" style={{ maxWidth: '280px' }}>
                <FiSearch className="text-muted me-2" size={14} />
                <input 
                  type="text" 
                  className="bg-transparent border-0 text-white w-100 fs-7 outline-none" 
                  placeholder="Search supplier..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="table-responsive border-0">
              <table className="table custom-table text-nowrap align-middle">
                <thead>
                  <tr>
                    <th scope="col">Vendor</th>
                    <th scope="col">Compliance</th>
                    <th scope="col">Delivery</th>
                    <th scope="col">Quality</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVendors.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-4 text-secondary">
                        No vendor records matched.
                      </td>
                    </tr>
                  ) : (
                    filteredVendors.map((vendor, index) => (
                      <tr key={index}>
                        <td className="fw-semibold text-white small">{vendor.name}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="progress-dark w-100" style={{ maxWidth: '60px' }}>
                              <div className="progress-dark-bar progress-blue" style={{ width: `${vendor.compliance}%` }} />
                            </div>
                            <span className="small fw-semibold">{vendor.compliance}%</span>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="progress-dark w-100" style={{ maxWidth: '60px' }}>
                              <div className="progress-dark-bar progress-green" style={{ width: `${vendor.delivery}%` }} />
                            </div>
                            <span className="small fw-semibold">{vendor.delivery}%</span>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="progress-dark w-100" style={{ maxWidth: '60px' }}>
                              <div className="progress-dark-bar progress-orange" style={{ width: `${vendor.quality}%` }} />
                            </div>
                            <span className="small fw-semibold">{vendor.quality}%</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Simulated Export Action Feedback toast */}
      {showToast && (
        <div className="toast-feedback p-3 d-flex align-items-center gap-2">
          <FiCheckCircle className="text-success" size={18} />
          <span className="small">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default Reports;
