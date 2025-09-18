import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsService } from './permissions.service';
import { DesignationPermissionGuard } from '../auth/guards/designation-permission.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@Controller('api/permissions')
@UseGuards(JwtAuthGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}
  
  @Get()
  @UseGuards(DesignationPermissionGuard)
  @Permissions(['roles.view', 'users.view']) // Allow access with either role or user view permission
  async getAvailablePermissions() {
    const permissions = this.permissionsService.getAllPermissions();

    return {
      success: true,
      data: permissions
    };
  }

  @Get('by-module')
  @UseGuards(DesignationPermissionGuard)
  @Permissions(['roles.view', 'users.view']) // Allow access with either role or user view permission
  async getPermissionsByModule() {
    const permissionsByModule = this.permissionsService.getPermissionsByModule();

    return {
      success: true,
      data: permissionsByModule
    };
  }
}
