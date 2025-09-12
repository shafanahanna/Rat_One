import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateLeaveSchemeDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
