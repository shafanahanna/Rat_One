import { LeaveBalanceService } from '../services/leave-balance.service';
import { CreateLeaveBalanceDto } from '../dto/create-leave-balance.dto';
import { UpdateLeaveBalanceDto } from '../dto/update-leave-balance.dto';
export declare class LeaveBalanceController {
    private readonly leaveBalanceService;
    private readonly logger;
    constructor(leaveBalanceService: LeaveBalanceService);
    create(createLeaveBalanceDto: CreateLeaveBalanceDto): Promise<import("../entities").LeaveBalance>;
    findAll(): Promise<import("../entities").LeaveBalance[]>;
    findByEmployee(employeeId: string, yearParam?: string, user?: any): Promise<{
        success: boolean;
        message: string;
        data: any[];
    } | {
        success: boolean;
        data: import("../entities").LeaveBalance[];
        message?: undefined;
    }>;
    findOne(id: string): Promise<import("../entities").LeaveBalance>;
    update(id: string, updateLeaveBalanceDto: UpdateLeaveBalanceDto): Promise<import("../entities").LeaveBalance>;
    remove(id: string): Promise<void>;
    populateLeaveBalances(yearParam: string): Promise<{
        success: boolean;
        message: string;
        created: number;
        skipped: number;
        errors: number;
    }>;
    testPopulateLeaveBalances(yearParam: string): Promise<{
        success: boolean;
        message: string;
        result: {
            success: boolean;
            message: string;
            created: number;
            skipped: number;
            errors: number;
        };
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        result?: undefined;
    }>;
    getLeaveBalanceStatus(yearParam: string): Promise<{
        success: boolean;
        year: number;
        totalBalances: number;
        leaveTypeStats: {};
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        year?: undefined;
        totalBalances?: undefined;
        leaveTypeStats?: undefined;
    }>;
}
