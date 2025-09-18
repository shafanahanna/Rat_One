import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Designation } from './entities/designation.entity';

// Copy the constants from auth/constants/permissions.ts
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

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Designation)
    private designationRepository: Repository<Designation>,
  ) {}

  /**
   * Get all available permissions
   */
  getAllPermissions() {
    const permissions = [];
    
    // Process each module and its permissions
    Object.entries(PERMISSION_MODULES).forEach(([moduleName, permissionIds]) => {
      permissionIds.forEach(permissionId => {
        permissions.push({
          id: permissionId,
          name: permissionId,
          description: PERMISSION_DESCRIPTIONS[permissionId] || permissionId,
          module: moduleName
        });
      });
    });
    
    return permissions;
  }
  
  /**
   * Get permissions by module
   */
  getPermissionsByModule() {
    const permissionsByModule = {};
    
    Object.entries(PERMISSION_MODULES).forEach(([moduleName, permissionIds]) => {
      permissionsByModule[moduleName] = permissionIds.map(permissionId => ({
        id: permissionId,
        name: permissionId,
        description: PERMISSION_DESCRIPTIONS[permissionId] || permissionId
      }));
    });
    
    return permissionsByModule;
  }
  
  /**
   * Check if a user has a specific permission based on their designation
   */
  async hasPermission(designationId: string, requiredPermission: string): Promise<boolean> {
    try {
      // Find the designation
      const designation = await this.designationRepository.findOne({
        where: { id: designationId }
      });
      
      if (!designation) {
        return false;
      }
      
      // Check if the designation has the admin permission
      if (designation.permissions && designation.permissions.includes('admin')) {
        return true;
      }
      
      // Check if the designation has the required permission
      return designation.permissions && designation.permissions.includes(requiredPermission);
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  }
}
