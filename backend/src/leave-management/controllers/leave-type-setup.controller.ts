import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { LeaveTypeSetupService } from '../scripts/setup-default-leave-types';

@Controller('leave-management/setup-default-leave-types')
@UseGuards(JwtAuthGuard)
export class LeaveTypeSetupController {
  constructor(private readonly leaveTypeSetupService: LeaveTypeSetupService) {}

  @Post()
  @Roles('HR', 'Director')
  setupDefaultLeaveTypes() {
    return this.leaveTypeSetupService.setupDefaultLeaveTypes();
  }
}
