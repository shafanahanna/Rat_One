import { Country } from '../../country/entities/country.entity';
import { User } from '../../auth/entities/user.entity';
export declare class Branch {
    id: string;
    country_id: string;
    branch_code: string;
    branch_name: string;
    city: string;
    state_province: string;
    is_headquarters: boolean;
    manager_user_id: string;
    country: Country;
    manager: User;
    users: User[];
    created_at: Date;
    updated_at: Date;
}
