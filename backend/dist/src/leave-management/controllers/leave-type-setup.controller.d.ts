import { LeaveTypeSetupService } from '../scripts/setup-default-leave-types';
export declare class LeaveTypeSetupController {
    private readonly leaveTypeSetupService;
    constructor(leaveTypeSetupService: LeaveTypeSetupService);
    setupDefaultLeaveTypes(): Promise<{
        message: string;
        leaveTypes: any[];
    }>;
}
