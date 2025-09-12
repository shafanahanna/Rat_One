import { IsDateString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class AssignSchemeToEmployeeDto {
  @IsNotEmpty()
  @IsUUID()
  employee_id: string;

  @IsNotEmpty()
  @IsUUID()
  scheme_id: string;

  @IsNotEmpty()
  @IsDateString()
  effective_from: string;

  @IsOptional()
  @IsDateString()
  effective_to?: string;
}
