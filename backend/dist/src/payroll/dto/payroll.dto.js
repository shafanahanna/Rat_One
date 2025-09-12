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
exports.UpdatePayrollStatusDto = exports.RecalculatePayrollDto = exports.PayrollPeriodDto = void 0;
const class_validator_1 = require("class-validator");
class PayrollPeriodDto {
}
exports.PayrollPeriodDto = PayrollPeriodDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(12),
    __metadata("design:type", Number)
], PayrollPeriodDto.prototype, "month", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1900),
    (0, class_validator_1.Max)(9999),
    __metadata("design:type", Number)
], PayrollPeriodDto.prototype, "year", void 0);
class RecalculatePayrollDto extends PayrollPeriodDto {
}
exports.RecalculatePayrollDto = RecalculatePayrollDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], RecalculatePayrollDto.prototype, "forceRecalculate", void 0);
class UpdatePayrollStatusDto {
}
exports.UpdatePayrollStatusDto = UpdatePayrollStatusDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['Paid']),
    __metadata("design:type", String)
], UpdatePayrollStatusDto.prototype, "payment_status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdatePayrollStatusDto.prototype, "payment_date", void 0);
//# sourceMappingURL=payroll.dto.js.map