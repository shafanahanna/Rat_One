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
exports.PayrollController = void 0;
const common_1 = require("@nestjs/common");
const payroll_service_1 = require("./payroll.service");
const payroll_dto_1 = require("./dto/payroll.dto");
let PayrollController = class PayrollController {
    constructor(payrollService) {
        this.payrollService = payrollService;
    }
    recalculatePayroll(recalculateDto) {
        return this.payrollService.recalculatePayroll(recalculateDto);
    }
    runPayroll(periodDto) {
        return this.payrollService.runPayroll(periodDto.month, periodDto.year);
    }
    getPayroll(periodDto) {
        return this.payrollService.getPayroll(periodDto);
    }
    updatePayrollStatus(id, updateDto) {
        return this.payrollService.updatePayrollStatus(id, updateDto);
    }
    getPayrollSummary(periodDto) {
        return this.payrollService.getPayrollSummary(periodDto);
    }
};
exports.PayrollController = PayrollController;
__decorate([
    (0, common_1.Post)('recalculate'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payroll_dto_1.RecalculatePayrollDto]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "recalculatePayroll", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payroll_dto_1.PayrollPeriodDto]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "runPayroll", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payroll_dto_1.PayrollPeriodDto]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "getPayroll", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payroll_dto_1.UpdatePayrollStatusDto]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "updatePayrollStatus", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payroll_dto_1.PayrollPeriodDto]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "getPayrollSummary", null);
exports.PayrollController = PayrollController = __decorate([
    (0, common_1.Controller)('hr/payroll'),
    __metadata("design:paramtypes", [payroll_service_1.PayrollService])
], PayrollController);
//# sourceMappingURL=payroll.controller.js.map