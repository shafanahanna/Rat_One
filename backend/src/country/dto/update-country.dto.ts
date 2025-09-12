import { IsString, Length, MaxLength, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateCountryDto } from './create-country.dto';

export class UpdateCountryDto extends PartialType(CreateCountryDto) {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country_name?: string;

  @IsOptional()
  @IsString()
  @Length(2, 3)
  country_code?: string;

  @IsOptional()
  @IsString()
  transaction_currency?: string;

  @IsOptional()
  @IsString()
  currency_symbol?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsString()
  date_format?: string;
}
