import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Inject } from '@nestjs/common';
import { DesignationsService } from './designations/designations.service';
import { CreateRoleDto } from './auth/roles/dto/create-role.dto';
import { UpdateRoleDto } from './auth/roles/dto/update-role.dto';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RolesController {
  constructor(private readonly designationsService: DesignationsService) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    const designation = await this.designationsService.create(createRoleDto);
    return {
      success: true,
      message: 'Designation created successfully',
      data: designation
    };
  }

  @Get()
  async findAll() {
    const designations = await this.designationsService.findAll();
    return {
      success: true,
      data: designations
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const designation = await this.designationsService.findOne(id);
    return {
      success: true,
      data: designation
    };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const designation = await this.designationsService.update(id, updateRoleDto);
    return {
      success: true,
      message: 'Designation updated successfully',
      data: designation
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.designationsService.remove(id);
    return {
      success: true,
      message: 'Designation deleted successfully'
    };
  }
}
