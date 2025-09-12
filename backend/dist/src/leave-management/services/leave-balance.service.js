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
var LeaveBalanceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveBalanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const leave_balance_entity_1 = require("../entities/leave-balance.entity");
const employee_entity_1 = require("../../employee/employee.entity");
const leave_type_entity_1 = require("../entities/leave-type.entity");
const global_leave_config_entity_1 = require("../entities/global-leave-config.entity");
let LeaveBalanceService = LeaveBalanceService_1 = class LeaveBalanceService {
    constructor(leaveBalanceRepository, employeeRepository, leaveTypeRepository, globalLeaveConfigRepository, dataSource) {
        this.leaveBalanceRepository = leaveBalanceRepository;
        this.employeeRepository = employeeRepository;
        this.leaveTypeRepository = leaveTypeRepository;
        this.globalLeaveConfigRepository = globalLeaveConfigRepository;
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(LeaveBalanceService_1.name);
    }
    async create(createLeaveBalanceDto) {
        const existingBalance = await this.leaveBalanceRepository.findOne({
            where: {
                employee_id: createLeaveBalanceDto.employee_id,
                leave_type_id: createLeaveBalanceDto.leave_type_id,
                year: createLeaveBalanceDto.year,
            },
        });
        if (existingBalance) {
            throw new common_1.ConflictException(`Leave balance already exists for this employee, leave type, and year`);
        }
        const leaveBalance = this.leaveBalanceRepository.create(createLeaveBalanceDto);
        return this.leaveBalanceRepository.save(leaveBalance);
    }
    async findAll() {
        return this.leaveBalanceRepository.find({
            relations: ['employee', 'leaveType'],
        });
    }
    async findByEmployee(employeeId, year) {
        const queryBuilder = this.leaveBalanceRepository
            .createQueryBuilder('leaveBalance')
            .leftJoinAndSelect('leaveBalance.leaveType', 'leaveType')
            .where('leaveBalance.employee_id = :employeeId', { employeeId });
        if (year) {
            queryBuilder.andWhere('leaveBalance.year = :year', { year });
        }
        else {
            const currentYear = new Date().getFullYear();
            queryBuilder.andWhere('leaveBalance.year = :year', { year: currentYear });
        }
        const leaveBalances = await queryBuilder.getMany();
        leaveBalances.forEach(balance => {
            if (balance.remaining_days === undefined) {
                balance.remaining_days = Number(balance.allocated_days) - Number(balance.used_days);
            }
            const colors = {
                'Casual Leave': '#47BCCB',
                'Sick Leave': '#FF6B6B',
                'Annual Leave': '#38B000',
                'Unpaid Leave': '#9D4EDD',
                'Maternity Leave': '#FF85A1',
                'Paternity Leave': '#4361EE',
            };
            let color = '#47BCCB';
            if (balance.leaveType) {
                const typeName = balance.leaveType.name;
                for (const [key, value] of Object.entries(colors)) {
                    if (typeName.toLowerCase().includes(key.toLowerCase())) {
                        color = value;
                        break;
                    }
                }
            }
            balance.color = color;
        });
        return leaveBalances;
    }
    async findEmployeeByUserId(userId) {
        this.logger.log(`Finding employee with user ID: ${userId}`);
        try {
            const employee = await this.employeeRepository.findOne({
                where: { userId: userId }
            });
            if (employee) {
                this.logger.log(`Found employee ${employee.id} for user ID ${userId}`);
                return employee;
            }
            this.logger.log(`No exact match found, trying case-insensitive query for user ID: ${userId}`);
            const result = await this.employeeRepository.query(`SELECT * FROM employees WHERE LOWER(user_id) = LOWER($1) LIMIT 1`, [userId]);
            if (result && result.length > 0) {
                this.logger.log(`Found employee ${result[0].id} for user ID ${userId} with case-insensitive search`);
                return result[0];
            }
            this.logger.warn(`No employee found for user ID: ${userId}`);
            return null;
        }
        catch (error) {
            this.logger.error(`Error finding employee by user ID ${userId}: ${error.message}`, error.stack);
            return null;
        }
    }
    async findOne(id) {
        const leaveBalance = await this.leaveBalanceRepository.findOne({
            where: { id },
            relations: ['employee', 'leaveType'],
        });
        if (!leaveBalance) {
            throw new common_1.NotFoundException(`Leave balance with ID ${id} not found`);
        }
        return leaveBalance;
    }
    async update(id, updateLeaveBalanceDto) {
        const leaveBalance = await this.findOne(id);
        Object.assign(leaveBalance, updateLeaveBalanceDto);
        return this.leaveBalanceRepository.save(leaveBalance);
    }
    async remove(id) {
        const leaveBalance = await this.findOne(id);
        await this.leaveBalanceRepository.remove(leaveBalance);
    }
    async updateUsedDays(id, daysToAdd) {
        const leaveBalance = await this.findOne(id);
        leaveBalance.used_days = Number(leaveBalance.used_days) + daysToAdd;
        if (leaveBalance.used_days > leaveBalance.allocated_days) {
            throw new common_1.ConflictException('Used days cannot exceed allocated available days');
        }
        return this.leaveBalanceRepository.save(leaveBalance);
    }
    async populateLeaveBalances(year) {
        this.logger.log(`Starting leave balance population for year ${year}`);
        const employees = await this.employeeRepository.find();
        const activeEmployees = employees.filter(emp => emp['is_active'] !== false);
        if (!activeEmployees || activeEmployees.length === 0) {
            this.logger.warn('No active employees found');
            return {
                success: false,
                message: 'No active employees found',
                created: 0,
                skipped: 0,
                errors: 0
            };
        }
        const leaveTypes = await this.leaveTypeRepository.find({
            where: { is_active: true }
        });
        if (!leaveTypes || leaveTypes.length === 0) {
            this.logger.warn('No active leave types found');
            return {
                success: false,
                message: 'No active leave types found',
                created: 0,
                skipped: 0,
                errors: 0
            };
        }
        let created = 0;
        let skipped = 0;
        let errors = 0;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            for (const employee of activeEmployees) {
                for (const leaveType of leaveTypes) {
                    const existingBalance = await this.leaveBalanceRepository.findOne({
                        where: {
                            employee_id: employee.id,
                            leave_type_id: leaveType.id,
                            year: year
                        }
                    });
                    if (existingBalance) {
                        this.logger.log(`Leave balance already exists for employee ${employee.id}, leave type ${leaveType.id}, year ${year}`);
                        skipped++;
                        continue;
                    }
                    const allocatedDays = leaveType.max_days;
                    try {
                        const newBalance = this.leaveBalanceRepository.create({
                            employee_id: employee.id,
                            leave_type_id: leaveType.id,
                            year: year,
                            allocated_days: allocatedDays,
                            used_days: 0
                        });
                        await this.leaveBalanceRepository.save(newBalance);
                        created++;
                        this.logger.log(`Created leave balance for employee ${employee.id}, leave type ${leaveType.name}, year ${year} with ${allocatedDays} days`);
                    }
                    catch (error) {
                        this.logger.error(`Error creating leave balance: ${error.message}`, error.stack);
                        errors++;
                    }
                }
            }
            await queryRunner.commitTransaction();
            await this.updateGlobalLeaveConfig(year, leaveTypes);
            return {
                success: true,
                message: `Leave balances populated for year ${year}`,
                created,
                skipped,
                errors
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Error populating leave balances: ${error.message}`, error.stack);
            return {
                success: false,
                message: `Error populating leave balances: ${error.message}`,
                created,
                skipped,
                errors: errors + 1
            };
        }
        finally {
            await queryRunner.release();
        }
    }
    async populateLeaveBalancesForType(leaveTypeId, year) {
        this.logger.log(`Populating leave balances for leave type ${leaveTypeId} for year ${year}`);
        const employees = await this.employeeRepository.find();
        const activeEmployees = employees.filter(emp => emp['is_active'] !== false);
        if (!activeEmployees || activeEmployees.length === 0) {
            this.logger.warn('No active employees found');
            return {
                success: false,
                message: 'No active employees found',
                created: 0,
                skipped: 0,
                errors: 0
            };
        }
        const leaveType = await this.leaveTypeRepository.findOne({
            where: { id: leaveTypeId, is_active: true }
        });
        if (!leaveType) {
            return {
                success: false,
                message: 'Leave type not found or not active',
                created: 0,
                skipped: 0,
                errors: 0
            };
        }
        const defaultAllocations = {
            'Casual Leave': 6,
            'Sick Leave': 6,
            'Unpaid Leave': 30
        };
        let created = 0;
        let skipped = 0;
        let errors = 0;
        const allocatedDays = leaveType.max_days;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            for (const employee of activeEmployees) {
                const existingBalance = await this.leaveBalanceRepository.findOne({
                    where: {
                        employee_id: employee.id,
                        leave_type_id: leaveTypeId,
                        year: year
                    }
                });
                if (existingBalance) {
                    skipped++;
                    continue;
                }
                try {
                    const newBalance = this.leaveBalanceRepository.create({
                        employee_id: employee.id,
                        leave_type_id: leaveTypeId,
                        year: year,
                        allocated_days: allocatedDays,
                        used_days: 0
                    });
                    await this.leaveBalanceRepository.save(newBalance);
                    created++;
                    this.logger.log(`Created leave balance for employee ${employee.id}, leave type ${leaveType.name}, year ${year} with ${allocatedDays} days`);
                }
                catch (error) {
                    this.logger.error(`Error creating leave balance: ${error.message}`, error.stack);
                    errors++;
                }
            }
            await queryRunner.commitTransaction();
            await this.updateGlobalLeaveConfigForType(year, leaveType);
            return {
                success: true,
                message: `Leave balances populated for leave type ${leaveType.name} for year ${year}`,
                created,
                skipped,
                errors
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Error populating leave balances: ${error.message}`, error.stack);
            return {
                success: false,
                message: `Error populating leave balances: ${error.message}`,
                created,
                skipped,
                errors: errors + 1
            };
        }
        finally {
            await queryRunner.release();
        }
    }
    async updateGlobalLeaveConfigForType(year, leaveType) {
        const configKey = `leave_config_${year}`;
        const allocatedDays = leaveType.max_days;
        try {
            const existingConfig = await this.globalLeaveConfigRepository.findOne({
                where: { key: configKey }
            });
            if (existingConfig) {
                const currentValue = existingConfig.value;
                const allocations = currentValue.allocations || [];
                const existingIndex = allocations.findIndex(a => a.leave_type_id === leaveType.id);
                if (existingIndex >= 0) {
                    allocations[existingIndex].max_days = allocatedDays;
                }
                else {
                    allocations.push({
                        leave_type_id: leaveType.id,
                        leave_type_name: leaveType.name,
                        max_days: allocatedDays
                    });
                }
                existingConfig.value = {
                    ...currentValue,
                    allocations
                };
                await this.globalLeaveConfigRepository.save(existingConfig);
            }
            else {
                const newConfig = this.globalLeaveConfigRepository.create({
                    key: configKey,
                    value: {
                        year,
                        allocations: [{
                                leave_type_id: leaveType.id,
                                leave_type_name: leaveType.name,
                                max_days: allocatedDays
                            }]
                    },
                    description: `Leave configuration for year ${year}`
                });
                await this.globalLeaveConfigRepository.save(newConfig);
            }
        }
        catch (error) {
            this.logger.error(`Error updating global leave config: ${error.message}`, error.stack);
        }
    }
    async updateGlobalLeaveConfig(year, leaveTypes) {
        const configKey = `leave_config_${year}`;
        const allocations = leaveTypes.map(leaveType => {
            const maxDays = leaveType.max_days;
            return {
                leave_type_id: leaveType.id,
                leave_type_name: leaveType.name,
                max_days: maxDays
            };
        });
        const configValue = {
            year,
            allocations
        };
        try {
            const existingConfig = await this.globalLeaveConfigRepository.findOne({
                where: { key: configKey }
            });
            if (existingConfig) {
                existingConfig.value = configValue;
                await this.globalLeaveConfigRepository.save(existingConfig);
            }
            else {
                const newConfig = this.globalLeaveConfigRepository.create({
                    key: configKey,
                    value: configValue,
                    description: `Leave configuration for year ${year}`
                });
                await this.globalLeaveConfigRepository.save(newConfig);
            }
        }
        catch (error) {
            this.logger.error(`Error updating global leave config: ${error.message}`, error.stack);
        }
    }
};
exports.LeaveBalanceService = LeaveBalanceService;
exports.LeaveBalanceService = LeaveBalanceService = LeaveBalanceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(leave_balance_entity_1.LeaveBalance)),
    __param(1, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __param(2, (0, typeorm_1.InjectRepository)(leave_type_entity_1.LeaveType)),
    __param(3, (0, typeorm_1.InjectRepository)(global_leave_config_entity_1.GlobalLeaveConfig)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], LeaveBalanceService);
//# sourceMappingURL=leave-balance.service.js.map