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
exports.RolePermissionsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const roles_service_1 = require("./roles.service");
const permission_guard_1 = require("../guards/permission.guard");
const permissions_decorator_1 = require("../decorators/permissions.decorator");
let RolePermissionsController = class RolePermissionsController {
    constructor(rolesService) {
        this.rolesService = rolesService;
    }
    async getAllRolePermissions() {
        const roles = await this.rolesService.findAll();
        const rolePermissions = {};
        roles.forEach(role => {
            rolePermissions[role.id] = role.permissions;
        });
        return {
            success: true,
            data: rolePermissions
        };
    }
    async getRolePermissions(id) {
        const role = await this.rolesService.findOne(id);
        return {
            success: true,
            data: {
                id: role.id,
                name: role.name,
                permissions: role.permissions
            }
        };
    }
    async updateRolePermissions(id, body) {
        const role = await this.rolesService.findOne(id);
        role.permissions = body.permissionIds;
        const updatedRole = await this.rolesService.update(id, role);
        return {
            success: true,
            message: 'Role permissions updated successfully',
            data: {
                id: updatedRole.id,
                name: updatedRole.name,
                permissions: updatedRole.permissions
            }
        };
    }
};
exports.RolePermissionsController = RolePermissionsController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(permission_guard_1.PermissionGuard),
    (0, permissions_decorator_1.Permissions)('roles.view'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RolePermissionsController.prototype, "getAllRolePermissions", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(permission_guard_1.PermissionGuard),
    (0, permissions_decorator_1.Permissions)('roles.view'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RolePermissionsController.prototype, "getRolePermissions", null);
__decorate([
    (0, common_1.Post)(':id'),
    (0, common_1.UseGuards)(permission_guard_1.PermissionGuard),
    (0, permissions_decorator_1.Permissions)('roles.edit'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RolePermissionsController.prototype, "updateRolePermissions", null);
exports.RolePermissionsController = RolePermissionsController = __decorate([
    (0, common_1.Controller)('role-permissions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [roles_service_1.RolesService])
], RolePermissionsController);
//# sourceMappingURL=role-permissions.controller.js.map