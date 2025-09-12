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
exports.PayrollService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payroll_entity_1 = require("./entities/payroll.entity");
const employee_entity_1 = require("../employee/employee.entity");
const date_fns_1 = require("date-fns");
let PayrollService = class PayrollService {
    constructor(payrollRepository, employeeRepository, dataSource) {
        this.payrollRepository = payrollRepository;
        this.employeeRepository = employeeRepository;
        this.dataSource = dataSource;
    }
    async recalculatePayroll(recalculateDto) {
        const { month, year, forceRecalculate } = recalculateDto;
        const existingRecords = await this.payrollRepository.count({
            where: { month, year }
        });
        if (existingRecords > 0 && !forceRecalculate) {
            return {
                message: `Payroll records already exist for ${month}/${year}. Set forceRecalculate to true to delete and recalculate.`
            };
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            if (existingRecords > 0) {
                await queryRunner.manager.delete(payroll_entity_1.Payroll, { month, year });
            }
            const result = await this.runPayroll(month, year, queryRunner.manager);
            await queryRunner.commitTransaction();
            return {
                message: `Payroll recalculated successfully for ${month}/${year}. ${result.count} records created.`
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.BadRequestException(`Failed to recalculate payroll: ${error.message}`);
        }
        finally {
            await queryRunner.release();
        }
    }
    async runPayroll(month, year, manager) {
        const repo = manager ? manager.getRepository(payroll_entity_1.Payroll) : this.payrollRepository;
        const employeeRepo = manager ? manager.getRepository(employee_entity_1.Employee) : this.employeeRepository;
        const employees = await employeeRepo.find();
        const daysInMonth = (0, date_fns_1.getDaysInMonth)(new Date(year, month - 1));
        let count = 0;
        for (const employee of employees) {
            const joinDate = (0, date_fns_1.parseISO)(employee.dateOfJoining);
            if (joinDate > new Date(year, month - 1, daysInMonth)) {
                continue;
            }
            let workingDays = daysInMonth;
            if (joinDate.getFullYear() === year && joinDate.getMonth() === month - 1) {
                workingDays = daysInMonth - joinDate.getDate() + 1;
            }
            const attendanceQuery = `
        SELECT 
          COUNT(CASE WHEN status = 'Absent' THEN 1 END) as absent_days,
          COUNT(CASE WHEN status = 'Half Day' THEN 1 END) as half_days
        FROM attendance
        WHERE employee_id = $1 AND EXTRACT(MONTH FROM date) = $2 AND EXTRACT(YEAR FROM date) = $3
      `;
            const attendanceResult = await this.dataSource.query(attendanceQuery, [
                employee.id,
                month,
                year
            ]);
            const absentDays = attendanceResult[0]?.absent_days || 0;
            const halfDays = attendanceResult[0]?.half_days || 0;
            const unpaidDays = absentDays + (halfDays / 2);
            const dailyRate = employee.salary / daysInMonth;
            const deductions = unpaidDays * dailyRate;
            const netSalary = employee.salary - deductions;
            const payroll = repo.create({
                employeeId: employee.id,
                month,
                year,
                basicSalary: employee.salary,
                allowances: 0,
                unpaidDays,
                deductions,
                netSalary,
                paymentStatus: 'Pending',
                notes: `Auto-generated payroll for ${month}/${year}`
            });
            await repo.save(payroll);
            count++;
        }
        return { count };
    }
    async getPayroll(periodDto) {
        const { month, year } = periodDto;
        const payrollQuery = `
      SELECT 
        p.*,
        e.full_name as employee_name,
        e.emp_code as employee_code,
        e.designation
      FROM payroll p
      JOIN employee e ON p.employee_id = e.id
      WHERE p.month = $1 AND p.year = $2
      ORDER BY e.full_name
    `;
        const payrollData = await this.dataSource.query(payrollQuery, [month, year]);
        if (!payrollData || payrollData.length === 0) {
            return [];
        }
        return payrollData;
    }
    async updatePayrollStatus(id, updateDto) {
        const { payment_status, payment_date } = updateDto;
        if (payment_status !== 'Paid') {
            throw new common_1.BadRequestException('Only "Paid" status is allowed');
        }
        const payroll = await this.payrollRepository.findOne({ where: { id } });
        if (!payroll) {
            throw new common_1.NotFoundException(`Payroll record with ID ${id} not found`);
        }
        payroll.paymentStatus = payment_status;
        if (payment_date) {
            payroll.paymentDate = payment_date;
        }
        else {
            payroll.paymentDate = new Date();
        }
        await this.payrollRepository.save(payroll);
        return { message: `Payroll status updated to ${payment_status}` };
    }
    async getPayrollSummary(periodDto) {
        const { month, year } = periodDto;
        const summaryQuery = `
      SELECT 
        COUNT(*) as employee_count,
        SUM(basic_salary) as total_gross,
        SUM(deductions) as total_deductions,
        SUM(net_salary) as total_net
      FROM payroll
      WHERE month = $1 AND year = $2
    `;
        const summary = await this.dataSource.query(summaryQuery, [month, year]);
        if (!summary || summary.length === 0) {
            return {
                employee_count: 0,
                total_gross: 0,
                total_deductions: 0,
                total_net: 0
            };
        }
        return summary[0];
    }
};
exports.PayrollService = PayrollService;
exports.PayrollService = PayrollService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payroll_entity_1.Payroll)),
    __param(1, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], PayrollService);
//# sourceMappingURL=payroll.service.js.map