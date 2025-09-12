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
exports.EmployeeLeaveSchemeController = void 0;
const common_1 = require("@nestjs/common");
const employee_leave_scheme_service_1 = require("../services/employee-leave-scheme.service");
const assign_scheme_to_employee_dto_1 = require("../dto/assign-scheme-to-employee.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let EmployeeLeaveSchemeController = class EmployeeLeaveSchemeController {
    constructor(employeeLeaveSchemeService) {
        this.employeeLeaveSchemeService = employeeLeaveSchemeService;
    }
    async create(dto, req) {
        const userId = req.user['id'];
        return this.employeeLeaveSchemeService.create(dto, userId);
    }
    async findByEmployeeId(employeeId) {
        return this.employeeLeaveSchemeService.findByEmployeeId(employeeId);
    }
    async getCurrentSchemeForEmployee(employeeId, date) {
        return this.employeeLeaveSchemeService.getCurrentSchemeForEmployee(employeeId, date);
    }
    async findOne(id) {
        return this.employeeLeaveSchemeService.findOne(id);
    }
    async update(id, dto, req) {
        const userId = req.user['id'];
        return this.employeeLeaveSchemeService.update(id, dto, userId);
    }
    async remove(id) {
        return this.employeeLeaveSchemeService.remove(id);
    }
};
exports.EmployeeLeaveSchemeController = EmployeeLeaveSchemeController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [assign_scheme_to_employee_dto_1.AssignSchemeToEmployeeDto, Object]),
    __metadata("design:returntype", Promise)
], EmployeeLeaveSchemeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('employee/:employeeId'),
    __param(0, (0, common_1.Param)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeLeaveSchemeController.prototype, "findByEmployeeId", null);
__decorate([
    (0, common_1.Get)('employee/:employeeId/current'),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EmployeeLeaveSchemeController.prototype, "getCurrentSchemeForEmployee", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeLeaveSchemeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], EmployeeLeaveSchemeController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeLeaveSchemeController.prototype, "remove", null);
exports.EmployeeLeaveSchemeController = EmployeeLeaveSchemeController = __decorate([
    (0, common_1.Controller)('leave-management/employee-schemes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [employee_leave_scheme_service_1.EmployeeLeaveSchemeService])
], EmployeeLeaveSchemeController);
//# sourceMappingURL=employee-leave-scheme.controller.js.map