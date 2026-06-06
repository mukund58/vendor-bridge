export const mockDashboardData = {
  kpis: [
    { id: 'vendors', label: 'Active Vendors', value: '142', change: '+12.4%', up: true, subtitle: 'vs last month' },
    { id: 'rfqs', label: 'Active RFQs', value: '28', change: '+4.8%', up: true, subtitle: 'vs last week' },
    { id: 'approvals', label: 'Pending Approvals', value: '7', change: '-2.1%', up: false, subtitle: 'vs yesterday' },
    { id: 'pos', label: 'Purchase Orders', value: '84', change: '+15.2%', up: true, subtitle: 'this quarter' },
    { id: 'invoices', label: 'Active Invoices', value: '36', change: '+8.1%', up: true, subtitle: 'awaiting payment' },
    { id: 'spend', label: 'Total Spend', value: '$1.24M', change: '+18.7%', up: true, subtitle: 'year-to-date' },
  ],
  spendingTrend: [
    { month: 'Jan', amount: 84000, orders: 12 },
    { month: 'Feb', amount: 96000, orders: 15 },
    { month: 'Mar', amount: 145000, orders: 22 },
    { month: 'Apr', amount: 112000, orders: 19 },
    { month: 'May', amount: 198000, orders: 27 },
    { month: 'Jun', amount: 242000, orders: 34 },
  ],
  vendorPerformance: [
    { name: 'Apex Metals', compliance: 98, delivery: 95, quality: 97 },
    { name: 'NetScale Sol.', compliance: 92, delivery: 89, quality: 94 },
    { name: 'Titan Heavy', compliance: 94, delivery: 91, quality: 93 },
    { name: 'Habitat Crafts', compliance: 86, delivery: 88, quality: 85 },
    { name: 'Global Logistics', compliance: 90, delivery: 92, quality: 88 },
  ],
  recentRfqs: [
    { id: 'RFQ-2026-0041', title: 'Raw Steel Sheets', buyer: 'Sarah J.', date: 'Jun 06, 2026', bids: 3, status: 'Active', badge: 'badge-success' },
    { id: 'RFQ-2026-0040', title: 'IT Servers & Racks', buyer: 'Sarah J.', date: 'Jun 05, 2026', bids: 5, status: 'Active', badge: 'badge-success' },
    { id: 'RFQ-2026-0039', title: 'Warehouse Forklifts', buyer: 'Marcus C.', date: 'Jun 04, 2026', bids: 2, status: 'Under Review', badge: 'badge-warning' },
    { id: 'RFQ-2026-0038', title: 'Office Ventilation', buyer: 'Emily R.', date: 'Jun 02, 2026', bids: 0, status: 'Draft', badge: 'badge-info' },
  ],
  recentPOs: [
    { id: 'PO-2026-1029', vendor: 'Apex Metals Ltd', date: 'Jun 05, 2026', amount: '$42,500.00', status: 'In Transit', badge: 'badge-info' },
    { id: 'PO-2026-1028', vendor: 'Titan Heavy Machinery', date: 'May 30, 2026', amount: '$115,000.00', status: 'Delivered', badge: 'badge-success' },
    { id: 'PO-2026-1027', vendor: 'NetScale Solutions', date: 'May 28, 2026', amount: '$18,900.00', status: 'Acknowledged', badge: 'badge-warning' },
    { id: 'PO-2026-1026', vendor: 'Habitat Crafts', date: 'May 25, 2026', amount: '$12,300.00', status: 'Cancelled', badge: 'badge-danger' },
  ],
  pendingApprovals: [
    { id: 'APP-0091', requester: 'Sarah Jenkins', type: 'Purchase Order', subject: 'Server Infrastructure Migration', amount: '$18,900.00' },
    { id: 'APP-0092', requester: 'Marcus Cole', type: 'Vendor Onboarding', subject: 'Global Logistics Inc', amount: 'N/A' },
    { id: 'APP-0093', requester: 'Emily Ross', type: 'Contract Renewal', subject: 'Apex Steel Materials', amount: '$85,000.00' },
  ],
  activities: [
    { time: '10 mins ago', type: 'info', user: 'Sarah Jenkins', action: 'dispatched Purchase Order PO-2026-1029' },
    { time: '1 hr ago', type: 'success', user: 'System Agent', action: 'auto-promoted Apex Metals compliance score to 98%' },
    { time: '3 hrs ago', type: 'warning', user: 'Marcus Cole', action: 'flagged Global Logistics billing variance (+4.2%)' },
    { time: '1 day ago', type: 'danger', user: 'Emily Ross', action: 'rejected low-score bid QTN-4170 from supplier Habitat' },
  ]
};
