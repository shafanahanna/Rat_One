import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../dto/register.dto';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;

  @IsOptional()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be one of: Director, HR, DM, TC, BA, RT, AC' })
  role?: UserRole;
}
