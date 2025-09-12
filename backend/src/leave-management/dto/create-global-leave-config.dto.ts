import { IsNotEmpty, IsString, IsObject, IsOptional } from 'class-validator';

export class CreateGlobalLeaveConfigDto {
  @IsNotEmpty()
  @IsString()
  key: string;

  @IsNotEmpty()
  @IsObject()
  value: Record<string, any>;

  @IsOptional()
  @IsString()
  description?: string;
}
