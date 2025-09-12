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
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const attendance_entity_1 = require("./entities/attendance.entity");
const employee_entity_1 = require("./entities/employee.entity");
let AttendanceService = class AttendanceService {
    constructor(attendanceRepository, employeeRepository) {
        this.attendanceRepository = attendanceRepository;
        this.employeeRepository = employeeRepository;
    }
    async getAttendance(month, year) {
        try {
            const monthInt = parseInt(month, 10);
            const yearInt = parseInt(year, 10);
            if (isNaN(monthInt) || isNaN(yearInt) || monthInt < 1 || monthInt > 12 || yearInt < 1900) {
                throw new common_1.BadRequestException('Invalid month or year');
            }
            const query = this.attendanceRepository
                .createQueryBuilder('attendance')
                .where('EXTRACT(MONTH FROM attendance.date) = :month', { month: monthInt })
                .andWhere('EXTRACT(YEAR FROM attendance.date) = :year', { year: yearInt });
            return await query.getMany();
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            console.error('Error fetching attendance:', error);
            throw new common_1.InternalServerErrorException('Failed to fetch attendance records');
        }
    }
    async setAttendance(attendanceDto) {
        const { employee_id, date, status } = attendanceDto;
        try {
            if (status === '') {
                await this.attendanceRepository.delete({ employee_id, date });
                return null;
            }
            const existingRecord = await this.attendanceRepository.findOne({
                where: { employee_id, date },
            });
            if (existingRecord) {
                existingRecord.status = status;
                return await this.attendanceRepository.save(existingRecord);
            }
            else {
                const newAttendance = this.attendanceRepository.create({
                    employee_id,
                    date,
                    status,
                });
                return await this.attendanceRepository.save(newAttendance);
            }
        }
        catch (error) {
            console.error(`Error setting attendance for employee ${employee_id} on ${date}:`, error);
            throw new common_1.InternalServerErrorException('Failed to set attendance');
        }
    }
    async getDailyAttendanceSummary(date) {
        try {
            const summaryQuery = this.attendanceRepository
                .createQueryBuilder('attendance')
                .select('attendance.status', 'status')
                .addSelect('COUNT(*)', 'count')
                .where('attendance.date = :date', { date })
                .groupBy('attendance.status');
            const summaryRows = await summaryQuery.getRawMany();
            const totalEmployees = await this.employeeRepository.count();
            const summary = {
                present: 0,
                absent: 0,
                leave: 0,
                halfday: 0,
                holiday: 0,
                sick: 0,
                total_employees: totalEmployees,
                not_marked: totalEmployees,
            };
            let markedEmployees = 0;
            summaryRows.forEach(row => {
                const status = row.status.toLowerCase();
                const count = parseInt(row.count, 10);
                if (status === 'present')
                    summary.present = count;
                if (status === 'absent')
                    summary.absent = count;
                if (status === 'leave')
                    summary.leave = count;
                if (status === 'halfday')
                    summary.halfday = count;
                if (status === 'holiday')
                    summary.holiday = count;
                if (status === 'sick')
                    summary.sick = count;
                markedEmployees += count;
            });
            summary.not_marked = totalEmployees - markedEmployees;
            return summary;
        }
        catch (error) {
            console.error('Error fetching daily attendance summary:', error);
            throw new common_1.InternalServerErrorException('Failed to fetch daily attendance summary');
        }
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(attendance_entity_1.Attendance)),
    __param(1, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map