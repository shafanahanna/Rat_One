import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class AddLeaveTypeToSchemeDto {
  @IsNotEmpty()
  @IsUUID()
  leave_type_id: string;

  @IsNotEmpty()
  @IsNumber()
  days_allowed: number;

  @IsOptional()
  @IsBoolean()
  is_paid?: boolean;
}
