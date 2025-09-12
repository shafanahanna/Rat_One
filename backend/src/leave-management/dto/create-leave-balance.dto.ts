import { IsNotEmpty, IsUUID, IsNumber, IsInt, Min, IsOptional, IsBoolean } from 'class-validator';

export class CreateLeaveBalanceDto {
  @IsUUID()
  @IsNotEmpty()
  employee_id: string;

  @IsUUID()
  @IsNotEmpty()
  leave_type_id: string;

  @IsInt()
  @IsNotEmpty()
  @Min(2000)
  year: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  allocated_days: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  used_days?: number;

  @IsOptional()
  created_at?: Date;

  @IsOptional()
  updated_at?: Date;  


}
