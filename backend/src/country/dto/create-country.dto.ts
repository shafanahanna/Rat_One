import { IsNotEmpty, IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class CreateCountryDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  country_name: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 3)
  country_code: string;

  @IsNotEmpty()
  @IsString()
  transaction_currency: string;

  @IsNotEmpty()
  @IsString()
  currency_symbol: string;

  @IsNotEmpty()
  @IsString()
  timezone: string;

  @IsOptional()
  @IsString()
  date_format: string;
}
