import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Inject } from '@nestjs/common';
import { RolesService } from './auth/roles/roles.service';
import { CreateRoleDto } from './auth/roles/dto/create-role.dto';
import { UpdateRoleDto } from './auth/roles/dto/update-role.dto';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    const role = await this.rolesService.create(createRoleDto);
    return {
      success: true,
      message: 'Role created successfully',
      data: role
    };
  }

  @Get()
  async findAll() {
    const roles = await this.rolesService.findAll();
    return {
      success: true,
      data: roles
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const role = await this.rolesService.findOne(id);
    return {
      success: true,
      data: role
    };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const role = await this.rolesService.update(id, updateRoleDto);
    return {
      success: true,
      message: 'Role updated successfully',
      data: role
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.rolesService.remove(id);
    return {
      success: true,
      message: 'Role deleted successfully'
    };
  }
}
