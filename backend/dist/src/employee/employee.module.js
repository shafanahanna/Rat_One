"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const employee_controller_1 = require("./employee.controller");
const employee_service_1 = require("./employee.service");
const employee_entity_1 = require("./employee.entity");
const cloudinary_config_1 = require("../config/cloudinary.config");
let EmployeeModule = class EmployeeModule {
};
exports.EmployeeModule = EmployeeModule;
exports.EmployeeModule = EmployeeModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([employee_entity_1.Employee]),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    secret: configService.get('JWT_SECRET') || 'your-secret-key',
                    signOptions: { expiresIn: '24h' },
                }),
            }),
            config_1.ConfigModule,
        ],
        controllers: [employee_controller_1.EmployeeController,],
        providers: [employee_service_1.EmployeeService, cloudinary_config_1.CloudinaryProvider, cloudinary_config_1.CloudinaryService],
        exports: [employee_service_1.EmployeeService],
    })
], EmployeeModule);
//# sourceMappingURL=employee.module.js.map