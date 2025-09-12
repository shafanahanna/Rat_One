import { AttendanceService } from './attendance.service';
import { AttendanceDto, GetAttendanceQueryDto, GetDailyAttendanceSummaryDto } from './dto/attendance.dto';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    getAttendance(query: GetAttendanceQueryDto): Promise<{
        status: string;
        data: import("./entities/attendance.entity").Attendance[];
    }>;
    setAttendance(attendanceDto: AttendanceDto): Promise<{
        status: string;
        message: string;
        data: any;
    } | {
        status: string;
        data: import("./entities/attendance.entity").Attendance;
        message?: undefined;
    }>;
    getDailyAttendanceSummary(query: GetDailyAttendanceSummaryDto): Promise<any>;
}
