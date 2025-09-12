import { LeaveType } from './leave-type.entity';
import { Employee } from '../../employee/employee.entity';
export declare class LeaveApplication {
    id: string;
    employee_id: string;
    leave_type_id: string;
    start_date: Date;
    end_date: Date;
    working_days: number;
    reason: string;
    attachment_url: string;
    comments: string;
    status: string;
    created_at: Date;
    updated_at: Date;
    employee: Employee;
    leaveType: LeaveType;
}
