/**
 * Standard permission IDs used across the application
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
 * Group permissions by module for UI organization
 */
export const PERMISSION_MODULES = {
  'Admin': [PERMISSIONS.ADMIN],
  'Dashboard': [PERMISSIONS.DASHBOARD_VIEW],
  'Users': [PERMISSIONS.USERS_VIEW, PERMISSIONS.USERS_CREATE, PERMISSIONS.USERS_EDIT, PERMISSIONS.USERS_DELETE],
  'Roles': [PERMISSIONS.ROLES_VIEW, PERMISSIONS.ROLES_CREATE, PERMISSIONS.ROLES_EDIT, PERMISSIONS.ROLES_DELETE],
  'Settings': [PERMISSIONS.SETTINGS_VIEW, PERMISSIONS.SETTINGS_EDIT],
  'HR': [
    PERMISSIONS.HR_ACCESS, 
    PERMISSIONS.EMPLOYEES_MANAGE, 
    PERMISSIONS.ATTENDANCE_MANAGE, 
    PERMISSIONS.PAYROLL_MANAGE, 
    PERMISSIONS.LEAVE_MANAGE
  ]
};
