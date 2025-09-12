"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const branch_module_1 = require("./branch/branch.module");
const country_module_1 = require("./country/country.module");
const user_module_1 = require("./user/user.module");
const employee_module_1 = require("./employee/employee.module");
const payroll_module_1 = require("./payroll/payroll.module");
const attendance_module_1 = require("./attendance/attendance.module");
const leave_management_module_1 = require("./leave-management/leave-management.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const sslValue = configService.get('PG_SSL');
                    const sslEnabled = sslValue === 'true' || sslValue === true;
                    console.log('SSL Enabled:', sslEnabled);
                    return {
                        type: 'postgres',
                        host: configService.get('PG_HOST'),
                        port: configService.get('PG_PORT'),
                        username: configService.get('PG_USER'),
                        password: configService.get('PG_PASSWORD'),
                        database: configService.get('PG_DATABASE'),
                        entities: [__dirname + '/**/*.entity{.ts,.js}'],
                        ssl: sslEnabled ? { rejectUnauthorized: false } : false,
                        synchronize: false,
                    };
                },
            }),
            auth_module_1.AuthModule,
            branch_module_1.BranchModule,
            country_module_1.CountryModule,
            user_module_1.UserModule,
            employee_module_1.EmployeeModule,
            payroll_module_1.PayrollModule,
            attendance_module_1.AttendanceModule,
            leave_management_module_1.LeaveManagementModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map