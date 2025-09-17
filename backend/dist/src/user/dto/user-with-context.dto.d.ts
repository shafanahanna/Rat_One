export declare class UserWithContextDto {
    id: string;
    username: string;
    email: string;
    role: string;
    employee_id: string | null;
    branch_id: string | null;
    created_at: Date;
    updated_at: Date;
    branch_code?: string;
    branch_name?: string;
    city?: string;
    state_province?: string;
    country_id?: string;
    country_code?: string;
    country_name?: string;
    transaction_currency?: string;
    currency_symbol?: string;
    timezone?: string;
}
