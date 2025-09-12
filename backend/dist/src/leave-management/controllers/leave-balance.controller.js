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
var LeaveBalanceController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveBalanceController = void 0;
const common_1 = require("@nestjs/common");
const leave_balance_service_1 = require("../services/leave-balance.service");
const create_leave_balance_dto_1 = require("../dto/create-leave-balance.dto");
const update_leave_balance_dto_1 = require("../dto/update-leave-balance.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const get_user_decorator_1 = require("../../auth/decorators/get-user.decorator");
let LeaveBalanceController = LeaveBalanceController_1 = class LeaveBalanceController {
    constructor(leaveBalanceService) {
        this.leaveBalanceService = leaveBalanceService;
        this.logger = new common_1.Logger(LeaveBalanceController_1.name);
    }
    create(createLeaveBalanceDto) {
        return this.leaveBalanceService.create(createLeaveBalanceDto);
    }
    async findAll() {
        return await this.leaveBalanceService.findAll();
    }
    async findByEmployee(employeeId, yearParam, user) {
        this.logger.log(`Fetching leave balances for employee: ${employeeId}, year: ${yearParam || 'current'}`);
        this.logger.log(`User object: ${JSON.stringify(user)}`);
        try {
            const year = yearParam ? parseInt(yearParam) : new Date().getFullYear();
            const isHRorDirector = user.role === 'HR' || user.role === 'Director';
            let userEmployeeId = user.employeeId || user.employee_id;
            if (!userEmployeeId) {
                try {
                    this.logger.log(`Employee ID not found in token, attempting to find it for user ID: ${user.id}`);
                    const employeeQuery = await this.leaveBalanceService.findEmployeeByUserId(user.id);
                    if (employeeQuery) {
                        userEmployeeId = employeeQuery.id;
                        this.logger.log(`Found employee ID ${userEmployeeId} for user ${user.id} from database`);
                    }
                    else {
                        this.logger.warn(`No employee record found for user ID: ${user.id}`);
                    }
                }
                catch (err) {
                    this.logger.error(`Error finding employee ID for user ${user.id}: ${err.message}`);
                }
            }
            this.logger.log(`User role: ${user.role}, User ID: ${user.id}, User employee ID: ${userEmployeeId}, Requested employee ID: ${employeeId}`);
            const isUserIdMatchingEmployeeId = String(user.id).toLowerCase() === String(employeeId).toLowerCase();
            const isOwnBalance = (userEmployeeId && String(userEmployeeId).toLowerCase() === String(employeeId).toLowerCase()) || isUserIdMatchingEmployeeId;
            this.logger.log(`Comparing user employee ID: ${userEmployeeId} with requested employee ID: ${employeeId}, match: ${isOwnBalance}`);
            if (!isHRorDirector && !isOwnBalance) {
                this.logger.warn(`User ${user.id} with role ${user.role} attempted to access leave balances for employee ${employeeId}`);
                return {
                    success: false,
                    message: 'You can only view your own leave balances',
                    data: []
                };
            }
            const balances = await this.leaveBalanceService.findByEmployee(employeeId, year);
            this.logger.log(`Found ${balances.length} leave balances for employee ${employeeId} for year ${year}`);
            return {
                success: true,
                data: balances
            };
        }
        catch (error) {
            this.logger.error(`Error fetching leave balances: ${error.message}`, error.stack);
            throw new common_1.BadRequestException(`Failed to fetch leave balances: ${error.message}`);
        }
    }
    findOne(id) {
        return this.leaveBalanceService.findOne(id);
    }
    update(id, updateLeaveBalanceDto) {
        return this.leaveBalanceService.update(id, updateLeaveBalanceDto);
    }
    remove(id) {
        return this.leaveBalanceService.remove(id);
    }
    async populateLeaveBalances(yearParam) {
        this.logger.log(`Populating leave balances for year: ${yearParam}`);
        const year = yearParam ? parseInt(yearParam) : new Date().getFullYear();
        return this.leaveBalanceService.populateLeaveBalances(year);
    }
    async testPopulateLeaveBalances(yearParam) {
        this.logger.log(`Testing leave balance population for year: ${yearParam}`);
        const year = yearParam ? parseInt(yearParam) : new Date().getFullYear();
        try {
            const result = await this.leaveBalanceService.populateLeaveBalances(year);
            return {
                success: true,
                message: 'Leave balance population test completed',
                result
            };
        }
        catch (error) {
            this.logger.error(`Error during leave balance population test: ${error.message}`, error.stack);
            return {
                success: false,
                message: `Error during leave balance population: ${error.message}`,
                error: error.stack
            };
        }
    }
    async getLeaveBalanceStatus(yearParam) {
        const year = yearParam ? parseInt(yearParam) : new Date().getFullYear();
        try {
            const allBalances = await this.leaveBalanceService.findAll();
            const balances = allBalances.filter(balance => balance.year === year);
            const leaveTypeStats = {};
            balances.forEach(balance => {
                const leaveTypeId = balance.leave_type_id;
                if (!leaveTypeStats[leaveTypeId]) {
                    leaveTypeStats[leaveTypeId] = {
                        count: 0,
                        totalAllocated: 0,
                        totalUsed: 0
                    };
                }
                leaveTypeStats[leaveTypeId].count++;
                leaveTypeStats[leaveTypeId].totalAllocated += balance.allocated_days;
                leaveTypeStats[leaveTypeId].totalUsed += balance.used_days || 0;
            });
            return {
                success: true,
                year,
                totalBalances: balances.length,
                leaveTypeStats
            };
        }
        catch (error) {
            this.logger.error(`Error getting leave balance status: ${error.message}`, error.stack);
            return {
                success: false,
                message: `Error getting leave balance status: ${error.message}`,
                error: error.stack
            };
        }
    }
};
exports.LeaveBalanceController = LeaveBalanceController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('HR', 'Director'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_leave_balance_dto_1.CreateLeaveBalanceDto]),
    __metadata("design:returntype", void 0)
], LeaveBalanceController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('HR', 'Director'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LeaveBalanceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('employee/:employeeId'),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, common_1.Query)('year')),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], LeaveBalanceController.prototype, "findByEmployee", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LeaveBalanceController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('HR', 'Director'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_leave_balance_dto_1.UpdateLeaveBalanceDto]),
    __metadata("design:returntype", void 0)
], LeaveBalanceController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('Director'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LeaveBalanceController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('populate'),
    (0, roles_decorator_1.Roles)('HR', 'Director'),
    __param(0, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LeaveBalanceController.prototype, "populateLeaveBalances", null);
__decorate([
    (0, common_1.Get)('test-populate/:year'),
    (0, roles_decorator_1.Roles)('HR', 'Director'),
    __param(0, (0, common_1.Param)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LeaveBalanceController.prototype, "testPopulateLeaveBalances", null);
__decorate([
    (0, common_1.Get)('status/:year'),
    __param(0, (0, common_1.Param)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LeaveBalanceController.prototype, "getLeaveBalanceStatus", null);
exports.LeaveBalanceController = LeaveBalanceController = LeaveBalanceController_1 = __decorate([
    (0, common_1.Controller)('leave-management/leave-balances'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [leave_balance_service_1.LeaveBalanceService])
], LeaveBalanceController);
//# sourceMappingURL=leave-balance.controller.js.map