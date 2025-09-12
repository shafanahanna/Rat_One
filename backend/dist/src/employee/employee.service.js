"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const employee_entity_1 = require("./employee.entity");
let EmployeeService = class EmployeeService {
    constructor(employeeRepository, dataSource, jwtService, configService, cloudinaryService) {
        this.employeeRepository = employeeRepository;
        this.dataSource = dataSource;
        this.jwtService = jwtService;
        this.configService = configService;
        this.cloudinaryService = cloudinaryService;
    }
    async create(createEmployeeDto) {
        console.log('Service: Creating employee with DTO:', JSON.stringify(createEmployeeDto, null, 2));
        const existingEmployee = await this.employeeRepository
            .createQueryBuilder('employee')
            .where('employee.userId = :userId', { userId: createEmployeeDto.user_id })
            .getOne();
        if (existingEmployee) {
            console.log('Service: User already has an employee profile', existingEmployee);
            throw new common_1.ConflictException('User already has an employee profile');
        }
        let empCode = createEmployeeDto.emp_code;
        if (!empCode) {
            empCode = await this.generateUniqueEmployeeCode();
        }
        else {
            const empCodeExists = await this.employeeRepository
                .createQueryBuilder('employee')
                .where('employee.empCode = :empCode', { empCode })
                .getOne();
            if (empCodeExists) {
                throw new common_1.ConflictException('Employee code already exists');
            }
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            console.log('Service: Creating employee entity with:', {
                userId: createEmployeeDto.user_id,
                fullName: createEmployeeDto.full_name,
                designation: createEmployeeDto.designation,
                department: createEmployeeDto.department,
                salary: createEmployeeDto.salary,
                dateOfJoining: new Date(createEmployeeDto.date_of_joining),
                empCode: empCode,
                branchId: createEmployeeDto.branch_id,
            });
            const employee = this.employeeRepository.create({
                userId: createEmployeeDto.user_id,
                fullName: createEmployeeDto.full_name,
                designation: createEmployeeDto.designation,
                department: createEmployeeDto.department,
                salary: createEmployeeDto.salary,
                dateOfJoining: new Date(createEmployeeDto.date_of_joining),
                empCode: empCode,
                branchId: createEmployeeDto.branch_id,
            });
            console.log('Service: Saving employee entity:', employee);
            const savedEmployee = await queryRunner.manager.save(employee);
            console.log('Service: Employee saved successfully:', savedEmployee);
            await queryRunner.commitTransaction();
            return {
                status: 'Success',
                message: 'Employee profile created successfully',
                data: {
                    id: savedEmployee.id,
                    emp_code: savedEmployee.empCode,
                },
            };
        }
        catch (error) {
            console.error('Service: Error creating employee:', error);
            console.error('Service: Error details:', error.message);
            if (error.detail) {
                console.error('Service: SQL error details:', error.detail);
            }
            await queryRunner.rollbackTransaction();
            if (error.code === '23505') {
                throw new common_1.ConflictException('A conflict occurred with existing data');
            }
            throw new common_1.InternalServerErrorException(`Failed to create employee profile: ${error.message}`);
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll() {
        const employees = await this.employeeRepository
            .createQueryBuilder('e')
            .leftJoinAndSelect('e.user', 'u')
            .leftJoinAndSelect('e.branch', 'b')
            .select([
            'e.id', 'e.fullName', 'e.designation', 'e.department',
            'e.salary', 'e.dateOfJoining', 'e.empCode',
            'u.id', 'u.email', 'u.role',
            'b.id',
        ])
            .getMany();
        const enrichedData = employees;
        return {
            status: 'Success',
            data: enrichedData
        };
    }
    async findOne(id) {
        const employee = await this.employeeRepository
            .createQueryBuilder('e')
            .leftJoinAndSelect('e.user', 'u')
            .leftJoinAndSelect('e.branch', 'b')
            .select([
            'e.id', 'e.fullName', 'e.designation', 'e.department',
            'e.salary', 'e.dateOfJoining', 'e.empCode',
            'u.id', 'u.email', 'u.role',
            'b.id',
        ])
            .where('e.id = :id', { id })
            .getOne();
        if (!employee) {
            throw new common_1.NotFoundException('Employee not found');
        }
        const employeeData = {
            ...employee
        };
        return {
            status: 'Success',
            data: employeeData
        };
    }
    async update(id, updateEmployeeDto) {
        const employee = await this.employeeRepository.findOne({ where: { id } });
        if (!employee) {
            throw new common_1.NotFoundException('Employee not found');
        }
        if (updateEmployeeDto.emp_code && updateEmployeeDto.emp_code !== employee.empCode) {
            const empCodeExists = await this.employeeRepository
                .createQueryBuilder('employee')
                .where('employee.empCode = :empCode AND employee.id != :id', {
                empCode: updateEmployeeDto.emp_code,
                id
            })
                .getOne();
            if (empCodeExists) {
                throw new common_1.ConflictException('Employee code already exists');
            }
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            if (updateEmployeeDto.designation)
                employee.designation = updateEmployeeDto.designation;
            if (updateEmployeeDto.department)
                employee.department = updateEmployeeDto.department;
            if (updateEmployeeDto.salary) {
                if (employee.salary !== updateEmployeeDto.salary) {
                    employee.proposedSalary = updateEmployeeDto.salary;
                    employee.salaryStatus = 'Pending';
                }
            }
            if (updateEmployeeDto.emp_code)
                employee.empCode = updateEmployeeDto.emp_code;
            if (updateEmployeeDto.date_of_joining)
                employee.dateOfJoining = updateEmployeeDto.date_of_joining;
            if (updateEmployeeDto.branch_id)
                employee.branchId = updateEmployeeDto.branch_id;
            await queryRunner.manager.save(employee);
            if (updateEmployeeDto.name || updateEmployeeDto.email || updateEmployeeDto.role) {
                const updateFields = [];
                const updateValues = [];
                let paramIndex = 1;
                if (updateEmployeeDto.name) {
                    updateFields.push(`name = $${paramIndex}`);
                    updateValues.push(updateEmployeeDto.name);
                    paramIndex++;
                }
                if (updateEmployeeDto.email) {
                    if (updateEmployeeDto.email) {
                        const emailExists = await queryRunner.query(`SELECT id FROM users WHERE email = $1 AND id != (SELECT user_id FROM employees WHERE id = $2)`, [updateEmployeeDto.email, id]);
                        if (emailExists.length > 0) {
                            throw new common_1.ConflictException('Email already exists');
                        }
                    }
                    updateFields.push(`email = $${paramIndex}`);
                    updateValues.push(updateEmployeeDto.email);
                    paramIndex++;
                }
                if (updateEmployeeDto.role) {
                    updateFields.push(`role = $${paramIndex}`);
                    updateValues.push(updateEmployeeDto.role);
                    paramIndex++;
                }
                if (updateFields.length > 0) {
                    await queryRunner.query(`UPDATE users SET ${updateFields.join(', ')} WHERE id = (SELECT user_id FROM employees WHERE id = $${paramIndex})`, [...updateValues, id]);
                }
            }
            await queryRunner.commitTransaction();
            const updatedEmployee = await this.findOne(id);
            return updatedEmployee;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Failed to update employee profile');
        }
        finally {
            await queryRunner.release();
        }
    }
    async remove(id) {
        const employee = await this.employeeRepository.findOne({ where: { id } });
        if (!employee) {
            throw new common_1.NotFoundException('Employee not found');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.remove(employee);
            await queryRunner.query(`UPDATE users SET role = 'Inactive' WHERE id = $1`, [employee.userId]);
            await queryRunner.commitTransaction();
            return {
                status: 'Success',
                message: 'Employee deleted successfully',
                data: { id }
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Failed to delete employee');
        }
        finally {
            await queryRunner.release();
        }
    }
    async generateUniqueEmployeeCode(retryCount = 0) {
        if (retryCount > 10) {
            throw new common_1.InternalServerErrorException('Failed to generate unique employee code');
        }
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        const empCode = `EMP-${randomNum}`;
        const exists = await this.employeeRepository
            .createQueryBuilder('employee')
            .where('employee.empCode = :empCode', { empCode })
            .getOne();
        if (exists) {
            return this.generateUniqueEmployeeCode(retryCount + 1);
        }
        return empCode;
    }
    async getEmployeeProfile(token) {
        if (!token) {
            throw new common_1.UnauthorizedException('No authentication token provided');
        }
        let decoded;
        try {
            decoded = this.jwtService.verify(token, {
                secret: this.configService.get('JWT_SECRET')
            });
        }
        catch (jwtError) {
            try {
                decoded = this.jwtService.verify(token, {
                    secret: this.configService.get('ADMIN_ACCESS_TOKEN')
                });
            }
            catch (adminJwtError) {
                console.error('JWT verification failed with both secrets:', adminJwtError);
                throw new common_1.UnauthorizedException('Invalid authentication token');
            }
        }
        const userId = decoded.id;
        console.log('Decoded user ID from token:', userId);
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const userResult = await queryRunner.query(`SELECT id as user_id, email, role, username
         FROM users
         WHERE id = $1`, [userId]);
            if (userResult.length === 0) {
                throw new common_1.NotFoundException('User not found');
            }
            const userData = userResult[0];
            console.log('User data found:', userData);
            try {
                const employeeResult = await queryRunner.query(`SELECT id as employee_id, full_name, department, designation, emp_code, date_of_joining, profile_picture, user_id
           FROM employees
           WHERE user_id = $1`, [userId]);
                if (employeeResult && employeeResult.length > 0) {
                    const employeeData = employeeResult[0];
                    await queryRunner.commitTransaction();
                    return {
                        status: 'Success',
                        data: {
                            id: employeeData.employee_id,
                            full_name: employeeData.full_name,
                            department: employeeData.department,
                            designation: employeeData.designation,
                            emp_code: employeeData.emp_code,
                            date_of_joining: employeeData.date_of_joining,
                            profile_picture: employeeData.profile_picture,
                            email: userData.email,
                            user_id: userData.user_id,
                            role: userData.role,
                            username: userData.username
                        }
                    };
                }
                else {
                }
            }
            catch (directQueryError) {
                console.log('Direct employee query failed:', directQueryError.message);
            }
            await queryRunner.commitTransaction();
            return {
                status: 'Success',
                data: {
                    id: null,
                    full_name: userData.username || null,
                    department: null,
                    designation: null,
                    emp_code: null,
                    profile_picture: null,
                    email: userData.email,
                    user_id: userData.user_id,
                    role: userData.role,
                    username: userData.username,
                    isMinimalProfile: true
                }
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            if (error instanceof common_1.NotFoundException || error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            console.error('Error getting employee profile:', error);
            throw new common_1.InternalServerErrorException(`Internal server error: ${error.message}`);
        }
        finally {
            await queryRunner.release();
        }
    }
    async uploadProfilePicture(employeeId, profilePictureDto) {
        try {
            const employee = await this.employeeRepository.findOne({ where: { id: employeeId } });
            if (!employee) {
                throw new common_1.NotFoundException('Employee not found');
            }
            const { profilePictureUrl } = profilePictureDto;
            if (!profilePictureUrl) {
                throw new common_1.BadRequestException('No profile picture provided');
            }
            let secureUrl;
            if (profilePictureUrl.startsWith('data:image')) {
                secureUrl = await this.cloudinaryService.uploadImage(profilePictureUrl);
            }
            else {
                secureUrl = profilePictureUrl;
            }
            employee.profilePicture = secureUrl;
            await this.employeeRepository.save(employee);
            return {
                status: 'Success',
                message: 'Profile picture updated successfully',
                data: {
                    profile_picture: secureUrl
                }
            };
        }
        catch (error) {
            console.error('Error uploading profile picture:', error);
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(`Failed to upload profile picture: ${error.message}`);
        }
    }
    async getProfilePicture(employeeId) {
        try {
            const employee = await this.employeeRepository.findOne({ where: { id: employeeId } });
            if (!employee) {
                throw new common_1.NotFoundException('Employee not found');
            }
            return {
                status: 'Success',
                data: {
                    profile_picture: employee.profilePicture
                }
            };
        }
        catch (error) {
            console.error('Error getting profile picture:', error);
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(`Failed to get profile picture: ${error.message}`);
        }
    }
    async findByUserId(userId) {
        try {
            const employee = await this.employeeRepository
                .createQueryBuilder('e')
                .leftJoinAndSelect('e.user', 'u')
                .leftJoinAndSelect('e.branch', 'b')
                .select([
                'e.id', 'e.fullName', 'e.designation', 'e.department',
                'e.salary', 'e.dateOfJoining', 'e.empCode', 'e.userId',
                'u.id', 'u.email', 'u.role',
                'b.id', 'b.branch_name'
            ])
                .where('e.userId = :userId', { userId })
                .getOne();
            if (!employee) {
                throw new common_1.NotFoundException(`Employee not found for user ID: ${userId}`);
            }
            return employee;
        }
        catch (error) {
            console.error('Error finding employee by user ID:', error);
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(`Failed to find employee by user ID: ${error.message}`);
        }
    }
};
exports.EmployeeService = EmployeeService;
exports.EmployeeService = EmployeeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __param(4, (0, common_1.Inject)('CLOUDINARY_SERVICE')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource,
        jwt_1.JwtService,
        config_1.ConfigService, Object])
], EmployeeService);
//# sourceMappingURL=employee.service.js.map