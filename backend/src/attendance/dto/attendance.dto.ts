import { IsString, IsUUID, IsDate, IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class AttendanceDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsUUID()
  employee_id: string;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsString()
  status: string;
}

export class GetAttendanceQueryDto {
  @IsInt()
  @Min(1)
  @Max(12)
  @Type(() => Number)
  month: number;

  @IsInt()
  @Min(2000)
  @Max(2100)
  @Type(() => Number)
  year: number;
}

export class GetDailyAttendanceSummaryDto {
  @IsDate()
  @Type(() => Date)
  date: Date;
}
