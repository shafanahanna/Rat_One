import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesService } from './roles.service';
import { PermissionGuard } from '../guards/permission.guard';
import { Permissions } from '../decorators/permissions.decorator';

@Controller('role-permissions')
@UseGuards(JwtAuthGuard)
export class RolePermissionsController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @UseGuards(PermissionGuard)
  @Permissions('roles.view')
  async getAllRolePermissions() {
    const roles = await this.rolesService.findAll();
    
    // Convert to the expected format
    const rolePermissions = {};
    roles.forEach(role => {
      rolePermissions[role.id] = role.permissions;
    });
    
    return {
      success: true,
      data: rolePermissions
    };
  }

  @Get(':id')
  @UseGuards(PermissionGuard)
  @Permissions('roles.view')
  async getRolePermissions(@Param('id') id: string) {
    const role = await this.rolesService.findOne(id);
    
    return {
      success: true,
      data: {
        id: role.id,
        name: role.name,
        permissions: role.permissions
      }
    };
  }

  @Post(':id')
  @UseGuards(PermissionGuard)
  @Permissions('roles.edit')
  async updateRolePermissions(
    @Param('id') id: string,
    @Body() body: { permissionIds: string[] }
  ) {
    const role = await this.rolesService.findOne(id);
    
    // Update permissions
    role.permissions = body.permissionIds;
    
    // Save the updated role
    const updatedRole = await this.rolesService.update(id, role);
    
    return {
      success: true,
      message: 'Role permissions updated successfully',
      data: {
        id: updatedRole.id,
        name: updatedRole.name,
        permissions: updatedRole.permissions
      }
    };
  }
}
