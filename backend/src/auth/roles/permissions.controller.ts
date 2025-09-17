import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsService } from './permissions.service';
import { PermissionGuard } from '../guards/permission.guard';
import { Permissions } from '../decorators/permissions.decorator';

@Controller('permissions')
@UseGuards(JwtAuthGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}
  
  @Get()
  @UseGuards(PermissionGuard)
  @Permissions(['roles.view', 'users.view']) // Allow access with either role or user view permission
  async getAvailablePermissions() {
    const permissions = this.permissionsService.getAllPermissions();

    return {
      success: true,
      data: permissions
    };
  }

  @Get('by-module')
  @UseGuards(PermissionGuard)
  @Permissions(['roles.view', 'users.view']) // Allow access with either role or user view permission
  async getPermissionsByModule() {
    const permissionsByModule = this.permissionsService.getPermissionsByModule();

    return {
      success: true,
      data: permissionsByModule
    };
  }
}
