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
exports.AttendanceController = void 0;
const common_1 = require("@nestjs/common");
const attendance_service_1 = require("./attendance.service");
const attendance_dto_1 = require("./dto/attendance.dto");
let AttendanceController = class AttendanceController {
    constructor(attendanceService) {
        this.attendanceService = attendanceService;
    }
    async getAttendance(query) {
        const { month, year } = query;
        if (!month || !year) {
            throw new common_1.HttpException({
                status: 'Error',
                message: 'Month and year are required.',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const data = await this.attendanceService.getAttendance(month.toString(), year.toString());
            return {
                status: 'Success',
                data,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'Error',
                message: error.message || 'Internal server error',
            }, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async setAttendance(attendanceDto) {
        try {
            const result = await this.attendanceService.setAttendance(attendanceDto);
            if (result === null) {
                return {
                    status: 'Success',
                    message: 'Attendance unmarked.',
                    data: null,
                };
            }
            return {
                status: 'Success',
                data: result,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'Error',
                message: error.message || 'Internal server error',
            }, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getDailyAttendanceSummary(query) {
        const { date } = query;
        if (!date) {
            throw new common_1.HttpException({
                message: 'Date is required.',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const dateString = date.toISOString().split('T')[0];
            const summary = await this.attendanceService.getDailyAttendanceSummary(dateString);
            return summary;
        }
        catch (error) {
            throw new common_1.HttpException({
                message: 'Failed to fetch daily attendance summary.',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.AttendanceController = AttendanceController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attendance_dto_1.GetAttendanceQueryDto]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getAttendance", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attendance_dto_1.AttendanceDto]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "setAttendance", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attendance_dto_1.GetDailyAttendanceSummaryDto]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getDailyAttendanceSummary", null);
exports.AttendanceController = AttendanceController = __decorate([
    (0, common_1.Controller)('attendance'),
    __metadata("design:paramtypes", [attendance_service_1.AttendanceService])
], AttendanceController);
//# sourceMappingURL=attendance.controller.js.map