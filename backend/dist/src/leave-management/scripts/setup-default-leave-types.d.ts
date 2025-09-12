import { Repository } from 'typeorm';
import { LeaveType } from '../entities/leave-type.entity';
import { GlobalLeaveConfig } from '../entities/global-leave-config.entity';
export declare class LeaveTypeSetupService {
    private leaveTypeRepository;
    private globalLeaveConfigRepository;
    constructor(leaveTypeRepository: Repository<LeaveType>, globalLeaveConfigRepository: Repository<GlobalLeaveConfig>);
    setupDefaultLeaveTypes(): Promise<{
        message: string;
        leaveTypes: any[];
    }>;
    private setupGlobalLeaveConfig;
}
