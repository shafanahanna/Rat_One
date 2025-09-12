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
exports.Employee = void 0;
const typeorm_1 = require("typeorm");
const branch_entity_1 = require("../branch/entities/branch.entity");
const user_entity_1 = require("../auth/entities/user.entity");
let Employee = class Employee {
};
exports.Employee = Employee;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Employee.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', nullable: true }),
    __metadata("design:type", String)
], Employee.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Employee.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'full_name', length: 255 }),
    __metadata("design:type", String)
], Employee.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Employee.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Employee.prototype, "designation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date_of_joining', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Employee.prototype, "dateOfJoining", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Employee.prototype, "salary", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'proposed_salary', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Employee.prototype, "proposedSalary", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'salary_status', length: 50, default: 'Approved' }),
    __metadata("design:type", String)
], Employee.prototype, "salaryStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'emp_code', length: 20, nullable: true }),
    __metadata("design:type", String)
], Employee.prototype, "empCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'branch_id', nullable: true }),
    __metadata("design:type", String)
], Employee.prototype, "branchId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => branch_entity_1.Branch, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'branch_id' }),
    __metadata("design:type", branch_entity_1.Branch)
], Employee.prototype, "branch", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'profile_picture', length: 255, nullable: true }),
    __metadata("design:type", String)
], Employee.prototype, "profilePicture", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Employee.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Employee.prototype, "updatedAt", void 0);
exports.Employee = Employee = __decorate([
    (0, typeorm_1.Entity)('employees')
], Employee);
//# sourceMappingURL=employee.entity.js.map