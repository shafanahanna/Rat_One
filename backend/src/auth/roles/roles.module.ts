import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { CustomRole } from './entities/role.entity';
import { PermissionsController } from './permissions.controller';
import { RolePermissionsController } from './role-permissions.controller';
import { PermissionsService } from './permissions.service';

@Module({
  imports: [TypeOrmModule.forFeature([CustomRole])],
  controllers: [RolesController, PermissionsController, RolePermissionsController],
  providers: [RolesService, PermissionsService],
  exports: [RolesService, PermissionsService]
})
export class RolesModule {}
