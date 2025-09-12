import { UserRole } from './register.dto';
export declare class CreateUserDto {
    username: string;
    email: string;
    password_hash: string;
    role: UserRole;
}
