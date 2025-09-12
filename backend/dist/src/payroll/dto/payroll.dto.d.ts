export declare class PayrollPeriodDto {
    month: number;
    year: number;
}
export declare class RecalculatePayrollDto extends PayrollPeriodDto {
    forceRecalculate?: boolean;
}
export declare class UpdatePayrollStatusDto {
    payment_status: string;
    payment_date: Date;
}
