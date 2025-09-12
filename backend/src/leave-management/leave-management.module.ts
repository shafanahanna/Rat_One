import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeModule } from '../employee/employee.module';

// Entities
import { LeaveBalance } from './entities/leave-balance.entity';
import { GlobalLeaveConfig } from './entities/global-leave-config.entity';
import { Employee } from '../employee/employee.entity';
import { LeaveApplication, LeaveType } from './entities';
import { LeaveScheme } from './entities/leave-scheme.entity';
import { SchemeLeaveType } from './entities/scheme-leave-type.entity';
import { EmployeeLeaveScheme } from './entities/employee-leave-scheme.entity';

// Controllers
import { LeaveTypeController } from './controllers/leave-type.controller';
import { LeaveApplicationController } from './controllers/leave-application.controller';
import { LeaveBalanceController } from './controllers/leave-balance.controller';
import { GlobalLeaveConfigController } from './controllers/global-leave-config.controller';
import { LeaveTypeSetupController } from './controllers/leave-type-setup.controller';
import { LeaveSchemeController } from './controllers/leave-scheme.controller';
import { EmployeeLeaveSchemeController } from './controllers/employee-leave-scheme.controller';

// Services
import { LeaveTypeService } from './services/leave-type.service';
import { LeaveApplicationService } from './services/leave-application.service';
import { LeaveBalanceService } from './services/leave-balance.service';
import { GlobalLeaveConfigService } from './services/global-leave-config.service';
import { LeaveTypeSetupService } from './scripts/setup-default-leave-types';
import { LeaveSchemeService } from './services/leave-scheme.service';
import { EmployeeLeaveSchemeService } from './services/employee-leave-scheme.service';
import { Pool } from 'pg';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LeaveType,
      LeaveApplication,
      LeaveBalance,
      GlobalLeaveConfig,
      Employee,
      LeaveScheme,
      SchemeLeaveType,
      EmployeeLeaveScheme,
    ]),
    EmployeeModule,
  ],
  controllers: [
    LeaveTypeController,
    LeaveApplicationController,
    LeaveBalanceController,
    GlobalLeaveConfigController,
    LeaveTypeSetupController,
    LeaveSchemeController,
    EmployeeLeaveSchemeController,
  ],
  providers: [
    LeaveTypeService,
    LeaveApplicationService,
    LeaveBalanceService,
    GlobalLeaveConfigService,
    LeaveTypeSetupService,
    LeaveSchemeService,
    EmployeeLeaveSchemeService,
    {
      provide: Pool,
      useFactory: () => {
        return new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        });
      },
    },
  ],
  exports: [
    LeaveTypeService,
    LeaveApplicationService,
    LeaveBalanceService,
    GlobalLeaveConfigService,
    LeaveSchemeService,
    EmployeeLeaveSchemeService,
  ],
})
export class LeaveManagementModule {}
