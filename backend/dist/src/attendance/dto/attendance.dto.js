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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDailyAttendanceSummaryDto = exports.GetAttendanceQueryDto = exports.AttendanceDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class AttendanceDto {
}
exports.AttendanceDto = AttendanceDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AttendanceDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AttendanceDto.prototype, "employee_id", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], AttendanceDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AttendanceDto.prototype, "status", void 0);
class GetAttendanceQueryDto {
}
exports.GetAttendanceQueryDto = GetAttendanceQueryDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(12),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], GetAttendanceQueryDto.prototype, "month", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(2000),
    (0, class_validator_1.Max)(2100),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], GetAttendanceQueryDto.prototype, "year", void 0);
class GetDailyAttendanceSummaryDto {
}
exports.GetDailyAttendanceSummaryDto = GetDailyAttendanceSummaryDto;
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], GetDailyAttendanceSummaryDto.prototype, "date", void 0);
//# sourceMappingURL=attendance.dto.js.map