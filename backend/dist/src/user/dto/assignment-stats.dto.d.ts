export declare class BranchAssignmentDto {
    branch_name: string;
    branch_code: string;
    user_count: number;
}
export declare class CountryAssignmentDto {
    country_name: string;
    transaction_currency: string;
    branch_name: string;
    branch_code: string;
    user_count: number;
}
export declare class AssignmentStatsDto {
    assignments: CountryAssignmentDto[];
    unassigned_count: number;
}
