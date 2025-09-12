import { UserRole } from '../dto/register.dto';
export declare class User {
    id: string;
    username: string;
    email: string;
    password_hash: string;
    role: UserRole;
    employee_id: string;
    country_id: string;
    branch_id: string;
    created_at: Date;
    updated_at: Date;
}
