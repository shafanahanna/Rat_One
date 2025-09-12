export declare class BulkUpdateUserDto {
    id: string;
    username: string;
    email: string;
    branch_id: string | null;
    branch_name?: string;
    country_name?: string;
    transaction_currency?: string;
}
export declare class BulkUpdateResultDto {
    updated_count: number;
    users: BulkUpdateUserDto[];
}
