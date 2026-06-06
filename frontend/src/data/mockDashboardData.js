// Aligned with backend API responses and DB Schemas defined in README
export const mockDashboardData = {
  // GET /dashboard payload
  dashboardSummary: {
    activeRfqs: 12,
    pendingApprovals: 5,
    monthlySpend: 230000,
    overdueInvoices: 3,
    recentPurchaseOrders: [
      { id: 1, po_number: 'PO-2026-1029', vendor_name: 'Apex Metals Ltd', amount: 42500, created_at: '2026-06-05T10:00:00Z', status: 'IN_TRANSIT' },
      { id: 2, po_number: 'PO-2026-1028', vendor_name: 'Titan Heavy Machinery', amount: 115000, created_at: '2026-05-30T14:15:00Z', status: 'DELIVERED' },
      { id: 3, po_number: 'PO-2026-1027', vendor_name: 'NetScale Solutions', amount: 18900, created_at: '2026-05-28T09:30:00Z', status: 'ACKNOWLEDGED' },
      { id: 4, po_number: 'PO-2026-1026', vendor_name: 'Habitat Crafts', amount: 12300, created_at: '2026-05-25T16:45:00Z', status: 'CANCELLED' }
    ]
  },
  
  // GET /reports/summary
  reportsSummary: {
    totalSpend: 1240000,
    activeVendors: 28,
    poFulfillment: 94,
    overdueInvoices: 3
  },
  
  // GET /reports/monthly-trend
  spendingTrend: [
    { month: 'Jan', amount: 84000 },
    { month: 'Feb', amount: 96000 },
    { month: 'Mar', amount: 145000 },
    { month: 'Apr', amount: 112000 },
    { month: 'May', amount: 198000 },
    { month: 'Jun', amount: 230000 } // matched to monthlySpend in summary (230000)
  ],

  // GET /reports/vendors
  vendorPerformance: [
    { name: 'Apex Metals', compliance: 98, delivery: 95, quality: 97 },
    { name: 'NetScale Sol.', compliance: 92, delivery: 89, quality: 94 },
    { name: 'Titan Heavy', compliance: 94, delivery: 91, quality: 93 },
    { name: 'Habitat Crafts', compliance: 86, delivery: 88, quality: 85 },
    { name: 'Global Logistics', compliance: 90, delivery: 92, quality: 88 }
  ],

  // GET /reports/spending-distribution (Pie Chart)
  spendingDistribution: [
    { name: 'Raw Materials', value: 540000 },
    { name: 'IT Solutions', value: 380000 },
    { name: 'Heavy Equipment', value: 210000 },
    { name: 'Logistics', value: 110000 }
  ],
  
  // GET /rfqs
  recentRfqs: [
    { id: 1, title: 'Raw Steel Sheet Coils', category: 'Raw Materials', description: 'Grade A coils', deadline: '2026-06-15', submissions: 3, status: 'Active' },
    { id: 2, title: 'Cloud server hardware racks', category: 'IT Solutions', description: 'Power racks', deadline: '2026-06-18', submissions: 1, status: 'Pending Review' },
    { id: 3, title: 'Warehouse Forklifts replacement', category: 'Heavy Equipment', description: 'Dual fork lifts', deadline: '2026-06-25', submissions: 0, status: 'Draft' }
  ],

  // GET /approvals/pending
  pendingApprovals: [
    { id: 1, requester: 'Sarah Jenkins', type: 'Purchase Order', subject: 'Server Infrastructure Migration', amount: '$18,900.00' },
    { id: 2, requester: 'Marcus Cole', type: 'Vendor Onboarding', subject: 'Global Logistics Inc', amount: 'N/A' },
    { id: 3, requester: 'Emily Ross', type: 'Contract Renewal', subject: 'Apex Steel Materials', amount: '$85,000.00' }
  ],

  // GET /activities
  activities: [
    { id: 1, action: 'RFQ Published', timestamp: '2026-06-06T10:19:00Z', type: 'info', user: 'Sarah Jenkins' },
    { id: 2, action: 'Vendor Approved', timestamp: '2026-06-05T14:15:00Z', type: 'success', user: 'System Agent' },
    { id: 3, action: 'Invoice Flagged', timestamp: '2026-06-05T11:30:00Z', type: 'warning', user: 'Marcus Cole' },
    { id: 4, action: 'Bid Rejected', timestamp: '2026-06-04T16:50:00Z', type: 'danger', user: 'Emily Ross' }
  ]
};
