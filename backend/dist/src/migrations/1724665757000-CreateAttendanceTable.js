"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAttendanceTable1724665757000 = void 0;
class CreateAttendanceTable1724665757000 {
    async up(queryRunner) {
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
    async down(queryRunner) {
        await queryRunner.query(`
      DROP TABLE IF EXISTS attendance;
    `);
    }
}
exports.CreateAttendanceTable1724665757000 = CreateAttendanceTable1724665757000;
//# sourceMappingURL=1724665757000-CreateAttendanceTable.js.map