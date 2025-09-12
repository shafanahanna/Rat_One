export declare class CreateLeaveBalanceDto {
    employee_id: string;
    leave_type_id: string;
    year: number;
    allocated_days: number;
    used_days?: number;
    created_at?: Date;
    updated_at?: Date;
}
