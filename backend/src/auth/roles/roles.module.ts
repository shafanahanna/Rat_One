import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { PermissionsController } from './permissions.controller';
import { RolePermissionsController } from './role-permissions.controller';
import { PermissionsService } from './permissions.service';
import { Designation } from '../../designations/entities/designation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Designation])],
  controllers: [RolesController, PermissionsController, RolePermissionsController],
  providers: [RolesService, PermissionsService],
  exports: [RolesService, PermissionsService]
})
export class RolesModule {}
