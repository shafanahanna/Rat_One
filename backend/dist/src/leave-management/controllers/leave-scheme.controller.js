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
exports.LeaveSchemeController = void 0;
const common_1 = require("@nestjs/common");
const leave_scheme_service_1 = require("../services/leave-scheme.service");
const create_leave_scheme_dto_1 = require("../dto/create-leave-scheme.dto");
const update_leave_scheme_dto_1 = require("../dto/update-leave-scheme.dto");
const add_leave_type_to_scheme_dto_1 = require("../dto/add-leave-type-to-scheme.dto");
const update_scheme_leave_type_dto_1 = require("../dto/update-scheme-leave-type.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let LeaveSchemeController = class LeaveSchemeController {
    constructor(leaveSchemeService) {
        this.leaveSchemeService = leaveSchemeService;
    }
    async create(createLeaveSchemeDto, req) {
        const userId = req.user['id'];
        return this.leaveSchemeService.create(createLeaveSchemeDto, userId);
    }
    async findAll() {
        return this.leaveSchemeService.findAll();
    }
    async findOne(id) {
        return this.leaveSchemeService.findOne(id);
    }
    async update(id, updateLeaveSchemeDto, req) {
        const userId = req.user['id'];
        return this.leaveSchemeService.update(id, updateLeaveSchemeDto, userId);
    }
    async remove(id) {
        return this.leaveSchemeService.remove(id);
    }
    async getSchemeLeaveTypes(schemeId) {
        return this.leaveSchemeService.getSchemeLeaveTypes(schemeId);
    }
    async addLeaveTypeToScheme(schemeId, dto, req) {
        const userId = req.user['id'];
        return this.leaveSchemeService.addLeaveTypeToScheme(schemeId, dto, userId);
    }
    async updateSchemeLeaveType(schemeId, id, dto, req) {
        const userId = req.user['id'];
        return this.leaveSchemeService.updateSchemeLeaveType(schemeId, id, dto, userId);
    }
    async removeLeaveTypeFromScheme(schemeId, id) {
        return this.leaveSchemeService.removeLeaveTypeFromScheme(schemeId, id);
    }
};
exports.LeaveSchemeController = LeaveSchemeController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_leave_scheme_dto_1.CreateLeaveSchemeDto, Object]),
    __metadata("design:returntype", Promise)
], LeaveSchemeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LeaveSchemeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LeaveSchemeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_leave_scheme_dto_1.UpdateLeaveSchemeDto, Object]),
    __metadata("design:returntype", Promise)
], LeaveSchemeController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LeaveSchemeController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':scheme_id/leave-types'),
    __param(0, (0, common_1.Param)('scheme_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LeaveSchemeController.prototype, "getSchemeLeaveTypes", null);
__decorate([
    (0, common_1.Post)(':scheme_id/leave-types'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('scheme_id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, add_leave_type_to_scheme_dto_1.AddLeaveTypeToSchemeDto, Object]),
    __metadata("design:returntype", Promise)
], LeaveSchemeController.prototype, "addLeaveTypeToScheme", null);
__decorate([
    (0, common_1.Patch)(':scheme_id/leave-types/:id'),
    __param(0, (0, common_1.Param)('scheme_id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_scheme_leave_type_dto_1.UpdateSchemeLeaveTypeDto, Object]),
    __metadata("design:returntype", Promise)
], LeaveSchemeController.prototype, "updateSchemeLeaveType", null);
__decorate([
    (0, common_1.Delete)(':scheme_id/leave-types/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('scheme_id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LeaveSchemeController.prototype, "removeLeaveTypeFromScheme", null);
exports.LeaveSchemeController = LeaveSchemeController = __decorate([
    (0, common_1.Controller)('leave-management/schemes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [leave_scheme_service_1.LeaveSchemeService])
], LeaveSchemeController);
//# sourceMappingURL=leave-scheme.controller.js.map