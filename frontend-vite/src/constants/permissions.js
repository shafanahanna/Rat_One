/**
 * Standard permission IDs used across the application
 * This should match the backend permissions.ts file
 */
export const PERMISSIONS = {
  // Admin access
  ADMIN: 'admin',
  
  // Dashboard
  DASHBOARD_VIEW: 'dashboard',
  
  // User management
  USERS_VIEW: 'users',
  USERS_CREATE: 'users.create',
  USERS_EDIT: 'users.edit',
  USERS_DELETE: 'users.delete',
  
  // Role management
  ROLES_VIEW: 'roles',
  ROLES_CREATE: 'roles.create',
  ROLES_EDIT: 'roles.edit',
  ROLES_DELETE: 'roles.delete',
  
  // Settings
  SETTINGS_VIEW: 'settings',
  SETTINGS_EDIT: 'settings.edit',
  
  // HR module
  HR_ACCESS: 'hr',
  EMPLOYEES_MANAGE: 'employees',
  ATTENDANCE_MANAGE: 'attendance',
  PAYROLL_MANAGE: 'payroll',
  LEAVE_MANAGE: 'leave'
};

/**
 * Permission descriptions for UI display
 */
export const PERMISSION_DESCRIPTIONS = {
  [PERMISSIONS.ADMIN]: 'Full system access',
  [PERMISSIONS.DASHBOARD_VIEW]: 'View dashboard',
  [PERMISSIONS.USERS_VIEW]: 'View users',
  [PERMISSIONS.USERS_CREATE]: 'Create users',
  [PERMISSIONS.USERS_EDIT]: 'Edit users',
  [PERMISSIONS.USERS_DELETE]: 'Delete users',
  [PERMISSIONS.ROLES_VIEW]: 'View roles',
  [PERMISSIONS.ROLES_CREATE]: 'Create roles',
  [PERMISSIONS.ROLES_EDIT]: 'Edit roles',
  [PERMISSIONS.ROLES_DELETE]: 'Delete roles',
  [PERMISSIONS.SETTINGS_VIEW]: 'View settings',
  [PERMISSIONS.SETTINGS_EDIT]: 'Edit settings',
  [PERMISSIONS.HR_ACCESS]: 'HR Access',
  [PERMISSIONS.EMPLOYEES_MANAGE]: 'Employee Management',
  [PERMISSIONS.ATTENDANCE_MANAGE]: 'Attendance Management',
  [PERMISSIONS.PAYROLL_MANAGE]: 'Payroll Management',
  [PERMISSIONS.LEAVE_MANAGE]: 'Leave Management'
};

/**
 * Permission UI display data
 */
export const PERMISSION_UI = [
  { 
    id: PERMISSIONS.ADMIN, 
    label: 'Admin Access', 
    description: 'Full system access (grants all permissions)'
  },
  { 
    id: PERMISSIONS.DASHBOARD_VIEW, 
    label: 'Dashboard', 
    description: 'Access to dashboard'
  },
  { 
    id: PERMISSIONS.USERS_VIEW, 
    label: 'User Management', 
    description: 'View and manage users'
  },
  { 
    id: PERMISSIONS.SETTINGS_VIEW, 
    label: 'Settings', 
    description: 'Access system settings'
  },
  { 
    id: PERMISSIONS.HR_ACCESS, 
    label: 'HR Access', 
    description: 'Access HR module'
  },
  { 
    id: PERMISSIONS.EMPLOYEES_MANAGE, 
    label: 'Employee Management', 
    description: 'Manage employees'
  },
  { 
    id: PERMISSIONS.ATTENDANCE_MANAGE, 
    label: 'Attendance Management', 
    description: 'Manage attendance'
  },
  { 
    id: PERMISSIONS.PAYROLL_MANAGE, 
    label: 'Payroll', 
    description: 'Access payroll functions'
  },
  { 
    id: PERMISSIONS.LEAVE_MANAGE, 
    label: 'Leave Management', 
    description: 'Manage leave requests'
  }
];
