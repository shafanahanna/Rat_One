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
exports.BranchService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const branch_entity_1 = require("./entities/branch.entity");
const country_entity_1 = require("../country/entities/country.entity");
const user_entity_1 = require("../auth/entities/user.entity");
let BranchService = class BranchService {
    constructor(branchRepository, countryRepository, userRepository) {
        this.branchRepository = branchRepository;
        this.countryRepository = countryRepository;
        this.userRepository = userRepository;
    }
    async create(createBranchDto) {
        const country = await this.countryRepository.findOne({
            where: { id: createBranchDto.country_id }
        });
        if (!country) {
            throw new common_1.NotFoundException(`Country with ID ${createBranchDto.country_id} not found`);
        }
        const existingBranch = await this.branchRepository.findOne({
            where: { branch_code: createBranchDto.branch_code }
        });
        if (existingBranch) {
            throw new common_1.ConflictException(`Branch with code ${createBranchDto.branch_code} already exists`);
        }
        if (createBranchDto.manager_user_id) {
            const manager = await this.userRepository.findOne({
                where: { id: createBranchDto.manager_user_id }
            });
            if (!manager) {
                throw new common_1.NotFoundException(`User with ID ${createBranchDto.manager_user_id} not found`);
            }
        }
        const branch = this.branchRepository.create(createBranchDto);
        return this.branchRepository.save(branch);
    }
    async findAll() {
        return this.branchRepository.find({
            relations: ['country', 'manager'],
        });
    }
    async findOne(id) {
        const branch = await this.branchRepository.findOne({
            where: { id },
            relations: ['country', 'manager'],
        });
        if (!branch) {
            throw new common_1.NotFoundException(`Branch with ID ${id} not found`);
        }
        return branch;
    }
    async update(id, updateBranchDto) {
        const branch = await this.findOne(id);
        if (updateBranchDto.country_id) {
            const country = await this.countryRepository.findOne({
                where: { id: updateBranchDto.country_id }
            });
            if (!country) {
                throw new common_1.NotFoundException(`Country with ID ${updateBranchDto.country_id} not found`);
            }
        }
        if (updateBranchDto.branch_code) {
            const existingBranch = await this.branchRepository.findOne({
                where: { branch_code: updateBranchDto.branch_code }
            });
            if (existingBranch && existingBranch.id !== id) {
                throw new common_1.ConflictException(`Branch with code ${updateBranchDto.branch_code} already exists`);
            }
        }
        if (updateBranchDto.manager_user_id) {
            const manager = await this.userRepository.findOne({
                where: { id: updateBranchDto.manager_user_id }
            });
            if (!manager) {
                throw new common_1.NotFoundException(`User with ID ${updateBranchDto.manager_user_id} not found`);
            }
        }
        Object.assign(branch, updateBranchDto);
        return this.branchRepository.save(branch);
    }
    async remove(id) {
        const branch = await this.findOne(id);
        const usersCount = await this.userRepository.count({
            where: { branch_id: id }
        });
        if (usersCount > 0) {
            throw new common_1.ConflictException(`Cannot delete branch with ID ${id} because it has ${usersCount} associated users`);
        }
        await this.branchRepository.remove(branch);
    }
    async getBranchesWithUserCount() {
        const branches = await this.branchRepository.find({
            relations: ['country'],
        });
        const branchesWithUserCount = await Promise.all(branches.map(async (branch) => {
            const userCount = await this.userRepository.count({
                where: { branch_id: branch.id },
            });
            return {
                ...branch,
                user_count: userCount,
            };
        }));
        return branchesWithUserCount;
    }
    async getBranchByCode(branchCode) {
        const branch = await this.branchRepository.findOne({
            where: { branch_code: branchCode },
            relations: ['country', 'manager'],
        });
        if (!branch) {
            throw new common_1.NotFoundException(`Branch with code ${branchCode} not found`);
        }
        return branch;
    }
    async getBranchesByCountry(countryId) {
        const country = await this.countryRepository.findOne({
            where: { id: countryId }
        });
        if (!country) {
            throw new common_1.NotFoundException(`Country with ID ${countryId} not found`);
        }
        return this.branchRepository.find({
            where: { country_id: countryId },
            relations: ['manager'],
        });
    }
};
exports.BranchService = BranchService;
exports.BranchService = BranchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(branch_entity_1.Branch)),
    __param(1, (0, typeorm_1.InjectRepository)(country_entity_1.Country)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], BranchService);
//# sourceMappingURL=branch.service.js.map