import { IsNotEmpty, IsOptional, IsUUID, IsString, IsNumber, IsDateString, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEmployeeDto {
  @IsNotEmpty()
  @IsUUID()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  full_name: string;

  @IsNotEmpty()
  @IsString()
  designation: string;

  @IsNotEmpty()
  @IsString()
  department: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  salary?: number;

  @IsNotEmpty()
  @IsDateString()
  date_of_joining: string;

  @IsOptional()
  @IsString()
  emp_code?: string;

  @IsOptional()
  @IsUUID()
  branch_id?: string;

 
}
