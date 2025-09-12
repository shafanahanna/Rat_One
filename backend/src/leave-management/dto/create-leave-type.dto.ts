import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max, IsBoolean } from 'class-validator';

export class CreateLeaveTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(365)
  max_days: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsBoolean()
  @IsOptional()
  is_paid?: boolean;

  // requires_approval field removed as it doesn't exist in the database

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
