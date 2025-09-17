import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { DesignationsService } from './designations.service';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('designations')
@UseGuards(JwtAuthGuard)
export class DesignationsController {
  constructor(private readonly designationsService: DesignationsService) {}

  @Post()
  async create(@Body() createDesignationDto: CreateDesignationDto) {
    const designation = await this.designationsService.create(createDesignationDto);
    return {
      success: true,
      message: 'Designation created successfully',
      data: designation
    };
  }

  @Get()
  async findAll(@Query('departmentId') departmentId?: string) {
    let designations;
    
    if (departmentId) {
      designations = await this.designationsService.findByDepartment(departmentId);
    } else {
      designations = await this.designationsService.findAll();
    }
    
    return {
      success: true,
      data: designations
    };
  }

  @Get('department/:departmentId')
  async findByDepartment(@Param('departmentId') departmentId: string) {
    const designations = await this.designationsService.findByDepartment(departmentId);
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
  async update(@Param('id') id: string, @Body() updateDesignationDto: UpdateDesignationDto) {
    const designation = await this.designationsService.update(id, updateDesignationDto);
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
