import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class UpdateSchemeLeaveTypeDto {
  @IsOptional()
  @IsNumber()
  days_allowed?: number;

  @IsOptional()
  @IsBoolean()
  is_paid?: boolean;
}
