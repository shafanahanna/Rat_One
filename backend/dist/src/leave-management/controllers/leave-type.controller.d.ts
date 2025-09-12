import { LeaveTypeService } from '../services/leave-type.service';
import { CreateLeaveTypeDto } from '../dto/create-leave-type.dto';
import { UpdateLeaveTypeDto } from '../dto/update-leave-type.dto';
import { Request } from 'express';
export declare class LeaveTypeController {
    private readonly leaveTypeService;
    constructor(leaveTypeService: LeaveTypeService);
    create(createLeaveTypeDto: CreateLeaveTypeDto, req: Request): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    findAll(): Promise<{
        success: boolean;
        data: any;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: any;
    }>;
    update(id: string, updateLeaveTypeDto: UpdateLeaveTypeDto, req: Request): Promise<{
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
