import { Pool } from 'pg';
import { CreateLeaveTypeDto } from '../dto/create-leave-type.dto';
import { UpdateLeaveTypeDto } from '../dto/update-leave-type.dto';
import { LeaveBalanceService } from './leave-balance.service';
export declare class LeaveTypeService {
    private readonly pgPool;
    private readonly leaveBalanceService;
    private readonly logger;
    constructor(pgPool: Pool, leaveBalanceService: LeaveBalanceService);
    findAll(): Promise<{
        success: boolean;
        data: any;
    }>;
    findAllActive(): Promise<{
        success: boolean;
        data: any;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: any;
    }>;
    create(createLeaveTypeDto: CreateLeaveTypeDto, userId: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    update(id: string, updateLeaveTypeDto: UpdateLeaveTypeDto, userId: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    softDelete(id: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
}
