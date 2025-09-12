import { IsNotEmpty, IsString, IsUUID, IsOptional, IsBoolean } from 'class-validator';

export class CreateBranchDto {
  @IsNotEmpty()
  @IsUUID()
  country_id: string;

  @IsNotEmpty()
  @IsString()
  branch_code: string;

  @IsNotEmpty()
  @IsString()
  branch_name: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  state_province?: string;

  @IsOptional()
  @IsBoolean()
  is_headquarters?: boolean;

  @IsOptional()
  @IsUUID()
  manager_user_id?: string;
}
