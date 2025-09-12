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
exports.SchemeLeaveType = void 0;
const typeorm_1 = require("typeorm");
const leave_scheme_entity_1 = require("./leave-scheme.entity");
const leave_type_entity_1 = require("./leave-type.entity");
let SchemeLeaveType = class SchemeLeaveType {
};
exports.SchemeLeaveType = SchemeLeaveType;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SchemeLeaveType.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], SchemeLeaveType.prototype, "scheme_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], SchemeLeaveType.prototype, "leave_type_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], SchemeLeaveType.prototype, "days_allowed", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], SchemeLeaveType.prototype, "is_paid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], SchemeLeaveType.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], SchemeLeaveType.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], SchemeLeaveType.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], SchemeLeaveType.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => leave_scheme_entity_1.LeaveScheme, scheme => scheme.schemeLeaveTypes),
    (0, typeorm_1.JoinColumn)({ name: 'scheme_id' }),
    __metadata("design:type", leave_scheme_entity_1.LeaveScheme)
], SchemeLeaveType.prototype, "scheme", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => leave_type_entity_1.LeaveType),
    (0, typeorm_1.JoinColumn)({ name: 'leave_type_id' }),
    __metadata("design:type", leave_type_entity_1.LeaveType)
], SchemeLeaveType.prototype, "leaveType", void 0);
exports.SchemeLeaveType = SchemeLeaveType = __decorate([
    (0, typeorm_1.Entity)('scheme_leave_types')
], SchemeLeaveType);
//# sourceMappingURL=scheme-leave-type.entity.js.map