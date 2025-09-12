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
var LeaveTypeService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveTypeService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
const leave_balance_service_1 = require("./leave-balance.service");
let LeaveTypeService = LeaveTypeService_1 = class LeaveTypeService {
    constructor(pgPool, leaveBalanceService) {
        this.pgPool = pgPool;
        this.leaveBalanceService = leaveBalanceService;
        this.logger = new common_1.Logger(LeaveTypeService_1.name);
    }
    async findAll() {
        try {
            const result = await this.pgPool.query(`
        SELECT 
          id, 
          name, 
          code,
          description,
          is_paid,
          is_active
        FROM leave_types
        ORDER BY name
      `);
            return {
                success: true,
                data: result.rows
            };
        }
        catch (error) {
            this.logger.error(`Error fetching leave types: ${error.message}`, error.stack);
            throw error;
        }
    }
    async findAllActive() {
        try {
            const result = await this.pgPool.query(`
        SELECT 
          id, 
          name, 
          code,
          description,
          is_paid,
          is_active
        FROM leave_types
        WHERE is_active = TRUE
        ORDER BY name
      `);
            return {
                success: true,
                data: result.rows
            };
        }
        catch (error) {
            this.logger.error(`Error fetching active leave types: ${error.message}`, error.stack);
            throw error;
        }
    }
    async findOne(id) {
        try {
            const result = await this.pgPool.query(`
        SELECT 
          id, 
          name, 
          code,
          description,
          is_paid,
          is_active,
          created_at,
          updated_at
        FROM leave_types
        WHERE id = $1
      `, [id]);
            if (result.rows.length === 0) {
                throw new common_1.NotFoundException('Leave type not found');
            }
            return {
                success: true,
                data: result.rows[0]
            };
        }
        catch (error) {
            this.logger.error(`Error fetching leave type ${id}: ${error.message}`, error.stack);
            throw error;
        }
    }
    async create(createLeaveTypeDto, userId) {
        const { name, code, description, is_paid, max_days, color } = createLeaveTypeDto;
        if (!name || !code) {
            throw new common_1.BadRequestException('Name and code are required');
        }
        try {
            const codeValue = typeof code === 'string' ? code.toUpperCase() : String(code).toUpperCase();
            const result = await this.pgPool.query(`
        INSERT INTO leave_types (name, code, description, is_paid, max_days, color, created_by, updated_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $7)
        RETURNING id, name, code, description, is_paid, max_days, color, is_active, created_by, updated_by
      `, [name, codeValue, description, is_paid !== false, max_days, color, userId]);
            this.logger.log(`Leave type created successfully: ${JSON.stringify(result.rows[0])}`);
            if (result.rows[0].is_active) {
                try {
                    const currentYear = new Date().getFullYear();
                    const populateResult = await this.leaveBalanceService.populateLeaveBalancesForType(result.rows[0].id, currentYear);
                    this.logger.log(`Leave balances populated for new leave type: ${JSON.stringify(populateResult)}`);
                }
                catch (balanceError) {
                    this.logger.error(`Error populating leave balances: ${balanceError.message}`, balanceError.stack);
                }
            }
            return {
                success: true,
                message: 'Leave type created successfully',
                data: result.rows[0]
            };
        }
        catch (error) {
            if (error.code === '23505') {
                throw new common_1.BadRequestException('A leave type with this code already exists');
            }
            this.logger.error(`Error creating leave type: ${error.message}`, error.stack);
            throw error;
        }
    }
    async update(id, updateLeaveTypeDto, userId) {
        const { name, description, is_paid, is_active, max_days, color } = updateLeaveTypeDto;
        try {
            const result = await this.pgPool.query(`
        UPDATE leave_types
        SET 
          name = COALESCE($1, name),
          description = COALESCE($2, description),
          is_paid = COALESCE($3, is_paid),
          is_active = COALESCE($4, is_active),
          max_days = COALESCE($5, max_days),
          color = COALESCE($6, color),
          updated_by = $7,
          updated_at = NOW()
        WHERE id = $8
        RETURNING id, name, code, description, is_paid, max_days, color, is_active, created_by, updated_by
      `, [name, description, is_paid, is_active, max_days, color, userId, id]);
            if (result.rows.length === 0) {
                throw new common_1.NotFoundException('Leave type not found');
            }
            return {
                success: true,
                message: 'Leave type updated successfully',
                data: result.rows[0]
            };
        }
        catch (error) {
            this.logger.error(`Error updating leave type ${id}: ${error.message}`, error.stack);
            throw error;
        }
    }
    async remove(id) {
        try {
            const schemeCheck = await this.pgPool.query(`
        SELECT COUNT(*) FROM scheme_leave_types
        WHERE leave_type_id = $1
      `, [id]);
            if (parseInt(schemeCheck.rows[0].count) > 0) {
                throw new common_1.BadRequestException('Cannot delete leave type that is used in leave schemes');
            }
            const result = await this.pgPool.query(`
        DELETE FROM leave_types
        WHERE id = $1
        RETURNING id
      `, [id]);
            if (result.rows.length === 0) {
                throw new common_1.NotFoundException('Leave type not found');
            }
            return {
                success: true,
                message: 'Leave type deleted successfully'
            };
        }
        catch (error) {
            this.logger.error(`Error deleting leave type ${id}: ${error.message}`, error.stack);
            throw error;
        }
    }
    async softDelete(id) {
        try {
            const result = await this.pgPool.query(`
        UPDATE leave_types
        SET 
          is_active = FALSE
        WHERE id = $1
        RETURNING id, name, code, description, is_paid, is_active
      `, [id]);
            if (result.rows.length === 0) {
                throw new common_1.NotFoundException('Leave type not found');
            }
            return {
                success: true,
                message: 'Leave type soft deleted successfully',
                data: result.rows[0]
            };
        }
        catch (error) {
            this.logger.error(`Error soft deleting leave type ${id}: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.LeaveTypeService = LeaveTypeService;
exports.LeaveTypeService = LeaveTypeService = LeaveTypeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof pg_1.Pool !== "undefined" && pg_1.Pool) === "function" ? _a : Object, leave_balance_service_1.LeaveBalanceService])
], LeaveTypeService);
//# sourceMappingURL=leave-type.service.js.map