import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Designation } from './entities/designation.entity';
import { DesignationsService } from './designations.service';
import { DesignationsController } from './designations.controller';
import { DepartmentsModule } from '../departments/departments.module';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { User } from '../auth/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Designation, User]),
    DepartmentsModule
  ],
  controllers: [DesignationsController, PermissionsController],
  providers: [DesignationsService, PermissionsService],
  exports: [DesignationsService, PermissionsService],
})
export class DesignationsModule {}
