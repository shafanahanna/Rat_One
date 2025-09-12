import { IsString, IsNotEmpty, IsDateString, IsOptional, IsUUID, ValidateIf, IsEnum } from 'class-validator';

enum LeaveDurationType {
  FULL_DAY = 'full_day',
  HALF_DAY_MORNING = 'half_day_morning',
  HALF_DAY_AFTERNOON = 'half_day_afternoon'
}

export class CreateLeaveApplicationDto {
  @IsUUID()
  @IsNotEmpty()
  leave_type_id: string;

  @IsDateString()
  @IsNotEmpty()
  start_date: string;

  @IsDateString()
  @IsNotEmpty()
  end_date: string;

  @IsString()
  @IsNotEmpty()
  reason: string;

 

  @IsString()
  @IsOptional()
  contact_during_leave?: string;

  @IsUUID()
  @ValidateIf(o => o.employee_id !== undefined)
  employee_id?: string; // Optional: For admin/HR to apply on behalf of employee

  @IsEnum(LeaveDurationType)
  @IsOptional()
  leave_duration_type?: string; // full_day, half_day_morning, half_day_afternoon
}
