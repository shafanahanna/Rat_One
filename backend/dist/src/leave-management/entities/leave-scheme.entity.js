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
exports.LeaveScheme = void 0;
const typeorm_1 = require("typeorm");
const employee_leave_scheme_entity_1 = require("./employee-leave-scheme.entity");
const scheme_leave_type_entity_1 = require("./scheme-leave-type.entity");
let LeaveScheme = class LeaveScheme {
};
exports.LeaveScheme = LeaveScheme;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], LeaveScheme.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], LeaveScheme.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], LeaveScheme.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], LeaveScheme.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], LeaveScheme.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], LeaveScheme.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], LeaveScheme.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => scheme_leave_type_entity_1.SchemeLeaveType, schemeLeaveType => schemeLeaveType.scheme),
    __metadata("design:type", Array)
], LeaveScheme.prototype, "schemeLeaveTypes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => employee_leave_scheme_entity_1.EmployeeLeaveScheme, employeeLeaveScheme => employeeLeaveScheme.scheme),
    __metadata("design:type", Array)
], LeaveScheme.prototype, "employeeLeaveSchemes", void 0);
exports.LeaveScheme = LeaveScheme = __decorate([
    (0, typeorm_1.Entity)('leave_schemes')
], LeaveScheme);
//# sourceMappingURL=leave-scheme.entity.js.map