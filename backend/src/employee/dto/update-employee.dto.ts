import { IsOptional, IsUUID, IsString, IsNumber, IsDate, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateEmployeeDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  designation?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  salary?: number;

  @IsOptional()
  @IsString()
  emp_code?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date_of_joining?: Date;

  @IsOptional()
  @IsUUID()
  branch_id?: string;
}
