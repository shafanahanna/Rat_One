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
exports.CreateLeaveApplicationDto = void 0;
const class_validator_1 = require("class-validator");
var LeaveDurationType;
(function (LeaveDurationType) {
    LeaveDurationType["FULL_DAY"] = "full_day";
    LeaveDurationType["HALF_DAY_MORNING"] = "half_day_morning";
    LeaveDurationType["HALF_DAY_AFTERNOON"] = "half_day_afternoon";
})(LeaveDurationType || (LeaveDurationType = {}));
class CreateLeaveApplicationDto {
}
exports.CreateLeaveApplicationDto = CreateLeaveApplicationDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLeaveApplicationDto.prototype, "leave_type_id", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLeaveApplicationDto.prototype, "start_date", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLeaveApplicationDto.prototype, "end_date", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLeaveApplicationDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateLeaveApplicationDto.prototype, "contact_during_leave", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.ValidateIf)(o => o.employee_id !== undefined),
    __metadata("design:type", String)
], CreateLeaveApplicationDto.prototype, "employee_id", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(LeaveDurationType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateLeaveApplicationDto.prototype, "leave_duration_type", void 0);
//# sourceMappingURL=create-leave-application.dto.js.map