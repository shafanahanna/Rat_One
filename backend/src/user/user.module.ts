import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { BranchModule } from '../branch/branch.module';
import { CountryModule } from '../country/country.module';
import { Branch } from '../branch/entities/branch.entity';
import { Country } from '../country/entities/country.entity';
import { User } from '../auth/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Branch, Country]),
    BranchModule,
    CountryModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
