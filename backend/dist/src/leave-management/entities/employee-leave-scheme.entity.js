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
exports.EmployeeLeaveScheme = void 0;
const typeorm_1 = require("typeorm");
const leave_scheme_entity_1 = require("./leave-scheme.entity");
const employee_entity_1 = require("../../employee/employee.entity");
let EmployeeLeaveScheme = class EmployeeLeaveScheme {
};
exports.EmployeeLeaveScheme = EmployeeLeaveScheme;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], EmployeeLeaveScheme.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], EmployeeLeaveScheme.prototype, "employee_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], EmployeeLeaveScheme.prototype, "scheme_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], EmployeeLeaveScheme.prototype, "effective_from", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp with time zone', nullable: true }),
    __metadata("design:type", Date)
], EmployeeLeaveScheme.prototype, "effective_to", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], EmployeeLeaveScheme.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], EmployeeLeaveScheme.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], EmployeeLeaveScheme.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], EmployeeLeaveScheme.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee),
    (0, typeorm_1.JoinColumn)({ name: 'employee_id' }),
    __metadata("design:type", employee_entity_1.Employee)
], EmployeeLeaveScheme.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => leave_scheme_entity_1.LeaveScheme, scheme => scheme.employeeLeaveSchemes),
    (0, typeorm_1.JoinColumn)({ name: 'scheme_id' }),
    __metadata("design:type", leave_scheme_entity_1.LeaveScheme)
], EmployeeLeaveScheme.prototype, "scheme", void 0);
exports.EmployeeLeaveScheme = EmployeeLeaveScheme = __decorate([
    (0, typeorm_1.Entity)('employee_leave_schemes')
], EmployeeLeaveScheme);
//# sourceMappingURL=employee-leave-scheme.entity.js.map