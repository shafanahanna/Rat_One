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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const roles_service_1 = require("../roles/roles.service");
let PermissionGuard = class PermissionGuard {
    constructor(reflector, rolesService) {
        this.reflector = reflector;
        this.rolesService = rolesService;
    }
    async canActivate(context) {
        const requiredPermissions = this.reflector.get('permissions', context.getHandler());
        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user || !user.role) {
            throw new common_1.UnauthorizedException('User not authenticated or missing role');
        }
        try {
            if (user.role === 'Admin' || user.role === 'Director') {
                return true;
            }
            const customRoles = await this.rolesService.findAll();
            const userCustomRole = customRoles.find(role => role.name === user.role);
            if (!userCustomRole) {
                console.warn(`Role not found: ${user.role}`);
                return false;
            }
            if (userCustomRole.permissions.includes('admin')) {
                return true;
            }
            const hasRequiredPermissions = requiredPermissions.every(permissionOrGroup => {
                if (Array.isArray(permissionOrGroup)) {
                    return permissionOrGroup.some(permission => userCustomRole.permissions.includes(permission));
                }
                else {
                    return userCustomRole.permissions.includes(permissionOrGroup);
                }
            });
            if (!hasRequiredPermissions) {
                console.log(`User with role ${user.role} missing required permissions`);
            }
            return hasRequiredPermissions;
        }
        catch (error) {
            console.error('Error checking permissions:', error);
            return false;
        }
    }
};
exports.PermissionGuard = PermissionGuard;
exports.PermissionGuard = PermissionGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        roles_service_1.RolesService])
], PermissionGuard);
//# sourceMappingURL=permission.guard.js.map