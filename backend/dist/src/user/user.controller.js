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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const update_user_branch_dto_1 = require("./dto/update-user-branch.dto");
const bulk_update_user_branch_dto_1 = require("./dto/bulk-update-user-branch.dto");
const user_service_1 = require("./user.service");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async getUsersWithContext() {
        const users = await this.userService.findAllWithContext();
        return { data: users };
    }
    async getUserWithContext(id) {
        const user = await this.userService.findOneWithContext(id);
        return { data: user };
    }
    async updateUserBranch(id, updateUserBranchDto) {
        const updatedUser = await this.userService.updateUserBranch(id, updateUserBranchDto.branch_id);
        return { data: updatedUser };
    }
    async bulkUpdateUserBranch(bulkUpdateDto) {
        const result = await this.userService.bulkUpdateUserBranch(bulkUpdateDto.user_ids, bulkUpdateDto.branch_id);
        return {
            message: `${result.updated_count} users updated successfully`,
            data: result
        };
    }
    async getUsersByBranch(branchId) {
        const users = await this.userService.findByBranch(branchId);
        return { data: users };
    }
    async getUsersByCountry(countryId) {
        const users = await this.userService.findByCountry(countryId);
        return { data: users };
    }
    async getUnassignedUsers() {
        const users = await this.userService.findUnassigned();
        return { data: users };
    }
    async getAssignmentStats() {
        const stats = await this.userService.getAssignmentStats();
        return { data: stats };
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)('with-context'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUsersWithContext", null);
__decorate([
    (0, common_1.Get)(':id/context'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserWithContext", null);
__decorate([
    (0, common_1.Put)(':id/branch'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_branch_dto_1.UpdateUserBranchDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUserBranch", null);
__decorate([
    (0, common_1.Put)('bulk-branch-update'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bulk_update_user_branch_dto_1.BulkUpdateUserBranchDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "bulkUpdateUserBranch", null);
__decorate([
    (0, common_1.Get)('branch/:branch_id'),
    __param(0, (0, common_1.Param)('branch_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUsersByBranch", null);
__decorate([
    (0, common_1.Get)('country/:country_id'),
    __param(0, (0, common_1.Param)('country_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUsersByCountry", null);
__decorate([
    (0, common_1.Get)('unassigned'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUnassignedUsers", null);
__decorate([
    (0, common_1.Get)('assignment-stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAssignmentStats", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('/users'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map