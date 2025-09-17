import { IsNotEmpty, IsOptional, IsString, IsUUID, IsInt, Min } from 'class-validator';

export class CreateDesignationDto {
  @IsString()
  @IsNotEmpty({ message: 'Designation name is required' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  departmentId?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  level?: number;
}
