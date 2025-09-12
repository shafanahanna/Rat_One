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
exports.Payroll = void 0;
const typeorm_1 = require("typeorm");
const employee_entity_1 = require("../../employee/employee.entity");
let Payroll = class Payroll {
};
exports.Payroll = Payroll;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Payroll.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'employee_id' }),
    __metadata("design:type", String)
], Payroll.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee),
    (0, typeorm_1.JoinColumn)({ name: 'employee_id' }),
    __metadata("design:type", employee_entity_1.Employee)
], Payroll.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Payroll.prototype, "month", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Payroll.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'basic_salary', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Payroll.prototype, "basicSalary", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'allowances', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Payroll.prototype, "allowances", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Payroll.prototype, "deductions", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unpaid_days', type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Payroll.prototype, "unpaidDays", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'net_salary', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Payroll.prototype, "netSalary", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Payroll.prototype, "paymentDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_status', default: 'Pending', length: 50 }),
    __metadata("design:type", String)
], Payroll.prototype, "paymentStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Payroll.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Payroll.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Payroll.prototype, "updatedAt", void 0);
exports.Payroll = Payroll = __decorate([
    (0, typeorm_1.Entity)('payroll')
], Payroll);
//# sourceMappingURL=payroll.entity.js.map