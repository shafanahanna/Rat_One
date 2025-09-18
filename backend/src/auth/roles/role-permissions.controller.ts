import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { DesignationsService } from '../../designations/designations.service';
import { DesignationPermissionGuard } from '../guards/designation-permission.guard';
import { Permissions } from '../decorators/permissions.decorator';

@Controller('role-permissions')
@UseGuards(JwtAuthGuard)
export class RolePermissionsController {
  constructor(private readonly designationsService: DesignationsService) {}

  @Get()
  @UseGuards(DesignationPermissionGuard)
  @Permissions('roles.view')
  async getAllRolePermissions() {
    const designations = await this.designationsService.findAll();
    
    // Convert to the expected format
    const rolePermissions = {};
    designations.forEach(designation => {
      rolePermissions[designation.id] = designation.permissions || [];
    });
    
    return {
      success: true,
      data: rolePermissions
    };
  }

  @Get(':id')
  @UseGuards(DesignationPermissionGuard)
  @Permissions('roles.view')
  async getRolePermissions(@Param('id') id: string) {
    const designation = await this.designationsService.findOne(id);
    
    return {
      success: true,
      data: {
        id: designation.id,
        name: designation.name,
        permissions: designation.permissions || []
      }
    };
  }

  @Post(':id')
  @UseGuards(DesignationPermissionGuard)
  @Permissions('roles.edit')
  async updateRolePermissions(
    @Param('id') id: string,
    @Body() body: { permissionIds: string[] }
  ) {
    const designation = await this.designationsService.findOne(id);
    
    // Update permissions using the setPermissions method
    const updatedDesignation = await this.designationsService.setPermissions(id, body.permissionIds);
    
    return {
      success: true,
      message: 'Designation permissions updated successfully',
      data: {
        id: updatedDesignation.id,
        permissions: updatedDesignation.permissions || []
      }
    };
  }
}
