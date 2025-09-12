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
exports.LeaveApplication = void 0;
const typeorm_1 = require("typeorm");
const leave_type_entity_1 = require("./leave-type.entity");
const employee_entity_1 = require("../../employee/employee.entity");
let LeaveApplication = class LeaveApplication {
};
exports.LeaveApplication = LeaveApplication;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], LeaveApplication.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: false }),
    __metadata("design:type", String)
], LeaveApplication.prototype, "employee_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: false }),
    __metadata("design:type", String)
], LeaveApplication.prototype, "leave_type_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: false }),
    __metadata("design:type", Date)
], LeaveApplication.prototype, "start_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: false }),
    __metadata("design:type", Date)
], LeaveApplication.prototype, "end_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 1, nullable: false }),
    __metadata("design:type", Number)
], LeaveApplication.prototype, "working_days", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: false }),
    __metadata("design:type", String)
], LeaveApplication.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], LeaveApplication.prototype, "attachment_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], LeaveApplication.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['pending', 'approved', 'rejected', 'cancelled'],
        default: 'pending',
    }),
    __metadata("design:type", String)
], LeaveApplication.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], LeaveApplication.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], LeaveApplication.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee),
    (0, typeorm_1.JoinColumn)({ name: 'employee_id' }),
    __metadata("design:type", employee_entity_1.Employee)
], LeaveApplication.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('LeaveType', 'leaveApplications'),
    (0, typeorm_1.JoinColumn)({ name: 'leave_type_id' }),
    __metadata("design:type", leave_type_entity_1.LeaveType)
], LeaveApplication.prototype, "leaveType", void 0);
exports.LeaveApplication = LeaveApplication = __decorate([
    (0, typeorm_1.Entity)('leave_applications')
], LeaveApplication);
//# sourceMappingURL=leave-application.entity.js.map