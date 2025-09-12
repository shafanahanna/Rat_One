import { Repository, DataSource } from 'typeorm';
import { LeaveScheme } from '../entities/leave-scheme.entity';
import { SchemeLeaveType } from '../entities/scheme-leave-type.entity';
import { LeaveType } from '../entities/leave-type.entity';
import { CreateLeaveSchemeDto } from '../dto/create-leave-scheme.dto';
import { UpdateLeaveSchemeDto } from '../dto/update-leave-scheme.dto';
import { AddLeaveTypeToSchemeDto } from '../dto/add-leave-type-to-scheme.dto';
import { UpdateSchemeLeaveTypeDto } from '../dto/update-scheme-leave-type.dto';
export declare class LeaveSchemeService {
    private leaveSchemeRepository;
    private schemeLeaveTypeRepository;
    private leaveTypeRepository;
    private dataSource;
    private readonly logger;
    constructor(leaveSchemeRepository: Repository<LeaveScheme>, schemeLeaveTypeRepository: Repository<SchemeLeaveType>, leaveTypeRepository: Repository<LeaveType>, dataSource: DataSource);
    findAll(): Promise<{
        success: boolean;
        data: any[];
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: LeaveScheme;
    }>;
    create(createLeaveSchemeDto: CreateLeaveSchemeDto, userId: string): Promise<{
        success: boolean;
        message: string;
        data: LeaveScheme;
    }>;
    update(id: string, updateLeaveSchemeDto: UpdateLeaveSchemeDto, userId: string): Promise<{
        success: boolean;
        message: string;
        data: LeaveScheme;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getSchemeLeaveTypes(schemeId: string): Promise<{
        success: boolean;
        data: any[];
    }>;
    addLeaveTypeToScheme(schemeId: string, dto: AddLeaveTypeToSchemeDto, userId: string): Promise<{
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
            scheme: LeaveScheme;
            leaveType: LeaveType;
        };
    }>;
    updateSchemeLeaveType(schemeId: string, id: string, dto: UpdateSchemeLeaveTypeDto, userId: string): Promise<{
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
            scheme: LeaveScheme;
            leaveType: LeaveType;
        };
    }>;
    removeLeaveTypeFromScheme(schemeId: string, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
