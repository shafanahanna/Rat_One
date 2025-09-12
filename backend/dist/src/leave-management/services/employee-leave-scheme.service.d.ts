import { Pool } from 'pg';
import { AssignSchemeToEmployeeDto } from '../dto/assign-scheme-to-employee.dto';
export declare class EmployeeLeaveSchemeService {
    private readonly pgPool;
    private readonly logger;
    constructor(pgPool: Pool);
    findByEmployeeId(employeeId: string): Promise<{
        success: boolean;
        data: any;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: any;
    }>;
    create(dto: AssignSchemeToEmployeeDto, userId: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    update(id: string, dto: Partial<AssignSchemeToEmployeeDto>, userId: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
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
}
