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
exports.LeaveTypeController = void 0;
const common_1 = require("@nestjs/common");
const leave_type_service_1 = require("../services/leave-type.service");
const create_leave_type_dto_1 = require("../dto/create-leave-type.dto");
const update_leave_type_dto_1 = require("../dto/update-leave-type.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let LeaveTypeController = class LeaveTypeController {
    constructor(leaveTypeService) {
        this.leaveTypeService = leaveTypeService;
    }
    async create(createLeaveTypeDto, req) {
        const userId = req.user['id'];
        return this.leaveTypeService.create(createLeaveTypeDto, userId);
    }
    async findAll() {
        return this.leaveTypeService.findAll();
    }
    async findOne(id) {
        return this.leaveTypeService.findOne(id);
    }
    async update(id, updateLeaveTypeDto, req) {
        const userId = req.user['id'];
        return this.leaveTypeService.update(id, updateLeaveTypeDto, userId);
    }
    async remove(id) {
        return this.leaveTypeService.remove(id);
    }
    async softDelete(id) {
        return this.leaveTypeService.softDelete(id);
    }
};
exports.LeaveTypeController = LeaveTypeController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_leave_type_dto_1.CreateLeaveTypeDto, Object]),
    __metadata("design:returntype", Promise)
], LeaveTypeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LeaveTypeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LeaveTypeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_leave_type_dto_1.UpdateLeaveTypeDto, Object]),
    __metadata("design:returntype", Promise)
], LeaveTypeController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LeaveTypeController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/soft-delete'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LeaveTypeController.prototype, "softDelete", null);
exports.LeaveTypeController = LeaveTypeController = __decorate([
    (0, common_1.Controller)('leave-management/types'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [leave_type_service_1.LeaveTypeService])
], LeaveTypeController);
//# sourceMappingURL=leave-type.controller.js.map