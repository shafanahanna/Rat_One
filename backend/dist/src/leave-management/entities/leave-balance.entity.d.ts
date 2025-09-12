import { Employee } from '../../employee/employee.entity';
import { LeaveType } from './leave-type.entity';
export declare class LeaveBalance {
    id: string;
    employee_id: string;
    leave_type_id: string;
    year: number;
    allocated_days: number;
    used_days: number;
    remaining_days: number;
    calculateRemainingDays(): void;
    created_at: Date;
    updated_at: Date;
    employee: Employee;
    leaveType: LeaveType;
}
