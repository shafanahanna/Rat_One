import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesModule as AuthRolesModule } from './auth/roles/roles.module';

@Module({
  imports: [AuthRolesModule],
  controllers: [RolesController],
})
export class RolesModule {}
