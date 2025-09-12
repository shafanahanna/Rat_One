"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveManagementModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const employee_module_1 = require("../employee/employee.module");
const leave_balance_entity_1 = require("./entities/leave-balance.entity");
const global_leave_config_entity_1 = require("./entities/global-leave-config.entity");
const employee_entity_1 = require("../employee/employee.entity");
const entities_1 = require("./entities");
const leave_scheme_entity_1 = require("./entities/leave-scheme.entity");
const scheme_leave_type_entity_1 = require("./entities/scheme-leave-type.entity");
const employee_leave_scheme_entity_1 = require("./entities/employee-leave-scheme.entity");
const leave_type_controller_1 = require("./controllers/leave-type.controller");
const leave_application_controller_1 = require("./controllers/leave-application.controller");
const leave_balance_controller_1 = require("./controllers/leave-balance.controller");
const global_leave_config_controller_1 = require("./controllers/global-leave-config.controller");
const leave_type_setup_controller_1 = require("./controllers/leave-type-setup.controller");
const leave_scheme_controller_1 = require("./controllers/leave-scheme.controller");
const employee_leave_scheme_controller_1 = require("./controllers/employee-leave-scheme.controller");
const leave_type_service_1 = require("./services/leave-type.service");
const leave_application_service_1 = require("./services/leave-application.service");
const leave_balance_service_1 = require("./services/leave-balance.service");
const global_leave_config_service_1 = require("./services/global-leave-config.service");
const setup_default_leave_types_1 = require("./scripts/setup-default-leave-types");
const leave_scheme_service_1 = require("./services/leave-scheme.service");
const employee_leave_scheme_service_1 = require("./services/employee-leave-scheme.service");
const pg_1 = require("pg");
let LeaveManagementModule = class LeaveManagementModule {
};
exports.LeaveManagementModule = LeaveManagementModule;
exports.LeaveManagementModule = LeaveManagementModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                entities_1.LeaveType,
                entities_1.LeaveApplication,
                leave_balance_entity_1.LeaveBalance,
                global_leave_config_entity_1.GlobalLeaveConfig,
                employee_entity_1.Employee,
                leave_scheme_entity_1.LeaveScheme,
                scheme_leave_type_entity_1.SchemeLeaveType,
                employee_leave_scheme_entity_1.EmployeeLeaveScheme,
            ]),
            employee_module_1.EmployeeModule,
        ],
        controllers: [
            leave_type_controller_1.LeaveTypeController,
            leave_application_controller_1.LeaveApplicationController,
            leave_balance_controller_1.LeaveBalanceController,
            global_leave_config_controller_1.GlobalLeaveConfigController,
            leave_type_setup_controller_1.LeaveTypeSetupController,
            leave_scheme_controller_1.LeaveSchemeController,
            employee_leave_scheme_controller_1.EmployeeLeaveSchemeController,
        ],
        providers: [
            leave_type_service_1.LeaveTypeService,
            leave_application_service_1.LeaveApplicationService,
            leave_balance_service_1.LeaveBalanceService,
            global_leave_config_service_1.GlobalLeaveConfigService,
            setup_default_leave_types_1.LeaveTypeSetupService,
            leave_scheme_service_1.LeaveSchemeService,
            employee_leave_scheme_service_1.EmployeeLeaveSchemeService,
            {
                provide: pg_1.Pool,
                useFactory: () => {
                    return new pg_1.Pool({
                        connectionString: process.env.DATABASE_URL,
                        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
                    });
                },
            },
        ],
        exports: [
            leave_type_service_1.LeaveTypeService,
            leave_application_service_1.LeaveApplicationService,
            leave_balance_service_1.LeaveBalanceService,
            global_leave_config_service_1.GlobalLeaveConfigService,
            leave_scheme_service_1.LeaveSchemeService,
            employee_leave_scheme_service_1.EmployeeLeaveSchemeService,
        ],
    })
], LeaveManagementModule);
//# sourceMappingURL=leave-management.module.js.map