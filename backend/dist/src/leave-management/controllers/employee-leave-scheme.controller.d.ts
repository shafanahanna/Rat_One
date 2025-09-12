import { EmployeeLeaveSchemeService } from '../services/employee-leave-scheme.service';
import { AssignSchemeToEmployeeDto } from '../dto/assign-scheme-to-employee.dto';
import { Request } from 'express';
export declare class EmployeeLeaveSchemeController {
    private readonly employeeLeaveSchemeService;
    constructor(employeeLeaveSchemeService: EmployeeLeaveSchemeService);
    create(dto: AssignSchemeToEmployeeDto, req: Request): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    findByEmployeeId(employeeId: string): Promise<{
        success: boolean;
        data: any;
    }>;
    getCurrentSchemeForEmployee(employeeId: string, date?: string): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        data: any;
        message?: undefined;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: any;
    }>;
    update(id: string, dto: Partial<AssignSchemeToEmployeeDto>, req: Request): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
