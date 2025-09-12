import { Branch } from '../../branch/entities/branch.entity';
export declare class Country {
    id: string;
    country_name: string;
    country_code: string;
    transaction_currency: string;
    currency_symbol: string;
    timezone: string;
    date_format: string;
    branches: Branch[];
    created_at: Date;
    updated_at: Date;
}
