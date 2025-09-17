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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../jwt-auth.guard");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const users_service_1 = require("./users.service");
const permissions_decorator_1 = require("../decorators/permissions.decorator");
const permission_guard_1 = require("../guards/permission.guard");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async getAllUsers() {
        try {
            const users = await this.usersService.findAll();
            return {
                status: "Success",
                message: "Users retrieved successfully",
                data: users
            };
        }
        catch (error) {
            console.error("Error getting users:", error);
            throw new common_1.HttpException({
                status: "Error",
                message: "Error retrieving users"
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async addUser(createUserDto) {
        try {
            const newUser = await this.usersService.create(createUserDto);
            return {
                status: "Success",
                message: "USER CREATED SUCCESSFULLY - V2",
                data: newUser
            };
        }
        catch (error) {
            console.error("Error creating user:", error);
            if (error.code === '23505') {
                throw new common_1.HttpException({
                    status: "Error",
                    message: "A user with this email already exists."
                }, common_1.HttpStatus.CONFLICT);
            }
            throw new common_1.HttpException({
                status: "Error",
                message: "An internal error occurred while creating the user."
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getUser(id) {
        try {
            const user = await this.usersService.findOne(id);
            return {
                status: "Success",
                message: "User retrieved successfully",
                data: user
            };
        }
        catch (error) {
            console.error("Error getting user:", error);
            throw new common_1.HttpException({
                status: "Error",
                message: "Error retrieving user"
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateUser(id, updateUserDto) {
        try {
            const updatedUser = await this.usersService.update(id, updateUserDto);
            return {
                status: "Success",
                message: "User updated successfully",
                data: updatedUser
            };
        }
        catch (error) {
            console.error("Error updating user:", error);
            if (error.code === '23505') {
                throw new common_1.HttpException({
                    status: "Error",
                    message: "A user with this email already exists."
                }, common_1.HttpStatus.CONFLICT);
            }
            throw new common_1.HttpException({
                status: "Error",
                message: "An internal error occurred while updating the user."
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteUser(id) {
        try {
            await this.usersService.remove(id);
            return {
                status: "Success",
                message: "User deleted successfully"
            };
        }
        catch (error) {
            console.error("Error deleting user:", error);
            throw new common_1.HttpException({
                status: "Error",
                message: "An internal error occurred while deleting the user."
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getUnassignedUsers() {
        try {
            const users = await this.usersService.getUnassignedUsers();
            return {
                status: "Success",
                message: "Unassigned users retrieved successfully",
                data: users
            };
        }
        catch (error) {
            console.error("Error getting unassigned users:", error);
            throw new common_1.HttpException({
                status: "Error",
                message: "Error retrieving unassigned users"
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permission_guard_1.PermissionGuard),
    (0, permissions_decorator_1.Permissions)('users.view'),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permission_guard_1.PermissionGuard),
    (0, permissions_decorator_1.Permissions)('users.create'),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "addUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permission_guard_1.PermissionGuard),
    (0, permissions_decorator_1.Permissions)('users.view'),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permission_guard_1.PermissionGuard),
    (0, permissions_decorator_1.Permissions)('users.edit'),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permission_guard_1.PermissionGuard),
    (0, permissions_decorator_1.Permissions)('users.delete'),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permission_guard_1.PermissionGuard),
    (0, permissions_decorator_1.Permissions)(['users', 'hr']),
    (0, common_1.Get)('unassigned'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUnassignedUsers", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('api/users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map