import { LeaveScheme } from './leave-scheme.entity';
import { Employee } from '../../employee/employee.entity';
export declare class EmployeeLeaveScheme {
    id: string;
    employee_id: string;
    scheme_id: string;
    effective_from: Date;
    effective_to: Date;
    created_by: string;
    updated_by: string;
    created_at: Date;
    updated_at: Date;
    employee: Employee;
    scheme: LeaveScheme;
}
