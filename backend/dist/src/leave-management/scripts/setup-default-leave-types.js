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
exports.LeaveTypeSetupService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const leave_type_entity_1 = require("../entities/leave-type.entity");
const global_leave_config_entity_1 = require("../entities/global-leave-config.entity");
let LeaveTypeSetupService = class LeaveTypeSetupService {
    constructor(leaveTypeRepository, globalLeaveConfigRepository) {
        this.leaveTypeRepository = leaveTypeRepository;
        this.globalLeaveConfigRepository = globalLeaveConfigRepository;
    }
    async setupDefaultLeaveTypes() {
        const defaultLeaveTypes = [
            {
                name: 'Casual Leave',
                max_days: 6,
                description: 'Leave for personal matters',
                color: '#4CAF50',
                is_paid: true,
                is_active: true,
            },
            {
                name: 'Sick Leave',
                max_days: 6,
                description: 'Leave for health issues',
                color: '#F44336',
                is_paid: true,
                is_active: true,
            },
            {
                name: 'Unpaid Leave',
                max_days: 30,
                description: 'Leave without pay',
                color: '#9E9E9E',
                is_paid: false,
                is_active: true,
            },
        ];
        const createdLeaveTypes = [];
        for (const leaveTypeData of defaultLeaveTypes) {
            const existingLeaveType = await this.leaveTypeRepository.findOne({
                where: { name: leaveTypeData.name },
            });
            if (!existingLeaveType) {
                const newLeaveType = this.leaveTypeRepository.create(leaveTypeData);
                const savedLeaveType = await this.leaveTypeRepository.save(newLeaveType);
                createdLeaveTypes.push(savedLeaveType);
            }
            else {
                createdLeaveTypes.push(existingLeaveType);
            }
        }
        const currentYear = new Date().getFullYear();
        await this.setupGlobalLeaveConfig(currentYear, createdLeaveTypes);
        return {
            message: 'Default leave types and configuration set up successfully',
            leaveTypes: createdLeaveTypes,
        };
    }
    async setupGlobalLeaveConfig(year, leaveTypes) {
        const configKey = `leave_config_${year}`;
        const existingConfig = await this.globalLeaveConfigRepository.findOne({
            where: { key: configKey },
        });
        const allocations = leaveTypes.map(leaveType => ({
            leave_type_id: leaveType.id,
            leave_type_name: leaveType.name,
            max_days: leaveType.max_days,
        }));
        const configValue = {
            year,
            allocations,
        };
        if (existingConfig) {
            existingConfig.value = configValue;
            await this.globalLeaveConfigRepository.save(existingConfig);
            return existingConfig;
        }
        else {
            const newConfig = this.globalLeaveConfigRepository.create({
                key: configKey,
                value: configValue,
                description: `Leave configuration for year ${year}`,
            });
            return this.globalLeaveConfigRepository.save(newConfig);
        }
    }
};
exports.LeaveTypeSetupService = LeaveTypeSetupService;
exports.LeaveTypeSetupService = LeaveTypeSetupService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(leave_type_entity_1.LeaveType)),
    __param(1, (0, typeorm_1.InjectRepository)(global_leave_config_entity_1.GlobalLeaveConfig)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], LeaveTypeSetupService);
//# sourceMappingURL=setup-default-leave-types.js.map