"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const branch_service_1 = require("./branch.service");
const branch_controller_1 = require("./branch.controller");
const branch_entity_1 = require("./entities/branch.entity");
const country_entity_1 = require("../country/entities/country.entity");
const user_entity_1 = require("../auth/entities/user.entity");
let BranchModule = class BranchModule {
};
exports.BranchModule = BranchModule;
exports.BranchModule = BranchModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([branch_entity_1.Branch, country_entity_1.Country, user_entity_1.User]),
        ],
        controllers: [branch_controller_1.BranchController],
        providers: [branch_service_1.BranchService],
        exports: [branch_service_1.BranchService],
    })
], BranchModule);
//# sourceMappingURL=branch.module.js.map