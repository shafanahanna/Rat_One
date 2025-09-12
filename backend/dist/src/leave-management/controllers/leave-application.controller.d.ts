import { LeaveApplicationService } from '../services/leave-application.service';
import { LeaveTypeService } from '../services/leave-type.service';
import { CreateLeaveApplicationDto } from '../dto/create-leave-application.dto';
import { UpdateLeaveApplicationDto } from '../dto/update-leave-application.dto';
import { EmployeeService } from '../../employee/employee.service';
export declare class LeaveApplicationController {
    private readonly leaveApplicationService;
    private readonly leaveTypeService;
    private readonly employeeService;
    private readonly logger;
    constructor(leaveApplicationService: LeaveApplicationService, leaveTypeService: LeaveTypeService, employeeService: EmployeeService);
    create(createLeaveApplicationDto: CreateLeaveApplicationDto, user: any): Promise<import("../entities").LeaveApplication> | {
        message: string;
    };
    testApiAccess(user?: any): Promise<{
        message: string;
        user: any;
        leaveApplicationsCount: number;
        timestamp: string;
        error?: undefined;
    } | {
        message: string;
        error: any;
        user?: undefined;
        leaveApplicationsCount?: undefined;
        timestamp?: undefined;
    }>;
    findAll(status?: string, user?: any, request?: any): Promise<import("../entities").LeaveApplication[]>;
    findByEmployee(employeeId: string, status: string, user: any): Promise<import("../entities").LeaveApplication[]> | {
        message: string;
    };
    findOne(id: string): Promise<import("../entities").LeaveApplication>;
    update(id: string, updateLeaveApplicationDto: UpdateLeaveApplicationDto, user: any): Promise<import("../entities").LeaveApplication> | {
        message: string;
    };
    updateStatus(id: string, statusUpdate: {
        status: string;
        comments?: string;
    }, user: any): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        data: import("../entities").LeaveApplication;
        error?: undefined;
    } | {
        success: boolean;
        message: any;
        error: any;
        data?: undefined;
    }>;
    cancel(id: string, user: any): Promise<import("../entities").LeaveApplication> | {
        message: string;
    };
    remove(id: string): Promise<void>;
    findAllLeaveTypes(): Promise<{
        success: boolean;
        data: any;
    }>;
}
