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
exports.EmployeeController = void 0;
const common_1 = require("@nestjs/common");
const employee_service_1 = require("./employee.service");
const create_employee_dto_1 = require("./dto/create-employee.dto");
const update_employee_dto_1 = require("./dto/update-employee.dto");
const profile_picture_dto_1 = require("./dto/profile-picture.dto");
let EmployeeController = class EmployeeController {
    constructor(employeeService) {
        this.employeeService = employeeService;
    }
    async create(createEmployeeDto, req) {
        try {
            console.log('Employee creation DTO received:', createEmployeeDto);
            const result = await this.employeeService.create(createEmployeeDto);
            console.log('Employee created successfully:', result);
            return result;
        }
        catch (error) {
            console.error('Error creating employee:', error);
            if (error.code === '23505') {
                throw new common_1.HttpException('A conflict occurred. This might be due to duplicate employee code or user association.', common_1.HttpStatus.CONFLICT);
            }
            throw new common_1.HttpException(error.message || 'Failed to create employee profile.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findAll() {
        try {
            return await this.employeeService.findAll();
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Failed to fetch employees.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getProfile(authHeader) {
        try {
            if (!authHeader) {
                throw new common_1.UnauthorizedException('No authentication token provided');
            }
            const token = authHeader.split(' ')[1];
            if (!token) {
                throw new common_1.UnauthorizedException('Invalid authorization header format');
            }
            return await this.employeeService.getEmployeeProfile(token);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(error.message || 'Failed to fetch employee profile.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id) {
        try {
            const employee = await this.employeeService.findOne(id);
            if (!employee) {
                throw new common_1.HttpException('Employee not found.', common_1.HttpStatus.NOT_FOUND);
            }
            return employee;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(error.message || 'Failed to fetch employee.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, updateEmployeeDto) {
        try {
            const result = await this.employeeService.update(id, updateEmployeeDto);
            if (!result) {
                throw new common_1.HttpException('Employee not found.', common_1.HttpStatus.NOT_FOUND);
            }
            return {
                status: 'Success',
                message: 'Employee updated successfully.',
                data: result
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            if (error.code === '23505') {
                throw new common_1.HttpException('A conflict occurred. This might be due to duplicate employee code or email.', common_1.HttpStatus.CONFLICT);
            }
            throw new common_1.HttpException(error.message || 'Failed to update employee.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async remove(id) {
        try {
            const result = await this.employeeService.remove(id);
            if (!result) {
                throw new common_1.HttpException('Employee not found.', common_1.HttpStatus.NOT_FOUND);
            }
            return {
                status: 'Success',
                message: 'Employee deleted successfully. User account preserved with Inactive role.',
                data: result
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(error.message || 'Failed to delete employee.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async uploadProfilePicture(employeeId, profilePictureDto, authHeader) {
        try {
            if (!authHeader) {
                throw new common_1.UnauthorizedException('No authentication token provided');
            }
            const token = authHeader.split(' ')[1];
            if (!token) {
                throw new common_1.UnauthorizedException('Invalid authorization header format');
            }
            return await this.employeeService.uploadProfilePicture(employeeId, profilePictureDto);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(error.message || 'Failed to upload profile picture.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getProfilePicture(employeeId) {
        try {
            return await this.employeeService.getProfilePicture(employeeId);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(error.message || 'Failed to get profile picture.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEmployeeByUserId(userId) {
        try {
            const employee = await this.employeeService.findByUserId(userId);
            if (!employee) {
                throw new common_1.HttpException('Employee not found for this user.', common_1.HttpStatus.NOT_FOUND);
            }
            return {
                status: 'Success',
                data: employee
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(error.message || 'Failed to get employee by user ID.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEmployeeByUserIdAlt(userId) {
        try {
            const employee = await this.employeeService.findByUserId(userId);
            if (!employee) {
                throw new common_1.HttpException('Employee not found for this user.', common_1.HttpStatus.NOT_FOUND);
            }
            return {
                status: 'Success',
                data: employee
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(error.message || 'Failed to get employee by user ID.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.EmployeeController = EmployeeController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_employee_dto_1.CreateEmployeeDto, Object]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_employee_dto_1.UpdateEmployeeDto]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('profile-picture/:employeeId'),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, profile_picture_dto_1.ProfilePictureDto, String]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "uploadProfilePicture", null);
__decorate([
    (0, common_1.Get)('profile-picture/:employeeId'),
    __param(0, (0, common_1.Param)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "getProfilePicture", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "getEmployeeByUserId", null);
__decorate([
    (0, common_1.Get)('by-user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "getEmployeeByUserIdAlt", null);
exports.EmployeeController = EmployeeController = __decorate([
    (0, common_1.Controller)('employees'),
    __metadata("design:paramtypes", [employee_service_1.EmployeeService])
], EmployeeController);
//# sourceMappingURL=employee.controller.js.map