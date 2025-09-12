import { LeaveBalance } from './leave-balance.entity';
export declare class LeaveType {
    id: string;
    name: string;
    code: string;
    max_days: number;
    description: string;
    color: string;
    is_paid: boolean;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    created_by: string;
    updated_by: string;
    leaveApplications: any[];
    leaveBalances: LeaveBalance[];
}
