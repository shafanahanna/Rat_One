import { LeaveScheme } from './leave-scheme.entity';
import { LeaveType } from './leave-type.entity';
export declare class SchemeLeaveType {
    id: string;
    scheme_id: string;
    leave_type_id: string;
    days_allowed: number;
    is_paid: boolean;
    created_by: string;
    updated_by: string;
    created_at: Date;
    updated_at: Date;
    scheme: LeaveScheme;
    leaveType: LeaveType;
}
