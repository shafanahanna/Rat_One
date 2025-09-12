import { IsString, IsUUID, IsOptional, IsBoolean } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateBranchDto } from './create-branch.dto';

export class UpdateBranchDto extends PartialType(CreateBranchDto) {
  @IsOptional()
  @IsUUID()
  country_id?: string;

  @IsOptional()
  @IsString()
  branch_code?: string;

  @IsOptional()
  @IsString()
  branch_name?: string;

  @IsOptional()
  @IsString()
  city?: string;

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
