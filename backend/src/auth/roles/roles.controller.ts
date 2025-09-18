import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { DesignationsService } from '../../designations/designations.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { DesignationPermissionGuard } from '../guards/designation-permission.guard';
import { Permissions } from '../decorators/permissions.decorator';

@Controller('api/roles')
@UseGuards(JwtAuthGuard)
export class RolesController {
  constructor(private readonly designationsService: DesignationsService) {}

  @Post()
  @UseGuards(DesignationPermissionGuard)
  @Permissions('roles.create')
  async create(@Body() createRoleDto: CreateRoleDto) {
    const designation = await this.designationsService.create(createRoleDto);
    return {
      success: true,
      message: 'Designation created successfully',
      data: designation
    };
  }

  @Get()
  @UseGuards(DesignationPermissionGuard)
  @Permissions('roles')
  async findAll() {
    const designations = await this.designationsService.findAll();
    return {
      success: true,
      data: designations
    };
  }

  @Get(':id')
  @UseGuards(DesignationPermissionGuard)
  @Permissions('roles')
  async findOne(@Param('id') id: string) {
    const designation = await this.designationsService.findOne(id);
    return {
      success: true,
      data: designation
    };
  }

  @Put(':id')
  @UseGuards(DesignationPermissionGuard)
  @Permissions('roles.edit')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const designation = await this.designationsService.update(id, updateRoleDto);
    return {
      success: true,
      message: 'Designation updated successfully',
      data: designation
    };
  }

  @Delete(':id')
  @UseGuards(DesignationPermissionGuard)
  @Permissions('roles.delete')
  async remove(@Param('id') id: string) {
    await this.designationsService.remove(id);
    return {
      success: true,
      message: 'Designation deleted successfully'
    };
  }
}
