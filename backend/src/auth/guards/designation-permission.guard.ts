import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../entities/user.entity';
import { Designation } from '../../designations/entities/designation.entity';
import { DesignationsService } from '../../designations/designations.service';

@Injectable()
export class DesignationPermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private designationsService: DesignationsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<(string | string[])[]>('permissions', context.getHandler());
    
    // If no permissions are required, allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // If no user, deny access
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    try {
      // Legacy support for hardcoded admin roles
      if (user.role === 'Admin' || user.role === 'Director') {
        return true;
      }

      // If user has no designation, deny access
      if (!user.designationId) {
        console.warn(`User ${user.id} has no designation assigned`);
        return false;
      }

      // Find the user's designation with permissions
      const designation = await this.designationsService.findOne(user.designationId);
      
      // If designation not found, deny access
      if (!designation) {
        console.warn(`Designation not found: ${user.designationId}`);
        return false;
      }

      // If designation has no permissions, deny access
      if (!designation.permissions || designation.permissions.length === 0) {
        console.warn(`Designation ${designation.id} has no permissions`);
        return false;
      }

      // Check if the designation has admin permission (which grants all permissions)
      if (designation.permissions.includes('admin')) {
        return true;
      }

      // Check if the designation has the required permissions
      // Each item in requiredPermissions can be a string or an array of strings
      // If it's a string, the user must have that permission
      // If it's an array, the user must have at least one of those permissions
      const hasRequiredPermissions = requiredPermissions.every(permissionOrGroup => {
        if (Array.isArray(permissionOrGroup)) {
          // OR logic - user must have at least one of these permissions
          return permissionOrGroup.some(permission => 
            designation.permissions.includes(permission)
          );
        } else {
          // Single permission - user must have this permission
          return designation.permissions.includes(permissionOrGroup);
        }
      });

      if (!hasRequiredPermissions) {
        console.log(`User with designation ${designation.name} missing required permissions`);
      }

      return hasRequiredPermissions;
    } catch (error) {
      console.error('Error checking designation permissions:', error);
      return false;
    }
  }
}
