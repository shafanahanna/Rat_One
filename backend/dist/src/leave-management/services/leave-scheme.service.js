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
var LeaveSchemeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveSchemeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const leave_scheme_entity_1 = require("../entities/leave-scheme.entity");
const scheme_leave_type_entity_1 = require("../entities/scheme-leave-type.entity");
const leave_type_entity_1 = require("../entities/leave-type.entity");
let LeaveSchemeService = LeaveSchemeService_1 = class LeaveSchemeService {
    constructor(leaveSchemeRepository, schemeLeaveTypeRepository, leaveTypeRepository, dataSource) {
        this.leaveSchemeRepository = leaveSchemeRepository;
        this.schemeLeaveTypeRepository = schemeLeaveTypeRepository;
        this.leaveTypeRepository = leaveTypeRepository;
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(LeaveSchemeService_1.name);
    }
    async findAll() {
        try {
            const schemes = await this.leaveSchemeRepository
                .createQueryBuilder('ls')
                .leftJoin('users', 'u', 'ls.created_by = u.id')
                .select([
                'ls.id',
                'ls.name',
                'ls.is_active',
                'ls.created_at',
                'ls.updated_at',
                'u.email as created_by_name'
            ])
                .orderBy('ls.created_at', 'DESC')
                .getRawMany();
            return {
                success: true,
                data: schemes
            };
        }
        catch (error) {
            this.logger.error(`Error fetching leave schemes: ${error.message}`, error.stack);
            throw error;
        }
    }
    async findOne(id) {
        try {
            const scheme = await this.leaveSchemeRepository.findOne({ where: { id } });
            if (!scheme) {
                throw new common_1.NotFoundException(`Leave scheme with ID ${id} not found`);
            }
            return {
                success: true,
                data: scheme
            };
        }
        catch (error) {
            this.logger.error(`Error fetching leave scheme ${id}: ${error.message}`, error.stack);
            throw error;
        }
    }
    async create(createLeaveSchemeDto, userId) {
        const { name } = createLeaveSchemeDto;
        try {
            const newScheme = this.leaveSchemeRepository.create({
                name,
                created_by: userId,
                updated_by: userId
            });
            const savedScheme = await this.leaveSchemeRepository.save(newScheme);
            return {
                success: true,
                message: 'Leave scheme created successfully',
                data: savedScheme
            };
        }
        catch (error) {
            this.logger.error(`Error creating leave scheme: ${error.message}`, error.stack);
            throw error;
        }
    }
    async update(id, updateLeaveSchemeDto, userId) {
        const { name, is_active } = updateLeaveSchemeDto;
        try {
            const scheme = await this.leaveSchemeRepository.findOne({ where: { id } });
            if (!scheme) {
                throw new common_1.NotFoundException(`Leave scheme with ID ${id} not found`);
            }
            if (name !== undefined)
                scheme.name = name;
            if (is_active !== undefined)
                scheme.is_active = is_active;
            scheme.updated_by = userId;
            const updatedScheme = await this.leaveSchemeRepository.save(scheme);
            return {
                success: true,
                message: 'Leave scheme updated successfully',
                data: updatedScheme
            };
        }
        catch (error) {
            this.logger.error(`Error updating leave scheme ${id}: ${error.message}`, error.stack);
            throw error;
        }
    }
    async remove(id) {
        try {
            const scheme = await this.leaveSchemeRepository.findOne({ where: { id } });
            if (!scheme) {
                throw new common_1.NotFoundException(`Leave scheme with ID ${id} not found`);
            }
            await this.leaveSchemeRepository.remove(scheme);
            return {
                success: true,
                message: 'Leave scheme deleted successfully'
            };
        }
        catch (error) {
            this.logger.error(`Error deleting leave scheme ${id}: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getSchemeLeaveTypes(schemeId) {
        try {
            const scheme = await this.leaveSchemeRepository.findOne({ where: { id: schemeId } });
            if (!scheme) {
                throw new common_1.NotFoundException(`Leave scheme with ID ${schemeId} not found`);
            }
            const schemeLeaveTypes = await this.schemeLeaveTypeRepository
                .createQueryBuilder('slt')
                .leftJoin('leave_types', 'lt', 'slt.leave_type_id = lt.id')
                .select([
                'slt.id',
                'slt.scheme_id',
                'slt.leave_type_id',
                'slt.days_allowed',
                'slt.is_paid',
                'lt.name as leave_type_name',
                'lt.description as leave_type_description',
                'lt.color as leave_type_color'
            ])
                .where('slt.scheme_id = :schemeId', { schemeId })
                .getRawMany();
            return {
                success: true,
                data: schemeLeaveTypes
            };
        }
        catch (error) {
            this.logger.error(`Error fetching leave types for scheme ${schemeId}: ${error.message}`, error.stack);
            throw error;
        }
    }
    async addLeaveTypeToScheme(schemeId, dto, userId) {
        const { leave_type_id, days_allowed, is_paid } = dto;
        try {
            const scheme = await this.leaveSchemeRepository.findOne({ where: { id: schemeId } });
            if (!scheme) {
                throw new common_1.NotFoundException(`Leave scheme with ID ${schemeId} not found`);
            }
            const leaveType = await this.leaveTypeRepository.findOne({ where: { id: leave_type_id } });
            if (!leaveType) {
                throw new common_1.NotFoundException(`Leave type with ID ${leave_type_id} not found`);
            }
            const existingSchemeLeaveType = await this.schemeLeaveTypeRepository.findOne({
                where: {
                    scheme_id: schemeId,
                    leave_type_id: leave_type_id
                }
            });
            if (existingSchemeLeaveType) {
                throw new common_1.BadRequestException(`Leave type ${leave_type_id} is already added to scheme ${schemeId}`);
            }
            const schemeLeaveType = this.schemeLeaveTypeRepository.create({
                scheme_id: schemeId,
                leave_type_id,
                days_allowed,
                is_paid,
                created_by: userId,
                updated_by: userId
            });
            const savedSchemeLeaveType = await this.schemeLeaveTypeRepository.save(schemeLeaveType);
            const result = {
                ...savedSchemeLeaveType,
                leave_type_name: leaveType.name,
                leave_type_description: leaveType.description,
                leave_type_color: leaveType.color
            };
            return {
                success: true,
                message: 'Leave type added to scheme successfully',
                data: result
            };
        }
        catch (error) {
            this.logger.error(`Error adding leave type to scheme: ${error.message}`, error.stack);
            throw error;
        }
    }
    async updateSchemeLeaveType(schemeId, id, dto, userId) {
        const { days_allowed, is_paid } = dto;
        try {
            const schemeLeaveType = await this.schemeLeaveTypeRepository.findOne({
                where: {
                    id,
                    scheme_id: schemeId
                }
            });
            if (!schemeLeaveType) {
                throw new common_1.NotFoundException(`Scheme leave type with ID ${id} not found in scheme ${schemeId}`);
            }
            if (days_allowed !== undefined)
                schemeLeaveType.days_allowed = days_allowed;
            if (is_paid !== undefined)
                schemeLeaveType.is_paid = is_paid;
            schemeLeaveType.updated_by = userId;
            const updatedSchemeLeaveType = await this.schemeLeaveTypeRepository.save(schemeLeaveType);
            const leaveType = await this.leaveTypeRepository.findOne({
                where: { id: schemeLeaveType.leave_type_id }
            });
            const result = {
                ...updatedSchemeLeaveType,
                leave_type_name: leaveType.name,
                leave_type_description: leaveType.description,
                leave_type_color: leaveType.color
            };
            return {
                success: true,
                message: 'Scheme leave type updated successfully',
                data: result
            };
        }
        catch (error) {
            this.logger.error(`Error updating scheme leave type: ${error.message}`, error.stack);
            throw error;
        }
    }
    async removeLeaveTypeFromScheme(schemeId, id) {
        try {
            const schemeLeaveType = await this.schemeLeaveTypeRepository.findOne({
                where: {
                    id,
                    scheme_id: schemeId
                }
            });
            if (!schemeLeaveType) {
                throw new common_1.NotFoundException(`Scheme leave type with ID ${id} not found in scheme ${schemeId}`);
            }
            await this.schemeLeaveTypeRepository.remove(schemeLeaveType);
            return {
                success: true,
                message: 'Leave type removed from scheme successfully'
            };
        }
        catch (error) {
            this.logger.error(`Error removing leave type from scheme: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.LeaveSchemeService = LeaveSchemeService;
exports.LeaveSchemeService = LeaveSchemeService = LeaveSchemeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(leave_scheme_entity_1.LeaveScheme)),
    __param(1, (0, typeorm_1.InjectRepository)(scheme_leave_type_entity_1.SchemeLeaveType)),
    __param(2, (0, typeorm_1.InjectRepository)(leave_type_entity_1.LeaveType)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], LeaveSchemeService);
//# sourceMappingURL=leave-scheme.service.js.map