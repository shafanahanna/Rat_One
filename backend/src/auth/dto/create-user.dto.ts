import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserRole } from './register.dto';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  username: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password_hash: string;

  @IsNotEmpty({ message: 'Role is required' })
  @IsEnum(UserRole, { message: 'Role must be one of: Director, HR, DM, TC, BA, RT, AC' })
  role: UserRole;
}
