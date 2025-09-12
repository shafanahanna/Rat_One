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
exports.GlobalLeaveConfigService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const global_leave_config_entity_1 = require("../entities/global-leave-config.entity");
let GlobalLeaveConfigService = class GlobalLeaveConfigService {
    constructor(globalLeaveConfigRepository) {
        this.globalLeaveConfigRepository = globalLeaveConfigRepository;
    }
    async create(createGlobalLeaveConfigDto) {
        const config = this.globalLeaveConfigRepository.create(createGlobalLeaveConfigDto);
        return this.globalLeaveConfigRepository.save(config);
    }
    async findAll() {
        return this.globalLeaveConfigRepository.find();
    }
    async findOne(id) {
        const config = await this.globalLeaveConfigRepository.findOne({ where: { id } });
        if (!config) {
            throw new common_1.NotFoundException(`Global leave configuration with ID ${id} not found`);
        }
        return config;
    }
    async findByKey(key) {
        const config = await this.globalLeaveConfigRepository.findOne({ where: { key } });
        if (!config) {
            throw new common_1.NotFoundException(`Global leave configuration with key ${key} not found`);
        }
        return config;
    }
    async findByYear(year) {
        const config = await this.globalLeaveConfigRepository.findOne({
            where: { key: `leave_config_${year}` },
        });
        if (config) {
            return config;
        }
        const defaultConfig = {
            key: `leave_config_${year}`,
            value: {
                year: year,
                allocations: []
            },
            description: `Leave configuration for year ${year}`,
        };
        const newConfig = this.globalLeaveConfigRepository.create(defaultConfig);
        return this.globalLeaveConfigRepository.save(newConfig);
    }
    async update(id, updateGlobalLeaveConfigDto) {
        const config = await this.findOne(id);
        this.globalLeaveConfigRepository.merge(config, updateGlobalLeaveConfigDto);
        return this.globalLeaveConfigRepository.save(config);
    }
    async updateByKey(key, updateGlobalLeaveConfigDto) {
        try {
            const config = await this.findByKey(key);
            if (key.startsWith('leave_config_') &&
                updateGlobalLeaveConfigDto.value &&
                typeof updateGlobalLeaveConfigDto.value === 'object' &&
                updateGlobalLeaveConfigDto.value.allocations) {
                const allocations = updateGlobalLeaveConfigDto.value.allocations.map(item => ({
                    leave_type_id: item.leave_type_id,
                    leave_type_name: item.leave_type_name,
                    max_days: item.max_days,
                    year: updateGlobalLeaveConfigDto.value.year
                }));
                updateGlobalLeaveConfigDto.value = {
                    year: config.value.year || updateGlobalLeaveConfigDto.value.year,
                    allocations: allocations
                };
            }
            else if (updateGlobalLeaveConfigDto.value && typeof updateGlobalLeaveConfigDto.value === 'object') {
                updateGlobalLeaveConfigDto.value = {
                    ...config.value,
                    ...updateGlobalLeaveConfigDto.value,
                };
            }
            this.globalLeaveConfigRepository.merge(config, updateGlobalLeaveConfigDto);
            return this.globalLeaveConfigRepository.save(config);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                return this.create({
                    key,
                    value: updateGlobalLeaveConfigDto.value,
                    description: updateGlobalLeaveConfigDto.description,
                });
            }
            throw error;
        }
    }
    async remove(id) {
        const config = await this.findOne(id);
        await this.globalLeaveConfigRepository.remove(config);
    }
};
exports.GlobalLeaveConfigService = GlobalLeaveConfigService;
exports.GlobalLeaveConfigService = GlobalLeaveConfigService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(global_leave_config_entity_1.GlobalLeaveConfig)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GlobalLeaveConfigService);
//# sourceMappingURL=global-leave-config.service.js.map