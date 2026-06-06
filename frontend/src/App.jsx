import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
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
import Signup from './pages/Signup';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Dashboard Panel Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            {/* Redirect root URL to /dashboard. ProtectedRoute will auto-route users based on role permissions */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            
            {/* Dashboard Children Views with role guards */}
            <Route path="dashboard" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="vendors" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Vendors />
              </ProtectedRoute>
            } />
            <Route path="rfqs" element={
              <ProtectedRoute allowedRoles={['VENDOR', 'PROCUREMENT_OFFICER']}>
                <RFQs />
              </ProtectedRoute>
            } />
            <Route path="quotations" element={
              <ProtectedRoute allowedRoles={['VENDOR', 'PROCUREMENT_OFFICER']}>
                <Quotations />
              </ProtectedRoute>
            } />
            <Route path="approvals" element={
              <ProtectedRoute allowedRoles={['MANAGER']}>
                <Approvals />
              </ProtectedRoute>
            } />
            <Route path="purchase-orders" element={
              <ProtectedRoute allowedRoles={['VENDOR', 'PROCUREMENT_OFFICER']}>
                <PurchaseOrders />
              </ProtectedRoute>
            } />
            <Route path="invoices" element={
              <ProtectedRoute allowedRoles={['PROCUREMENT_OFFICER']}>
                <Invoices />
              </ProtectedRoute>
            } />
            <Route path="reports" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                <Reports />
              </ProtectedRoute>
            } />
            <Route path="activity" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <ActivityLogs />
              </ProtectedRoute>
            } />
            
            {/* Fallback route within dashboard layout */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
