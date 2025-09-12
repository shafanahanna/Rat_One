import { Repository, DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { ProfilePictureDto } from './dto/profile-picture.dto';
import { Employee } from './employee.entity';
export declare class EmployeeService {
    private employeeRepository;
    private dataSource;
    private jwtService;
    private configService;
    private cloudinaryService;
    constructor(employeeRepository: Repository<Employee>, dataSource: DataSource, jwtService: JwtService, configService: ConfigService, cloudinaryService: any);
    create(createEmployeeDto: CreateEmployeeDto): Promise<any>;
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<any>;
    remove(id: string): Promise<any>;
    private generateUniqueEmployeeCode;
    getEmployeeProfile(token: string): Promise<any>;
    uploadProfilePicture(employeeId: string, profilePictureDto: ProfilePictureDto): Promise<any>;
    getProfilePicture(employeeId: string): Promise<any>;
    findByUserId(userId: string): Promise<any>;
}
