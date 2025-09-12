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
exports.GlobalLeaveConfigController = void 0;
const common_1 = require("@nestjs/common");
const global_leave_config_service_1 = require("../services/global-leave-config.service");
const create_global_leave_config_dto_1 = require("../dto/create-global-leave-config.dto");
const update_global_leave_config_dto_1 = require("../dto/update-global-leave-config.dto");
let GlobalLeaveConfigController = class GlobalLeaveConfigController {
    constructor(globalLeaveConfigService) {
        this.globalLeaveConfigService = globalLeaveConfigService;
    }
    async create(createGlobalLeaveConfigDto) {
        return this.globalLeaveConfigService.create(createGlobalLeaveConfigDto);
    }
    async findAll(year) {
        if (year) {
            return this.globalLeaveConfigService.findByYear(parseInt(year));
        }
        return this.globalLeaveConfigService.findAll();
    }
    async findOne(id) {
        return this.globalLeaveConfigService.findOne(id);
    }
    async findByKey(key) {
        return this.globalLeaveConfigService.findByKey(key);
    }
    async update(id, updateGlobalLeaveConfigDto) {
        return this.globalLeaveConfigService.update(id, updateGlobalLeaveConfigDto);
    }
    async updateByKey(key, updateGlobalLeaveConfigDto) {
        return this.globalLeaveConfigService.updateByKey(key, updateGlobalLeaveConfigDto);
    }
    async remove(id) {
        return this.globalLeaveConfigService.remove(id);
    }
};
exports.GlobalLeaveConfigController = GlobalLeaveConfigController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_global_leave_config_dto_1.CreateGlobalLeaveConfigDto]),
    __metadata("design:returntype", Promise)
], GlobalLeaveConfigController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GlobalLeaveConfigController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GlobalLeaveConfigController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('key/:key'),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GlobalLeaveConfigController.prototype, "findByKey", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_global_leave_config_dto_1.UpdateGlobalLeaveConfigDto]),
    __metadata("design:returntype", Promise)
], GlobalLeaveConfigController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':key'),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_global_leave_config_dto_1.UpdateGlobalLeaveConfigDto]),
    __metadata("design:returntype", Promise)
], GlobalLeaveConfigController.prototype, "updateByKey", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GlobalLeaveConfigController.prototype, "remove", null);
exports.GlobalLeaveConfigController = GlobalLeaveConfigController = __decorate([
    (0, common_1.Controller)('leave-management/global-config'),
    __metadata("design:paramtypes", [global_leave_config_service_1.GlobalLeaveConfigService])
], GlobalLeaveConfigController);
//# sourceMappingURL=global-leave-config.controller.js.map