import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpStatus, HttpCode } from '@nestjs/common';
import { LeaveTypeService } from '../services/leave-type.service';
import { CreateLeaveTypeDto } from '../dto/create-leave-type.dto';
import { UpdateLeaveTypeDto } from '../dto/update-leave-type.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('leave-management/types')
@UseGuards(JwtAuthGuard)
export class LeaveTypeController {
  constructor(private readonly leaveTypeService: LeaveTypeService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createLeaveTypeDto: CreateLeaveTypeDto, @Req() req: Request) {
    const userId = req.user['id'];
    return this.leaveTypeService.create(createLeaveTypeDto, userId);
  }

  @Get()
  async findAll() {
    return this.leaveTypeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.leaveTypeService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateLeaveTypeDto: UpdateLeaveTypeDto,
    @Req() req: Request
  ) {
    const userId = req.user['id'];
    return this.leaveTypeService.update(id, updateLeaveTypeDto, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return this.leaveTypeService.remove(id);
  }

  @Patch(':id/soft-delete')
  async softDelete(@Param('id') id: string) {
    return this.leaveTypeService.softDelete(id);
  }
}
