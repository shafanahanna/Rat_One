import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryService } from './country.service';
import { Country } from './entities/country.entity';
import { Branch } from '../branch/entities/branch.entity';
import { CountryController } from './country.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Country, Branch])
  ],
  controllers: [CountryController],
  providers: [CountryService],
  exports: [CountryService]
})
export class CountryModule {}
