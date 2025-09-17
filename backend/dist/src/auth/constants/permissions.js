"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PERMISSION_MODULES = exports.PERMISSION_DESCRIPTIONS = exports.PERMISSIONS = void 0;
exports.PERMISSIONS = {
    ADMIN: 'admin',
    DASHBOARD_VIEW: 'dashboard',
    USERS_VIEW: 'users',
    USERS_CREATE: 'users.create',
    USERS_EDIT: 'users.edit',
    USERS_DELETE: 'users.delete',
    ROLES_VIEW: 'roles',
    ROLES_CREATE: 'roles.create',
    ROLES_EDIT: 'roles.edit',
    ROLES_DELETE: 'roles.delete',
    SETTINGS_VIEW: 'settings',
    SETTINGS_EDIT: 'settings.edit',
    HR_ACCESS: 'hr',
    EMPLOYEES_MANAGE: 'employees',
    ATTENDANCE_MANAGE: 'attendance',
    PAYROLL_MANAGE: 'payroll',
    LEAVE_MANAGE: 'leave'
};
exports.PERMISSION_DESCRIPTIONS = {
    [exports.PERMISSIONS.ADMIN]: 'Full system access',
    [exports.PERMISSIONS.DASHBOARD_VIEW]: 'View dashboard',
    [exports.PERMISSIONS.USERS_VIEW]: 'View users',
    [exports.PERMISSIONS.USERS_CREATE]: 'Create users',
    [exports.PERMISSIONS.USERS_EDIT]: 'Edit users',
    [exports.PERMISSIONS.USERS_DELETE]: 'Delete users',
    [exports.PERMISSIONS.ROLES_VIEW]: 'View roles',
    [exports.PERMISSIONS.ROLES_CREATE]: 'Create roles',
    [exports.PERMISSIONS.ROLES_EDIT]: 'Edit roles',
    [exports.PERMISSIONS.ROLES_DELETE]: 'Delete roles',
    [exports.PERMISSIONS.SETTINGS_VIEW]: 'View settings',
    [exports.PERMISSIONS.SETTINGS_EDIT]: 'Edit settings',
    [exports.PERMISSIONS.HR_ACCESS]: 'HR Access',
    [exports.PERMISSIONS.EMPLOYEES_MANAGE]: 'Employee Management',
    [exports.PERMISSIONS.ATTENDANCE_MANAGE]: 'Attendance Management',
    [exports.PERMISSIONS.PAYROLL_MANAGE]: 'Payroll Management',
    [exports.PERMISSIONS.LEAVE_MANAGE]: 'Leave Management'
};
exports.PERMISSION_MODULES = {
    'Admin': [exports.PERMISSIONS.ADMIN],
    'Dashboard': [exports.PERMISSIONS.DASHBOARD_VIEW],
    'Users': [exports.PERMISSIONS.USERS_VIEW, exports.PERMISSIONS.USERS_CREATE, exports.PERMISSIONS.USERS_EDIT, exports.PERMISSIONS.USERS_DELETE],
    'Roles': [exports.PERMISSIONS.ROLES_VIEW, exports.PERMISSIONS.ROLES_CREATE, exports.PERMISSIONS.ROLES_EDIT, exports.PERMISSIONS.ROLES_DELETE],
    'Settings': [exports.PERMISSIONS.SETTINGS_VIEW, exports.PERMISSIONS.SETTINGS_EDIT],
    'HR': [
        exports.PERMISSIONS.HR_ACCESS,
        exports.PERMISSIONS.EMPLOYEES_MANAGE,
        exports.PERMISSIONS.ATTENDANCE_MANAGE,
        exports.PERMISSIONS.PAYROLL_MANAGE,
        exports.PERMISSIONS.LEAVE_MANAGE
    ]
};
//# sourceMappingURL=permissions.js.map