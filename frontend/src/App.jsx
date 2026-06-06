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
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Standalone Login Route (separate from dashboard layout) */}
        <Route path="/login" element={<Login />} />
        
        {/* Main Dashboard Panel Layout */}
        <Route path="/" element={<DashboardLayout />}>
          {/* Redirect root URL to /dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          {/* Dashboard Children Views */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="vendors" element={<Vendors />} />
          <Route path="rfqs" element={<RFQs />} />
          <Route path="quotations" element={<Quotations />} />
          <Route path="approvals" element={<Approvals />} />
          <Route path="purchase-orders" element={<PurchaseOrders />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="reports" element={<Reports />} />
          <Route path="activity" element={<ActivityLogs />} />
          
          {/* Fallback route within dashboard layout */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
