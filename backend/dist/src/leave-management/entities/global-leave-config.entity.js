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
exports.GlobalLeaveConfig = void 0;
const typeorm_1 = require("typeorm");
let GlobalLeaveConfig = class GlobalLeaveConfig {
};
exports.GlobalLeaveConfig = GlobalLeaveConfig;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], GlobalLeaveConfig.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: false, unique: true }),
    __metadata("design:type", String)
], GlobalLeaveConfig.prototype, "key", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: false }),
    __metadata("design:type", Object)
], GlobalLeaveConfig.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], GlobalLeaveConfig.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], GlobalLeaveConfig.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], GlobalLeaveConfig.prototype, "updated_at", void 0);
exports.GlobalLeaveConfig = GlobalLeaveConfig = __decorate([
    (0, typeorm_1.Entity)('global_leave_config')
], GlobalLeaveConfig);
//# sourceMappingURL=global-leave-config.entity.js.map