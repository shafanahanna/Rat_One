import { Repository, DataSource } from 'typeorm';
import { LeaveBalance } from '../entities/leave-balance.entity';
import { CreateLeaveBalanceDto } from '../dto/create-leave-balance.dto';
import { UpdateLeaveBalanceDto } from '../dto/update-leave-balance.dto';
import { Employee } from '../../employee/employee.entity';
import { LeaveType } from '../entities/leave-type.entity';
import { GlobalLeaveConfig } from '../entities/global-leave-config.entity';
export declare class LeaveBalanceService {
    private leaveBalanceRepository;
    private employeeRepository;
    private leaveTypeRepository;
    private globalLeaveConfigRepository;
    private dataSource;
    private readonly logger;
    constructor(leaveBalanceRepository: Repository<LeaveBalance>, employeeRepository: Repository<Employee>, leaveTypeRepository: Repository<LeaveType>, globalLeaveConfigRepository: Repository<GlobalLeaveConfig>, dataSource: DataSource);
    create(createLeaveBalanceDto: CreateLeaveBalanceDto): Promise<LeaveBalance>;
    findAll(): Promise<LeaveBalance[]>;
    findByEmployee(employeeId: string, year?: number): Promise<LeaveBalance[]>;
    findEmployeeByUserId(userId: string): Promise<Employee | null>;
    findOne(id: string): Promise<LeaveBalance>;
    update(id: string, updateLeaveBalanceDto: UpdateLeaveBalanceDto): Promise<LeaveBalance>;
    remove(id: string): Promise<void>;
    updateUsedDays(id: string, daysToAdd: number): Promise<LeaveBalance>;
    populateLeaveBalances(year: number): Promise<{
        success: boolean;
        message: string;
        created: number;
        skipped: number;
        errors: number;
    }>;
    populateLeaveBalancesForType(leaveTypeId: string, year: number): Promise<{
        success: boolean;
        message: string;
        created: number;
        skipped: number;
        errors: number;
    }>;
    private updateGlobalLeaveConfigForType;
    private updateGlobalLeaveConfig;
}
