import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const sslEnabled = process.env.PG_SSL === 'true';
console.log('Migration SSL Enabled:', sslEnabled); // Debug log

export default new DataSource({
  type: 'postgres',
  host: process.env.PG_HOST || 'localhost',
  port: parseInt(process.env.PG_PORT || '5432'),
  username: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || '12345678',
  database: process.env.PG_DATABASE || 'tavel_local',
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  ssl: sslEnabled ? { rejectUnauthorized: false } : false,
});