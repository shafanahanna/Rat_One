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
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const pg_1 = require("pg");
const typeorm_1 = require("typeorm");
let DatabaseService = class DatabaseService {
    constructor(configService, dataSource) {
        this.configService = configService;
        this.dataSource = dataSource;
    }
    onModuleInit() {
        const sslValue = this.configService.get('PG_SSL');
        const sslEnabled = sslValue === 'true' || sslValue === true;
        console.log('DatabaseService SSL Enabled:', sslEnabled);
        this.pgPool = new pg_1.Pool({
            user: this.configService.get('PG_USER'),
            host: this.configService.get('PG_HOST'),
            database: this.configService.get('PG_DATABASE'),
            password: this.configService.get('PG_PASSWORD'),
            port: this.configService.get('PG_PORT'),
            ssl: sslEnabled ? { rejectUnauthorized: false } : false,
        });
    }
    getPool() {
        return this.pgPool;
    }
    async query(text, params) {
        return this.pgPool.query(text, params);
    }
    getDataSource() {
        return this.dataSource;
    }
    async executeRawQuery(query, parameters) {
        return this.dataSource.query(query, parameters);
    }
    getRepository(entityClass) {
        return this.dataSource.getRepository(entityClass);
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        typeorm_1.DataSource])
], DatabaseService);
//# sourceMappingURL=database.service.js.map