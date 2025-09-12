import { IsInt, IsNotEmpty, Min, Max, IsBoolean, IsOptional, IsString, IsIn } from 'class-validator';

export class PayrollPeriodDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1900)
  @Max(9999)
  year: number;
}

export class RecalculatePayrollDto extends PayrollPeriodDto {
  @IsOptional()
  @IsBoolean()
  forceRecalculate?: boolean;
}

export class UpdatePayrollStatusDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['Paid'])
  payment_status: string;
  
  @IsOptional()
  payment_date: Date;
}
