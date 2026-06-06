// Helper to determine home page based on user role
export const getRoleHomePath = (role) => {
  switch (role) {
    case 'ADMIN':
      return '/dashboard';
    case 'VENDOR':
      return '/quotations';
    case 'MANAGER':
      return '/approvals';
    case 'PROCUREMENT_OFFICER':
      return '/rfqs';
    default:
      return '/dashboard';
  }
};
