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
exports.LeaveApplicationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const leave_balance_entity_1 = require("../entities/leave-balance.entity");
const date_fns_1 = require("date-fns");
const entities_1 = require("../entities");
const employee_entity_1 = require("../../employee/employee.entity");
let LeaveApplicationService = class LeaveApplicationService {
    constructor(leaveApplicationRepository, leaveBalanceRepository, leaveTypeRepository, employeeRepository) {
        this.leaveApplicationRepository = leaveApplicationRepository;
        this.leaveBalanceRepository = leaveBalanceRepository;
        this.leaveTypeRepository = leaveTypeRepository;
        this.employeeRepository = employeeRepository;
    }
    async create(createLeaveApplicationDto, userId) {
        const { leave_type_id, start_date, end_date, employee_id } = createLeaveApplicationDto;
        let applicantId = employee_id || userId;
        if (!applicantId) {
            throw new common_1.BadRequestException('Employee ID is required for leave application');
        }
        const leaveType = await this.leaveTypeRepository.findOne({
            where: { id: leave_type_id, is_active: true },
        });
        if (!leaveType) {
            throw new common_1.NotFoundException(`Leave type with ID ${leave_type_id} not found or inactive`);
        }
        const startDate = (0, date_fns_1.parseISO)(start_date);
        const endDate = (0, date_fns_1.parseISO)(end_date);
        if (startDate > endDate) {
            throw new common_1.BadRequestException('Start date must be before or equal to end date');
        }
        let numberOfDays = (0, date_fns_1.differenceInBusinessDays)((0, date_fns_1.addDays)(endDate, 1), startDate);
        const overlappingLeaves = await this.leaveApplicationRepository.find({
            where: {
                employee_id: applicantId,
                status: (0, typeorm_2.In)(['pending', 'approved']),
                start_date: (0, typeorm_2.Between)(startDate, endDate),
            },
        });
        if (overlappingLeaves.length > 0) {
            throw new common_1.ConflictException('You already have a leave application for this period');
        }
        const applicationYear = startDate.getFullYear();
        let leaveBalance = await this.leaveBalanceRepository
            .createQueryBuilder('lb')
            .where('lb.employee_id = :employeeId', { employeeId: applicantId })
            .andWhere('lb.leave_type_id = :leaveTypeId', { leaveTypeId: leave_type_id })
            .andWhere('lb.year = :year', { year: applicationYear })
            .getOne();
        if (!leaveBalance) {
            const leaveType = await this.leaveTypeRepository.findOne({
                where: { id: leave_type_id }
            });
            if (!leaveType) {
                throw new common_1.NotFoundException(`Leave type with ID ${leave_type_id} not found`);
            }
            if (!applicantId) {
                throw new common_1.BadRequestException('Cannot create leave balance: Employee ID is missing');
            }
            const employeeExists = await this.employeeRepository.findOne({
                where: { id: applicantId }
            });
            if (!employeeExists) {
                const employeeByUserId = await this.employeeRepository.findOne({
                    where: { userId: applicantId }
                });
                if (employeeByUserId) {
                    applicantId = employeeByUserId.id;
                    leaveBalance = await this.leaveBalanceRepository
                        .createQueryBuilder('lb')
                        .where('lb.employee_id = :employeeId', { employeeId: applicantId })
                        .andWhere('lb.leave_type_id = :leaveTypeId', { leaveTypeId: leave_type_id })
                        .andWhere('lb.year = :year', { year: applicationYear })
                        .getOne();
                }
                else {
                    throw new common_1.BadRequestException(`Cannot create leave balance: No employee record found for ID ${applicantId}`);
                }
            }
            try {
                leaveBalance = this.leaveBalanceRepository.create({
                    employee_id: applicantId,
                    leave_type_id,
                    year: applicationYear,
                    allocated_days: 0,
                    used_days: 0
                });
                leaveBalance = await this.leaveBalanceRepository.save(leaveBalance);
            }
            catch (error) {
                if (error.code === '23505' && error.constraint === 'unique_employee_leave_type_year') {
                    console.log('Concurrent leave balance creation detected, retrieving existing record');
                    leaveBalance = await this.leaveBalanceRepository
                        .createQueryBuilder('lb')
                        .where('lb.employee_id = :employeeId', { employeeId: applicantId })
                        .andWhere('lb.leave_type_id = :leaveTypeId', { leaveTypeId: leave_type_id })
                        .andWhere('lb.year = :year', { year: applicationYear })
                        .getOne();
                    if (!leaveBalance) {
                        throw new common_1.BadRequestException('Failed to retrieve leave balance after concurrent creation');
                    }
                }
                else {
                    throw error;
                }
            }
        }
        const allocatedDays = Number(leaveBalance.allocated_days);
        const usedDays = Number(leaveBalance.used_days);
        const availableDays = allocatedDays - usedDays;
        if (numberOfDays > availableDays) {
            throw new common_1.BadRequestException(`Not enough leave balance. Available: ${availableDays}, Requested: ${numberOfDays}`);
        }
        const leaveApplication = this.leaveApplicationRepository.create({
            ...createLeaveApplicationDto,
            employee_id: applicantId,
            working_days: numberOfDays,
            status: 'pending',
        });
        const savedApplication = await this.leaveApplicationRepository.save(leaveApplication);
        return savedApplication;
    }
    async findAll(status) {
        console.log(`[LeaveApplicationService] findAll called with status: '${status}'`);
        console.log(`[LeaveApplicationService] Status type: ${typeof status}`);
        const queryBuilder = this.leaveApplicationRepository.createQueryBuilder('leaveApplication')
            .leftJoinAndSelect('leaveApplication.employee', 'employee')
            .leftJoinAndSelect('leaveApplication.leaveType', 'leaveType')
            .orderBy('leaveApplication.created_at', 'DESC');
        if (status && status !== 'undefined' && status !== 'null') {
            const normalizedStatus = status.toLowerCase();
            console.log(`[LeaveApplicationService] Filtering by normalized status: '${normalizedStatus}'`);
            if (normalizedStatus === 'pending') {
                queryBuilder.andWhere('LOWER(leaveApplication.status) IN (:...statuses)', {
                    statuses: ['pending', 'Pending', 'PENDING']
                });
            }
            else if (normalizedStatus === 'approved') {
                queryBuilder.andWhere('LOWER(leaveApplication.status) IN (:...statuses)', {
                    statuses: ['approved', 'Approved', 'APPROVED']
                });
            }
            else if (normalizedStatus === 'rejected') {
                queryBuilder.andWhere('LOWER(leaveApplication.status) IN (:...statuses)', {
                    statuses: ['rejected', 'Rejected', 'REJECTED']
                });
            }
            else {
                queryBuilder.andWhere('LOWER(leaveApplication.status) = LOWER(:status)', { status: normalizedStatus });
            }
        }
        else {
            console.log('[LeaveApplicationService] No status filter applied');
        }
        try {
            const results = await queryBuilder.getMany();
            console.log(`[LeaveApplicationService] Found ${results.length} leave applications`);
            if (results.length > 0) {
                console.log(`[LeaveApplicationService] First result status: ${results[0].status}`);
            }
            return results;
        }
        catch (error) {
            console.error(`[LeaveApplicationService] Error in findAll: ${error.message}`);
            throw error;
        }
    }
    async findByEmployee(employeeId) {
        return this.leaveApplicationRepository.find({
            where: { employee_id: employeeId },
            relations: ['leaveType'],
            order: { created_at: 'DESC' },
        });
    }
    async findByEmployeeWithStatus(employeeId, status) {
        console.log(`[LeaveApplicationService] findByEmployeeWithStatus called with employeeId: ${employeeId}, status: '${status}'`);
        const queryBuilder = this.leaveApplicationRepository.createQueryBuilder('leaveApplication')
            .leftJoinAndSelect('leaveApplication.employee', 'employee')
            .leftJoinAndSelect('leaveApplication.leaveType', 'leaveType')
            .where('leaveApplication.employee_id = :employeeId', { employeeId })
            .orderBy('leaveApplication.created_at', 'DESC');
        if (status && status !== 'undefined' && status !== 'null') {
            const normalizedStatus = status.toLowerCase();
            console.log(`[LeaveApplicationService] Filtering by normalized status: '${normalizedStatus}'`);
            if (normalizedStatus === 'pending') {
                queryBuilder.andWhere('LOWER(leaveApplication.status) IN (:...statuses)', {
                    statuses: ['pending', 'Pending', 'PENDING']
                });
            }
            else if (normalizedStatus === 'approved') {
                queryBuilder.andWhere('LOWER(leaveApplication.status) IN (:...statuses)', {
                    statuses: ['approved', 'Approved', 'APPROVED']
                });
            }
            else if (normalizedStatus === 'rejected') {
                queryBuilder.andWhere('LOWER(leaveApplication.status) IN (:...statuses)', {
                    statuses: ['rejected', 'Rejected', 'REJECTED']
                });
            }
            else {
                queryBuilder.andWhere('LOWER(leaveApplication.status) = LOWER(:status)', { status: normalizedStatus });
            }
        }
        else {
            console.log('[LeaveApplicationService] No status filter applied for employee leave applications');
        }
        try {
            const results = await queryBuilder.getMany();
            console.log(`[LeaveApplicationService] Found ${results.length} leave applications for employee ${employeeId}`);
            if (results.length > 0) {
                console.log(`[LeaveApplicationService] First result status: ${results[0].status}`);
            }
            return results;
        }
        catch (error) {
            console.error(`[LeaveApplicationService] Error in findByEmployeeWithStatus: ${error.message}`);
            throw error;
        }
    }
    async countAll() {
        console.log('[LeaveApplicationService] Counting all leave applications');
        return this.leaveApplicationRepository.count();
    }
    async findOne(id) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            throw new common_1.BadRequestException(`Invalid leave application ID format: ${id}. Expected a UUID.`);
        }
        const leaveApplication = await this.leaveApplicationRepository.findOne({
            where: { id },
            relations: ['employee', 'leaveType'],
        });
        if (!leaveApplication) {
            throw new common_1.NotFoundException(`Leave application with ID ${id} not found`);
        }
        return leaveApplication;
    }
    async update(id, updateLeaveApplicationDto) {
        const leaveApplication = await this.findOne(id);
        if (leaveApplication.status !== 'pending') {
            throw new common_1.BadRequestException('Cannot update leave application that is already approved or rejected');
        }
        if (updateLeaveApplicationDto.start_date || updateLeaveApplicationDto.end_date) {
            const startDate = (0, date_fns_1.parseISO)(updateLeaveApplicationDto.start_date || leaveApplication.start_date.toISOString());
            const endDate = (0, date_fns_1.parseISO)(updateLeaveApplicationDto.end_date || leaveApplication.end_date.toISOString());
            if (startDate > endDate) {
                throw new common_1.BadRequestException('Start date must be before or equal to end date');
            }
            let numberOfDays = (0, date_fns_1.differenceInBusinessDays)((0, date_fns_1.addDays)(endDate, 1), startDate);
            updateLeaveApplicationDto['working_days'] = numberOfDays;
            const applicationYear = startDate.getFullYear();
            const leaveBalance = await this.leaveBalanceRepository.findOne({
                where: {
                    employee_id: leaveApplication.employee_id,
                    leave_type_id: updateLeaveApplicationDto.leave_type_id || leaveApplication.leave_type_id,
                    year: applicationYear,
                },
            });
            if (!leaveBalance) {
                throw new common_1.NotFoundException(`No leave balance found for this employee and leave type in ${applicationYear}`);
            }
            await this.leaveBalanceRepository.save(leaveBalance);
        }
        Object.assign(leaveApplication, updateLeaveApplicationDto);
        return this.leaveApplicationRepository.save(leaveApplication);
    }
    async cancel(id) {
        const leaveApplication = await this.findOne(id);
        if (leaveApplication.status !== 'pending' && leaveApplication.status !== 'approved') {
            throw new common_1.BadRequestException('Cannot cancel leave application that is already rejected');
        }
        if (leaveApplication.status === 'approved') {
            const applicationYear = new Date(leaveApplication.start_date).getFullYear();
            const leaveBalance = await this.leaveBalanceRepository.findOne({
                where: {
                    employee_id: leaveApplication.employee_id,
                    leave_type_id: leaveApplication.leave_type_id,
                    year: applicationYear,
                },
            });
            if (leaveBalance) {
                const workingDays = Number(leaveApplication.working_days);
                const currentUsedDays = Number(leaveBalance.used_days);
                leaveBalance.used_days = Math.max(0, currentUsedDays - workingDays);
                await this.leaveBalanceRepository.save(leaveBalance);
            }
        }
        leaveApplication.status = 'cancelled';
        return this.leaveApplicationRepository.save(leaveApplication);
    }
    async remove(id) {
        const leaveApplication = await this.findOne(id);
        await this.leaveApplicationRepository.remove(leaveApplication);
    }
    async updateStatus(id, status, approverId, comments) {
        const leaveApplication = await this.findOne(id);
        if (!leaveApplication) {
            throw new common_1.NotFoundException(`Leave application with ID ${id} not found`);
        }
        if (leaveApplication.status === status) {
            throw new common_1.BadRequestException(`Leave application is already ${status}`);
        }
        console.log(`[LeaveApplicationService] Updating leave application status: ${id}, approver_id: ${approverId}, status: ${status}`);
        if (comments) {
            leaveApplication.comments = comments;
        }
        leaveApplication.status = status;
        console.log(`[LeaveApplicationService] Successfully updated leave application status to ${status}`);
        if (status === 'approved' || status === 'rejected') {
            const applicationYear = new Date(leaveApplication.start_date).getFullYear();
            const leaveBalance = await this.leaveBalanceRepository.findOne({
                where: {
                    employee_id: leaveApplication.employee_id,
                    leave_type_id: leaveApplication.leave_type_id,
                    year: applicationYear,
                },
            });
            if (leaveBalance) {
                if (status === 'approved') {
                    const workingDays = Number(leaveApplication.working_days);
                    const currentUsedDays = Number(leaveBalance.used_days);
                    const allocatedDays = Number(leaveBalance.allocated_days);
                    if (currentUsedDays + workingDays > allocatedDays) {
                        throw new common_1.BadRequestException(`Cannot approve leave: would exceed allocated balance. ` +
                            `Available: ${allocatedDays - currentUsedDays}, Requested: ${workingDays}`);
                    }
                    leaveBalance.used_days = currentUsedDays + workingDays;
                    await this.leaveBalanceRepository.save(leaveBalance);
                }
            }
            else {
                throw new common_1.NotFoundException(`No leave balance found for employee ID ${leaveApplication.employee_id} ` +
                    `and leave type ID ${leaveApplication.leave_type_id} for year ${applicationYear}`);
            }
        }
        return this.leaveApplicationRepository.save(leaveApplication);
    }
};
exports.LeaveApplicationService = LeaveApplicationService;
exports.LeaveApplicationService = LeaveApplicationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.LeaveApplication)),
    __param(1, (0, typeorm_1.InjectRepository)(leave_balance_entity_1.LeaveBalance)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.LeaveType)),
    __param(3, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], LeaveApplicationService);
//# sourceMappingURL=leave-application.service.js.map