import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpStatus, HttpCode, Query } from '@nestjs/common';
import { EmployeeLeaveSchemeService } from '../services/employee-leave-scheme.service';
import { AssignSchemeToEmployeeDto } from '../dto/assign-scheme-to-employee.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('leave-management/employee-schemes')
@UseGuards(JwtAuthGuard)
export class EmployeeLeaveSchemeController {
  constructor(private readonly employeeLeaveSchemeService: EmployeeLeaveSchemeService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: AssignSchemeToEmployeeDto, @Req() req: Request) {
    const userId = req.user['id'];
    return this.employeeLeaveSchemeService.create(dto, userId);
  }

  @Get('employee/:employeeId')
  async findByEmployeeId(@Param('employeeId') employeeId: string) {
    return this.employeeLeaveSchemeService.findByEmployeeId(employeeId);
  }

  @Get('employee/:employeeId/current')
  async getCurrentSchemeForEmployee(
    @Param('employeeId') employeeId: string,
    @Query('date') date?: string
  ) {
    return this.employeeLeaveSchemeService.getCurrentSchemeForEmployee(employeeId, date);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.employeeLeaveSchemeService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @Body() dto: Partial<AssignSchemeToEmployeeDto>,
    @Req() req: Request
  ) {
    const userId = req.user['id'];
    return this.employeeLeaveSchemeService.update(id, dto, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return this.employeeLeaveSchemeService.remove(id);
  }
}
