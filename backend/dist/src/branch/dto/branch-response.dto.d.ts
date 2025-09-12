export declare class CountryInfoDto {
    country_name: string;
    country_code: string;
    transaction_currency: string;
    currency_symbol: string;
}
export declare class BranchResponseDto {
    id: string;
    country_id: string;
    branch_code: string;
    branch_name: string;
    city: string;
    state_province: string;
    is_headquarters: boolean;
    manager_user_id: string;
    created_at: Date;
    updated_at: Date;
    country: CountryInfoDto;
    user_count: number;
}
export declare class BranchListResponseDto {
    data: BranchResponseDto[];
}
export declare class SingleBranchResponseDto {
    data: BranchResponseDto;
}
