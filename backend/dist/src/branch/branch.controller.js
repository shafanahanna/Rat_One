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
exports.BranchController = void 0;
const common_1 = require("@nestjs/common");
const branch_service_1 = require("./branch.service");
const create_branch_dto_1 = require("./dto/create-branch.dto");
const update_branch_dto_1 = require("./dto/update-branch.dto");
let BranchController = class BranchController {
    constructor(branchService) {
        this.branchService = branchService;
    }
    create(createBranchDto) {
        return { data: this.branchService.create(createBranchDto) };
    }
    async findAll() {
        const branches = await this.branchService.getBranchesWithUserCount();
        return { data: branches };
    }
    async findByCountry(countryId) {
        const branches = await this.branchService.getBranchesByCountry(countryId);
        return { data: branches };
    }
    async findByCode(branchCode) {
        const branch = await this.branchService.getBranchByCode(branchCode);
        return { data: branch };
    }
    async findOne(id) {
        const branch = await this.branchService.findOne(id);
        return { data: branch };
    }
    async update(id, updateBranchDto) {
        const updatedBranch = await this.branchService.update(id, updateBranchDto);
        return { data: updatedBranch };
    }
    async remove(id) {
        await this.branchService.remove(id);
        return { message: 'Branch deleted successfully' };
    }
};
exports.BranchController = BranchController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_branch_dto_1.CreateBranchDto]),
    __metadata("design:returntype", void 0)
], BranchController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BranchController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('country/:countryId'),
    __param(0, (0, common_1.Param)('countryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BranchController.prototype, "findByCountry", null);
__decorate([
    (0, common_1.Get)('code/:branchCode'),
    __param(0, (0, common_1.Param)('branchCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BranchController.prototype, "findByCode", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BranchController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_branch_dto_1.UpdateBranchDto]),
    __metadata("design:returntype", Promise)
], BranchController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BranchController.prototype, "remove", null);
exports.BranchController = BranchController = __decorate([
    (0, common_1.Controller)('/branches'),
    __metadata("design:paramtypes", [branch_service_1.BranchService])
], BranchController);
//# sourceMappingURL=branch.controller.js.map