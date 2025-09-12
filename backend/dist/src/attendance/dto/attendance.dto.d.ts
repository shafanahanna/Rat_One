export declare class AttendanceDto {
    id?: string;
    employee_id: string;
    date: Date;
    status: string;
}
export declare class GetAttendanceQueryDto {
    month: number;
    year: number;
}
export declare class GetDailyAttendanceSummaryDto {
    date: Date;
}
