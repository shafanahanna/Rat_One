import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private pgPool: Pool;

  constructor(
    private configService: ConfigService,
    private dataSource: DataSource
  ) {}

  onModuleInit() {
    const sslValue = this.configService.get('PG_SSL');
    const sslEnabled = sslValue === 'true' || sslValue === true;
    console.log('DatabaseService SSL Enabled:', sslEnabled); // Debug log
    
    this.pgPool = new Pool({
      user: this.configService.get('PG_USER'),
      host: this.configService.get('PG_HOST'),
      database: this.configService.get('PG_DATABASE'),
      password: this.configService.get('PG_PASSWORD'),
      port: this.configService.get<number>('PG_PORT'),
      ssl: sslEnabled ? { rejectUnauthorized: false } : false,
    });
  }

  getPool(): Pool {
    return this.pgPool;
  }

  async query(text: string, params?: any[]) {
    return this.pgPool.query(text, params);
  }

  // TypeORM methods
  getDataSource(): DataSource {
    return this.dataSource;
  }

  // Execute a raw query using TypeORM
  async executeRawQuery(query: string, parameters?: any[]): Promise<any> {
    return this.dataSource.query(query, parameters);
  }

  // Get a TypeORM repository for a specific entity
  getRepository<Entity>(entityClass: any): any {
    return this.dataSource.getRepository(entityClass);
  }
}
