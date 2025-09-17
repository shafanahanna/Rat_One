import { Injectable } from '@nestjs/common';
import { PERMISSIONS, PERMISSION_DESCRIPTIONS, PERMISSION_MODULES } from '../constants/permissions';

@Injectable()
export class PermissionsService {
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
   * Check if a user has a specific permission
   */
  async hasPermission(userRole: string, requiredPermission: string, rolesService: any): Promise<boolean> {
    // Admin and Director roles have all permissions
    if (userRole === 'Admin' || userRole === 'Director') {
      return true;
    }
    
    try {
      // Get all roles
      const roles = await rolesService.findAll();
      
      // Find the user's role
      const role = roles.find(r => r.name === userRole);
      if (!role) {
        return false;
      }
      
      // Check if the role has the admin permission
      if (role.permissions.includes('admin')) {
        return true;
      }
      
      // Check if the role has the required permission
      return role.permissions.includes(requiredPermission);
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  }
}
