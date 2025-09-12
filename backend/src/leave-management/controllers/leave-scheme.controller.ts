import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpStatus, HttpCode } from '@nestjs/common';
import { LeaveSchemeService } from '../services/leave-scheme.service';
import { CreateLeaveSchemeDto } from '../dto/create-leave-scheme.dto';
import { UpdateLeaveSchemeDto } from '../dto/update-leave-scheme.dto';
import { AddLeaveTypeToSchemeDto } from '../dto/add-leave-type-to-scheme.dto';
import { UpdateSchemeLeaveTypeDto } from '../dto/update-scheme-leave-type.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('leave-management/schemes')
@UseGuards(JwtAuthGuard)
export class LeaveSchemeController {
  constructor(private readonly leaveSchemeService: LeaveSchemeService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createLeaveSchemeDto: CreateLeaveSchemeDto, @Req() req: Request) {
    const userId = req.user['id'];
    return this.leaveSchemeService.create(createLeaveSchemeDto, userId);
  }

  @Get()
  async findAll() {
    return this.leaveSchemeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.leaveSchemeService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateLeaveSchemeDto: UpdateLeaveSchemeDto,
    @Req() req: Request
  ) {
    const userId = req.user['id'];
    return this.leaveSchemeService.update(id, updateLeaveSchemeDto, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return this.leaveSchemeService.remove(id);
  }

  @Get(':scheme_id/leave-types')
  async getSchemeLeaveTypes(@Param('scheme_id') schemeId: string) {
    return this.leaveSchemeService.getSchemeLeaveTypes(schemeId);
  }

  @Post(':scheme_id/leave-types')
  @HttpCode(HttpStatus.CREATED)
  async addLeaveTypeToScheme(
    @Param('scheme_id') schemeId: string,
    @Body() dto: AddLeaveTypeToSchemeDto,
    @Req() req: Request
  ) {
    const userId = req.user['id'];
    return this.leaveSchemeService.addLeaveTypeToScheme(schemeId, dto, userId);
  }

  @Patch(':scheme_id/leave-types/:id')
  async updateSchemeLeaveType(
    @Param('scheme_id') schemeId: string,
    @Param('id') id: string,
    @Body() dto: UpdateSchemeLeaveTypeDto,
    @Req() req: Request
  ) {
    const userId = req.user['id'];
    return this.leaveSchemeService.updateSchemeLeaveType(schemeId, id, dto, userId);
  }

  @Delete(':scheme_id/leave-types/:id')
  @HttpCode(HttpStatus.OK)
  async removeLeaveTypeFromScheme(
    @Param('scheme_id') schemeId: string,
    @Param('id') id: string
  ) {
    return this.leaveSchemeService.removeLeaveTypeFromScheme(schemeId, id);
  }
}
