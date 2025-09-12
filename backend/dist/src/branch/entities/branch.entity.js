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
exports.Branch = void 0;
const typeorm_1 = require("typeorm");
const country_entity_1 = require("../../country/entities/country.entity");
const user_entity_1 = require("../../auth/entities/user.entity");
let Branch = class Branch {
};
exports.Branch = Branch;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Branch.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Branch.prototype, "country_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Branch.prototype, "branch_code", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Branch.prototype, "branch_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Branch.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Branch.prototype, "state_province", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Branch.prototype, "is_headquarters", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Branch.prototype, "manager_user_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => country_entity_1.Country, country => country.branches),
    (0, typeorm_1.JoinColumn)({ name: 'country_id' }),
    __metadata("design:type", country_entity_1.Country)
], Branch.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'manager_user_id' }),
    __metadata("design:type", user_entity_1.User)
], Branch.prototype, "manager", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_entity_1.User, user => user.branch_id),
    __metadata("design:type", Array)
], Branch.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Branch.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Branch.prototype, "updated_at", void 0);
exports.Branch = Branch = __decorate([
    (0, typeorm_1.Entity)('branches')
], Branch);
//# sourceMappingURL=branch.entity.js.map