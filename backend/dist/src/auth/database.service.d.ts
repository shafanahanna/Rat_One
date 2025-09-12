import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { DataSource } from 'typeorm';
export declare class DatabaseService implements OnModuleInit {
    private configService;
    private dataSource;
    private pgPool;
    constructor(configService: ConfigService, dataSource: DataSource);
    onModuleInit(): void;
    getPool(): Pool;
    query(text: string, params?: any[]): Promise<any>;
    getDataSource(): DataSource;
    executeRawQuery(query: string, parameters?: any[]): Promise<any>;
    getRepository<Entity>(entityClass: any): any;
}
