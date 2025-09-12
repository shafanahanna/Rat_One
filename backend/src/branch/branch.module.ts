import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchService } from './branch.service';
import { BranchController } from './branch.controller';
import { Branch } from './entities/branch.entity';
import { Country } from '../country/entities/country.entity';
import { User } from '../auth/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Branch, Country, User]),
  ],
  controllers: [BranchController],
  providers: [BranchService],
  exports: [BranchService],
})
export class BranchModule {}
