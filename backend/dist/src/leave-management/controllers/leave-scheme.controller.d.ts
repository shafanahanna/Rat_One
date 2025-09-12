import { LeaveSchemeService } from '../services/leave-scheme.service';
import { CreateLeaveSchemeDto } from '../dto/create-leave-scheme.dto';
import { UpdateLeaveSchemeDto } from '../dto/update-leave-scheme.dto';
import { AddLeaveTypeToSchemeDto } from '../dto/add-leave-type-to-scheme.dto';
import { UpdateSchemeLeaveTypeDto } from '../dto/update-scheme-leave-type.dto';
import { Request } from 'express';
export declare class LeaveSchemeController {
    private readonly leaveSchemeService;
    constructor(leaveSchemeService: LeaveSchemeService);
    create(createLeaveSchemeDto: CreateLeaveSchemeDto, req: Request): Promise<{
        success: boolean;
        message: string;
        data: import("../entities/leave-scheme.entity").LeaveScheme;
    }>;
    findAll(): Promise<{
        success: boolean;
        data: any[];
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: import("../entities/leave-scheme.entity").LeaveScheme;
    }>;
    update(id: string, updateLeaveSchemeDto: UpdateLeaveSchemeDto, req: Request): Promise<{
        success: boolean;
        message: string;
        data: import("../entities/leave-scheme.entity").LeaveScheme;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getSchemeLeaveTypes(schemeId: string): Promise<{
        success: boolean;
        data: any[];
    }>;
    addLeaveTypeToScheme(schemeId: string, dto: AddLeaveTypeToSchemeDto, req: Request): Promise<{
        success: boolean;
        message: string;
        data: {
            leave_type_name: string;
            leave_type_description: string;
            leave_type_color: string;
            id: string;
            scheme_id: string;
            leave_type_id: string;
            days_allowed: number;
            is_paid: boolean;
            created_by: string;
            updated_by: string;
            created_at: Date;
            updated_at: Date;
            scheme: import("../entities/leave-scheme.entity").LeaveScheme;
            leaveType: import("../entities").LeaveType;
        };
    }>;
    updateSchemeLeaveType(schemeId: string, id: string, dto: UpdateSchemeLeaveTypeDto, req: Request): Promise<{
        success: boolean;
        message: string;
        data: {
            leave_type_name: string;
            leave_type_description: string;
            leave_type_color: string;
            id: string;
            scheme_id: string;
            leave_type_id: string;
            days_allowed: number;
            is_paid: boolean;
            created_by: string;
            updated_by: string;
            created_at: Date;
            updated_at: Date;
            scheme: import("../entities/leave-scheme.entity").LeaveScheme;
            leaveType: import("../entities").LeaveType;
        };
    }>;
    removeLeaveTypeFromScheme(schemeId: string, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
