import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { AttendanceDto } from './dto/attendance.dto';
import { Employee } from './entities/employee.entity';
export declare class AttendanceService {
    private attendanceRepository;
    private employeeRepository;
    constructor(attendanceRepository: Repository<Attendance>, employeeRepository: Repository<Employee>);
    getAttendance(month: string, year: string): Promise<Attendance[]>;
    setAttendance(attendanceDto: AttendanceDto): Promise<Attendance | null>;
    getDailyAttendanceSummary(date: string): Promise<any>;
}
