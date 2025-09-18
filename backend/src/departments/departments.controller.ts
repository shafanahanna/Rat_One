import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/departments')
@UseGuards(JwtAuthGuard)
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  async create(@Body() createDepartmentDto: CreateDepartmentDto) {
    const department = await this.departmentsService.create(createDepartmentDto);
    return {
      success: true,
      message: 'Department created successfully',
      data: department
    };
  }

  @Get()
  async findAll() {
    const departments = await this.departmentsService.findAll();
    return {
      success: true,
      data: departments
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const department = await this.departmentsService.findOne(id);
    return {
      success: true,
      data: department
    };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDepartmentDto: UpdateDepartmentDto) {
    const department = await this.departmentsService.update(id, updateDepartmentDto);
    return {
      success: true,
      message: 'Department updated successfully',
      data: department
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.departmentsService.remove(id);
    return {
      success: true,
      message: 'Department deleted successfully'
    };
  }
}
