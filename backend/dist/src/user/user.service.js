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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const branch_entity_1 = require("../branch/entities/branch.entity");
const user_entity_1 = require("../auth/entities/user.entity");
let UserService = class UserService {
    constructor(userRepository, branchRepository, dataSource) {
        this.userRepository = userRepository;
        this.branchRepository = branchRepository;
        this.dataSource = dataSource;
    }
    async findAllWithContext() {
        const query = `
      SELECT 
        u.id,
        u.username,
        u.email,
        u.role,
        u.employee_id,
        u.branch_id,
        u.created_at,
        u.updated_at,
        b.branch_code,
        b.branch_name,
        b.city,
        b.state_province,
        b.country_id,
        c.country_code,
        c.country_name,
        c.transaction_currency,
        c.currency_symbol,
        c.timezone
      FROM users u
      LEFT JOIN branches b ON u.branch_id::text = b.id::text
      LEFT JOIN countries c ON b.country_id::text = c.id::text
      ORDER BY u.username ASC
    `;
        const users = await this.dataSource.query(query);
        return users;
    }
    async findOneWithContext(id) {
        const query = `
      SELECT 
        u.id,
        u.username,
        u.email,
        u.role,
        u.employee_id,
        u.branch_id,
        u.created_at,
        u.updated_at,
        b.branch_code,
        b.branch_name,
        b.city,
        b.state_province,
        b.country_id,
        c.country_code,
        c.country_name,
        c.transaction_currency,
        c.currency_symbol,
        c.timezone
      FROM users u
      LEFT JOIN branches b ON u.branch_id::text = b.id::text
      LEFT JOIN countries c ON b.country_id::text = c.id::text
      WHERE u.id::text = $1
    `;
        const users = await this.dataSource.query(query, [id]);
        if (users.length === 0) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return users[0];
    }
    async updateUserBranch(userId, branchId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        if (branchId) {
            const branch = await this.branchRepository.findOne({ where: { id: branchId } });
            if (!branch) {
                throw new common_1.NotFoundException(`Branch with ID ${branchId} not found`);
            }
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            user.branch_id = branchId;
            user.updated_at = new Date();
            await this.userRepository.save(user);
            await queryRunner.commitTransaction();
            const updatedUser = await this.findOneWithContext(userId);
            return updatedUser;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async bulkUpdateUserBranch(userIds, branchId) {
        if (branchId) {
            const branch = await this.branchRepository.findOne({ where: { id: branchId } });
            if (!branch) {
                throw new common_1.NotFoundException(`Branch with ID ${branchId} not found`);
            }
        }
        await this.userRepository.update({ id: (0, typeorm_2.In)(userIds) }, { branch_id: branchId, updated_at: new Date() });
        const query = `
      SELECT 
        u.id,
        u.username,
        u.email,
        u.branch_id,
        b.branch_name,
        c.country_name,
        c.transaction_currency
      FROM users u
      LEFT JOIN branches b ON u.branch_id::text = b.id::text
      LEFT JOIN countries c ON b.country_id::text = c.id::text
      WHERE u.id::text = ANY($1::text[])
      ORDER BY u.username ASC
    `;
        const updatedUsers = await this.dataSource.query(query, [userIds]);
        return {
            updated_count: updatedUsers.length,
            users: updatedUsers
        };
    }
    async findByBranch(branchId) {
        const query = `
      SELECT 
        u.id,
        u.username,
        u.email,
        u.role,
        u.employee_id,
        u.created_at,
        b.branch_code,
        b.branch_name,
        c.country_name,
        c.transaction_currency
      FROM users u
      LEFT JOIN branches b ON u.branch_id::text = b.id::text
      LEFT JOIN countries c ON b.country_id::text = c.id::text
      WHERE u.branch_id::text = $1
      ORDER BY u.username ASC
    `;
        const users = await this.dataSource.query(query, [branchId]);
        return users;
    }
    async findByCountry(countryId) {
        const query = `
      SELECT 
        u.id,
        u.username,
        u.email,
        u.role,
        u.employee_id,
        u.created_at,
        b.branch_code,
        b.branch_name,
        c.country_name,
        c.transaction_currency
      FROM users u
      LEFT JOIN branches b ON u.branch_id::text = b.id::text
      LEFT JOIN countries c ON b.country_id::text = c.id::text
      WHERE c.id::text = $1
      ORDER BY u.username ASC
    `;
        const users = await this.dataSource.query(query, [countryId]);
        return users;
    }
    async findUnassigned() {
        const query = `
      SELECT 
        u.id,
        u.username as name,
        u.email,
        u.role,
        u.employee_id,
        u.created_at,
        u.branch_id,
        b.branch_name,
        b.country_id
      FROM users u
      LEFT JOIN branches b ON u.branch_id::text = b.id::text
      WHERE u.employee_id IS NULL
      AND u.role NOT IN ('Admin', 'Director') -- Exclude both Admin and Director for backward compatibility
      ORDER BY u.username ASC
    `;
        const users = await this.dataSource.query(query);
        return users;
    }
    async getAssignmentStats() {
        const statsQuery = `
      SELECT 
        c.country_name,
        c.transaction_currency,
        b.branch_name,
        b.branch_code,
        COUNT(u.id) as user_count
      FROM countries c
      LEFT JOIN branches b ON c.id::text = b.country_id::text
      LEFT JOIN users u ON b.id::text = u.branch_id::text
      GROUP BY c.id, c.country_name, c.transaction_currency, b.id, b.branch_name, b.branch_code
      ORDER BY c.country_name ASC, b.branch_name ASC
    `;
        const unassignedQuery = `
      SELECT COUNT(*) as unassigned_count
      FROM users
      WHERE branch_id IS NULL
    `;
        const [assignments, unassignedResult] = await Promise.all([
            this.dataSource.query(statsQuery),
            this.dataSource.query(unassignedQuery),
        ]);
        return {
            assignments,
            unassigned_count: parseInt(unassignedResult[0].unassigned_count)
        };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(branch_entity_1.Branch)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], UserService);
//# sourceMappingURL=user.service.js.map