import { UserRole } from '../../dto/register.dto';
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    role: UserRole;
}
