import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { UserRole } from '../dto/register.dto';

@Controller('api/roles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Roles(UserRole.DIRECTOR)
  async create(@Body() createRoleDto: CreateRoleDto) {
    const role = await this.rolesService.create(createRoleDto);
    return {
      success: true,
      message: 'Role created successfully',
      data: role
    };
  }

  @Get()
  @Roles(UserRole.DIRECTOR)
  async findAll() {
    const roles = await this.rolesService.findAll();
    return {
      success: true,
      data: roles
    };
  }

  @Get(':id')
  @Roles(UserRole.DIRECTOR)
  async findOne(@Param('id') id: string) {
    const role = await this.rolesService.findOne(id);
    return {
      success: true,
      data: role
    };
  }

  @Put(':id')
  @Roles(UserRole.DIRECTOR)
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const role = await this.rolesService.update(id, updateRoleDto);
    return {
      success: true,
      message: 'Role updated successfully',
      data: role
    };
  }

  @Delete(':id')
  @Roles(UserRole.DIRECTOR)
  async remove(@Param('id') id: string) {
    await this.rolesService.remove(id);
    return {
      success: true,
      message: 'Role deleted successfully'
    };
  }
}
