import { Repository } from 'typeorm';
import { LeaveBalance } from '../entities/leave-balance.entity';
import { CreateLeaveApplicationDto } from '../dto/create-leave-application.dto';
import { UpdateLeaveApplicationDto } from '../dto/update-leave-application.dto';
import { LeaveApplication, LeaveType } from '../entities';
import { Employee } from '../../employee/employee.entity';
export declare class LeaveApplicationService {
    private leaveApplicationRepository;
    private leaveBalanceRepository;
    private leaveTypeRepository;
    private employeeRepository;
    constructor(leaveApplicationRepository: Repository<LeaveApplication>, leaveBalanceRepository: Repository<LeaveBalance>, leaveTypeRepository: Repository<LeaveType>, employeeRepository: Repository<Employee>);
    create(createLeaveApplicationDto: CreateLeaveApplicationDto, userId: string): Promise<LeaveApplication>;
    findAll(status?: string): Promise<LeaveApplication[]>;
    findByEmployee(employeeId: string): Promise<LeaveApplication[]>;
    findByEmployeeWithStatus(employeeId: string, status?: string): Promise<LeaveApplication[]>;
    countAll(): Promise<number>;
    findOne(id: string): Promise<LeaveApplication>;
    update(id: string, updateLeaveApplicationDto: UpdateLeaveApplicationDto): Promise<LeaveApplication>;
    cancel(id: string): Promise<LeaveApplication>;
    remove(id: string): Promise<void>;
    updateStatus(id: string, status: string, approverId: string, comments?: string): Promise<LeaveApplication>;
}
