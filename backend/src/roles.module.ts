import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { DesignationsModule } from './designations/designations.module';

@Module({
  imports: [DesignationsModule],
  controllers: [RolesController],
})
export class RolesModule {}
