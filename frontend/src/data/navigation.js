import { 
  FiHome, 
  FiUsers, 
  FiFileText, 
  FiDollarSign, 
  FiCheckSquare, 
  FiShoppingBag, 
  FiTrendingUp, 
  FiActivity 
} from 'react-icons/fi';

export const navigationItems = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: FiHome,
  },
  {
    name: 'Vendor Management',
    path: '/vendors',
    icon: FiUsers,
  },
  {
    name: 'RFQs',
    path: '/rfqs',
    icon: FiFileText,
  },
  {
    name: 'Quotations',
    path: '/quotations',
    icon: FiDollarSign,
  },
  {
    name: 'Approvals',
    path: '/approvals',
    icon: FiCheckSquare,
  },
  {
    name: 'Purchase Orders',
    path: '/purchase-orders',
    icon: FiShoppingBag,
  },
  {
    name: 'Invoices',
    path: '/invoices',
    icon: FiDollarSign,
  },
  {
    name: 'Reports',
    path: '/reports',
    icon: FiTrendingUp,
  },
  {
    name: 'Activity Logs',
    path: '/activity',
    icon: FiActivity,
  },
];
