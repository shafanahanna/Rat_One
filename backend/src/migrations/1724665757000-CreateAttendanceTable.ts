import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAttendanceTable1724665757000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if uuid-ossp extension exists
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `);
    
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id UUID DEFAULT uuid_generate_v4() NOT NULL,
        employee_id UUID NOT NULL,
        date DATE NOT NULL,
        status VARCHAR(10) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        CONSTRAINT fk_employee
          FOREIGN KEY (employee_id)
          REFERENCES employees(id)
          ON DELETE CASCADE
      );
      
      CREATE INDEX idx_attendance_date ON attendance(date);
      CREATE INDEX idx_attendance_employee ON attendance(employee_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS attendance;
    `);
  }
}
