import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionGuard } from '../guards/permission.guard';
import { Permissions } from '../decorators/permissions.decorator';

@Controller('api/roles')
@UseGuards(JwtAuthGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @UseGuards(PermissionGuard)
  @Permissions('roles.create')
  async create(@Body() createRoleDto: CreateRoleDto) {
    const role = await this.rolesService.create(createRoleDto);
    return {
      success: true,
      message: 'Role created successfully',
      data: role
    };
  }

  @Get()
  @UseGuards(PermissionGuard)
  @Permissions('roles')
  async findAll() {
    const roles = await this.rolesService.findAll();
    return {
      success: true,
      data: roles
    };
  }

  @Get(':id')
  @UseGuards(PermissionGuard)
  @Permissions('roles')
  async findOne(@Param('id') id: string) {
    const role = await this.rolesService.findOne(id);
    return {
      success: true,
      data: role
    };
  }

  @Put(':id')
  @UseGuards(PermissionGuard)
  @Permissions('roles.edit')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const role = await this.rolesService.update(id, updateRoleDto);
    return {
      success: true,
      message: 'Role updated successfully',
      data: role
    };
  }

  @Delete(':id')
  @UseGuards(PermissionGuard)
  @Permissions('roles.delete')
  async remove(@Param('id') id: string) {
    await this.rolesService.remove(id);
    return {
      success: true,
      message: 'Role deleted successfully'
    };
  }
}
