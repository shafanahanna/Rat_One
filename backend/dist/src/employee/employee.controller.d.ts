import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { ProfilePictureDto } from './dto/profile-picture.dto';
import { Request } from 'express';
export declare class EmployeeController {
    private readonly employeeService;
    constructor(employeeService: EmployeeService);
    create(createEmployeeDto: CreateEmployeeDto, req: Request): Promise<any>;
    findAll(): Promise<any>;
    getProfile(authHeader: string): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<{
        status: string;
        message: string;
        data: any;
    }>;
    remove(id: string): Promise<{
        status: string;
        message: string;
        data: any;
    }>;
    uploadProfilePicture(employeeId: string, profilePictureDto: ProfilePictureDto, authHeader: string): Promise<any>;
    getProfilePicture(employeeId: string): Promise<any>;
    getEmployeeByUserId(userId: string): Promise<{
        status: string;
        data: any;
    }>;
    getEmployeeByUserIdAlt(userId: string): Promise<{
        status: string;
        data: any;
    }>;
}
