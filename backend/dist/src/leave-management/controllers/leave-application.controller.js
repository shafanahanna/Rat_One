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
var LeaveApplicationController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveApplicationController = void 0;
const common_1 = require("@nestjs/common");
const leave_application_service_1 = require("../services/leave-application.service");
const leave_type_service_1 = require("../services/leave-type.service");
const create_leave_application_dto_1 = require("../dto/create-leave-application.dto");
const update_leave_application_dto_1 = require("../dto/update-leave-application.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const get_user_decorator_1 = require("../../auth/decorators/get-user.decorator");
const employee_service_1 = require("../../employee/employee.service");
let LeaveApplicationController = LeaveApplicationController_1 = class LeaveApplicationController {
    constructor(leaveApplicationService, leaveTypeService, employeeService) {
        this.leaveApplicationService = leaveApplicationService;
        this.leaveTypeService = leaveTypeService;
        this.employeeService = employeeService;
        this.logger = new common_1.Logger(LeaveApplicationController_1.name);
    }
    create(createLeaveApplicationDto, user) {
        this.logger.log(`Creating leave application for user: ${user.userId}`);
        if (!createLeaveApplicationDto.leave_duration_type) {
            createLeaveApplicationDto['leave_duration_type'] = 'full_day';
        }
        if (createLeaveApplicationDto.employee_id &&
            createLeaveApplicationDto.employee_id !== user.userId &&
            !['HR', 'Director'].includes(user.role)) {
            return {
                message: 'You do not have permission to apply leave for other employees',
            };
        }
        return this.leaveApplicationService.create(createLeaveApplicationDto, user.userId);
    }
    async testApiAccess(user) {
        this.logger.log('Test API endpoint accessed');
        this.logger.log('User from request:', JSON.stringify(user || {}));
        try {
            const count = await this.leaveApplicationService.countAll();
            return {
                message: 'API access successful',
                user: user || 'No user found',
                leaveApplicationsCount: count,
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            this.logger.error(`Error in test endpoint: ${error.message}`);
            return {
                message: 'API access successful but database error occurred',
                error: error.message
            };
        }
    }
    async findAll(status, user, request) {
        console.log('=== LEAVE APPLICATION API REQUEST ===');
        console.log(`Endpoint: GET /api/leave-management/leave-applications`);
        console.log(`Status parameter: ${status || 'all'}`);
        console.log(`Status parameter type: ${typeof status}`);
        console.log(`Query parameters:`, request?.query);
        console.log('===============================');
        this.logger.log(`Fetching leave applications with status filter: ${status || 'all'}`);
        this.logger.log('Request headers:', JSON.stringify(request?.headers || {}));
        this.logger.log('User from request:', JSON.stringify(user || {}));
        this.logger.log('User role:', user?.role);
        this.logger.log('Authorization header exists:', !!request?.headers?.authorization);
        this.logger.log(`Status parameter type: ${typeof status}`);
        this.logger.log(`Status parameter value: '${status}'`);
        try {
            const results = await this.leaveApplicationService.findAll(status);
            console.log('=== LEAVE APPLICATION API RESPONSE ===');
            console.log(`Results count: ${results.length}`);
            if (results.length > 0) {
                console.log('First result status:', results[0].status);
                console.log('First result ID:', results[0].id);
                console.log('Status values in results:', results.map(r => r.status));
            }
            else {
                console.log('No results found');
            }
            console.log('===============================');
            this.logger.log(`Found ${results.length} leave applications with status: ${status || 'all'}`);
            return results;
        }
        catch (error) {
            console.log('=== LEAVE APPLICATION API RESPONSE ===');
            console.log(`Error: ${error.message}`);
            console.log('===============================');
            this.logger.error(`Error fetching leave applications: ${error.message}`);
            this.logger.error(error.stack);
            throw error;
        }
    }
    findByEmployee(employeeId, status, user) {
        if (!['HR', 'Director'].includes(user.role) && user.employeeId !== employeeId) {
            return {
                message: 'You can only view your own leave applications',
            };
        }
        this.logger.log(`Fetching leave applications for employee ${employeeId} with status filter: ${status || 'all'}`);
        if (status) {
            return this.leaveApplicationService.findByEmployeeWithStatus(employeeId, status);
        }
        else {
            return this.leaveApplicationService.findByEmployee(employeeId);
        }
    }
    findOne(id) {
        return this.leaveApplicationService.findOne(id);
    }
    update(id, updateLeaveApplicationDto, user) {
        const leaveApplication = this.leaveApplicationService.findOne(id);
        if (!['HR', 'Director'].includes(user.role) &&
            user.employeeId !== leaveApplication['employee_id']) {
            return {
                message: 'You do not have permission to update this leave application',
            };
        }
        return this.leaveApplicationService.update(id, updateLeaveApplicationDto);
    }
    async updateStatus(id, statusUpdate, user) {
        this.logger.log(`Updating leave application status: ${id} to ${statusUpdate.status} by employee ${user.employeeId || 'unknown'}`);
        const validStatuses = ['pending', 'approved', 'rejected'];
        if (!validStatuses.includes(statusUpdate.status)) {
            return {
                success: false,
                message: `Invalid status value. Must be one of: ${validStatuses.join(', ')}`
            };
        }
        try {
            try {
                await this.leaveApplicationService.findOne(id);
                this.logger.log(`Found leave application with ID: ${id}`);
            }
            catch (error) {
                this.logger.error(`Error finding leave application with ID ${id}: ${error.message}`);
                return {
                    success: false,
                    message: `Could not find leave application with ID ${id}.`,
                    error: error.message
                };
            }
            let employeeId = user.employeeId;
            if (!employeeId) {
                try {
                    const employee = await this.employeeService.findByUserId(user.userId);
                    employeeId = employee.id;
                    this.logger.log(`Found employee ID ${employeeId} for user ${user.userId}`);
                }
                catch (error) {
                    this.logger.error(`Error finding employee for user ${user.userId}: ${error.message}`);
                    return {
                        success: false,
                        message: `Could not find employee record for the current user. Please contact HR.`,
                        error: error.message
                    };
                }
            }
            this.logger.log(`Processing approval - Leave Application ID: ${id}, Approver ID: ${employeeId}, Status: ${statusUpdate.status}`);
            const result = await this.leaveApplicationService.updateStatus(id, statusUpdate.status, employeeId, statusUpdate.comments || '');
            return {
                success: true,
                message: `Leave application status updated to ${statusUpdate.status}`,
                data: result
            };
        }
        catch (error) {
            this.logger.error(`Error updating leave application status: ${error.message}`, error.stack);
            return {
                success: false,
                message: error.message,
                error: error.stack
            };
        }
    }
    cancel(id, user) {
        const leaveApplication = this.leaveApplicationService.findOne(id);
        if (!['HR', 'Director'].includes(user.role) &&
            user.employeeId !== leaveApplication['employee_id']) {
            return {
                message: 'You do not have permission to cancel this leave application',
            };
        }
        return this.leaveApplicationService.cancel(id);
    }
    remove(id) {
        return this.leaveApplicationService.remove(id);
    }
    findAllLeaveTypes() {
        return this.leaveTypeService.findAll();
    }
};
exports.LeaveApplicationController = LeaveApplicationController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_leave_application_dto_1.CreateLeaveApplicationDto, Object]),
    __metadata("design:returntype", void 0)
], LeaveApplicationController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('test-api'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LeaveApplicationController.prototype, "testApiAccess", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('HR', 'Director', 'DM'),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], LeaveApplicationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('employee/:employeeId'),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], LeaveApplicationController.prototype, "findByEmployee", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LeaveApplicationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_leave_application_dto_1.UpdateLeaveApplicationDto, Object]),
    __metadata("design:returntype", void 0)
], LeaveApplicationController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, roles_decorator_1.Roles)('HR', 'Director', 'DM'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], LeaveApplicationController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LeaveApplicationController.prototype, "cancel", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('Director'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LeaveApplicationController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('leave-types'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LeaveApplicationController.prototype, "findAllLeaveTypes", null);
exports.LeaveApplicationController = LeaveApplicationController = LeaveApplicationController_1 = __decorate([
    (0, common_1.Controller)('leave-management/leave-applications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [leave_application_service_1.LeaveApplicationService,
        leave_type_service_1.LeaveTypeService,
        employee_service_1.EmployeeService])
], LeaveApplicationController);
//# sourceMappingURL=leave-application.controller.js.map