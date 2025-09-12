import { EmployeeLeaveScheme } from './employee-leave-scheme.entity';
import { SchemeLeaveType } from './scheme-leave-type.entity';
export declare class LeaveScheme {
    id: string;
    name: string;
    is_active: boolean;
    created_by: string;
    updated_by: string;
    created_at: Date;
    updated_at: Date;
    schemeLeaveTypes: SchemeLeaveType[];
    employeeLeaveSchemes: EmployeeLeaveScheme[];
}
