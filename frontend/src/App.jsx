import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Vendors from './pages/Vendors';
import RFQs from './pages/RFQs';
import Quotations from './pages/Quotations';
import Approvals from './pages/Approvals';
import PurchaseOrders from './pages/PurchaseOrders';
import Invoices from './pages/Invoices';
import Reports from './pages/Reports';
import ActivityLogs from './pages/ActivityLogs';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Wrap all dashboard routes under the main layout */}
        <Route path="/" element={<DashboardLayout />}>
          {/* Redirect index path to /dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          {/* Sub-routes */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="vendors" element={<Vendors />} />
          <Route path="rfqs" element={<RFQs />} />
          <Route path="quotations" element={<Quotations />} />
          <Route path="approvals" element={<Approvals />} />
          <Route path="purchase-orders" element={<PurchaseOrders />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="reports" element={<Reports />} />
          <Route path="logs" element={<ActivityLogs />} />
          
          {/* Catch-all fallback inside layout */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
