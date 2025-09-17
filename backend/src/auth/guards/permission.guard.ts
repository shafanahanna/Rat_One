import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private rolesService: RolesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<(string | string[])[]>('permissions', context.getHandler());
    
    // If no permissions are required, allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // If no user or role, deny access
    if (!user || !user.role) {
      throw new UnauthorizedException('User not authenticated or missing role');
    }

    try {
      // Legacy support for hardcoded admin roles
      if (user.role === 'Admin' || user.role === 'Director') {
        return true;
      }

      // Find all custom roles
      const customRoles = await this.rolesService.findAll();
      
      // Find the custom role that matches the user's role
      const userCustomRole = customRoles.find(role => role.name === user.role);
      
      // If role not found, deny access
      if (!userCustomRole) {
        console.warn(`Role not found: ${user.role}`);
        return false;
      }

      // Check if the role has admin permission (which grants all permissions)
      if (userCustomRole.permissions.includes('admin')) {
        return true;
      }

      // Check if the role has the required permissions
      // Each item in requiredPermissions can be a string or an array of strings
      // If it's a string, the user must have that permission
      // If it's an array, the user must have at least one of those permissions
      const hasRequiredPermissions = requiredPermissions.every(permissionOrGroup => {
        if (Array.isArray(permissionOrGroup)) {
          // OR logic - user must have at least one of these permissions
          return permissionOrGroup.some(permission => 
            userCustomRole.permissions.includes(permission)
          );
        } else {
          // Single permission - user must have this permission
          return userCustomRole.permissions.includes(permissionOrGroup);
        }
      });

      if (!hasRequiredPermissions) {
        console.log(`User with role ${user.role} missing required permissions`);
      }

      return hasRequiredPermissions;
    } catch (error) {
      console.error('Error checking permissions:', error);
      return false;
    }
  }
}
