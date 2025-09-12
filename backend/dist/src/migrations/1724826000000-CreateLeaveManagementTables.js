"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateLeaveManagementTables1724826000000 = void 0;
class CreateLeaveManagementTables1724826000000 {
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS leave_types (
        id UUID DEFAULT uuid_generate_v4() NOT NULL,
        name VARCHAR(50) NOT NULL,
        description TEXT,
        is_paid BOOLEAN DEFAULT TRUE,
        max_days INTEGER NOT NULL,
        color VARCHAR(20) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        PRIMARY KEY (id)
      );
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS leave_applications (
        id UUID DEFAULT uuid_generate_v4() NOT NULL,
        employee_id UUID NOT NULL,
        leave_type_id UUID NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        working_days NUMERIC(5,1) NOT NULL,
        reason TEXT,
        attachment_url TEXT,
        status VARCHAR(20) DEFAULT 'Pending' NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        PRIMARY KEY (id),
        CONSTRAINT fk_employee
          FOREIGN KEY (employee_id)
          REFERENCES employees(id)
          ON DELETE CASCADE,
        CONSTRAINT fk_leave_type
          FOREIGN KEY (leave_type_id)
          REFERENCES leave_types(id)
          ON DELETE RESTRICT,
        CONSTRAINT valid_date_range CHECK (end_date >= start_date)
      );
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS leave_approvals (
        id UUID DEFAULT uuid_generate_v4() NOT NULL,
        leave_application_id UUID NOT NULL,
        approver_id UUID NOT NULL,
        status VARCHAR(20) NOT NULL,
        comments TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        PRIMARY KEY (id),
        CONSTRAINT fk_leave_application
          FOREIGN KEY (leave_application_id)
          REFERENCES leave_applications(id)
          ON DELETE CASCADE,
        CONSTRAINT fk_approver
          FOREIGN KEY (approver_id)
          REFERENCES employees(id)
          ON DELETE RESTRICT
      );
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS leave_balances (
        id UUID DEFAULT uuid_generate_v4() NOT NULL,
        employee_id UUID NOT NULL,
        leave_type_id UUID NOT NULL,
        year INTEGER NOT NULL,
        allocated_days NUMERIC(5,1) NOT NULL,
        used_days NUMERIC(5,1) DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        PRIMARY KEY (id),
        CONSTRAINT fk_employee_balance
          FOREIGN KEY (employee_id)
          REFERENCES employees(id)
          ON DELETE CASCADE,
        CONSTRAINT fk_leave_type_balance
          FOREIGN KEY (leave_type_id)
          REFERENCES leave_types(id)
          ON DELETE RESTRICT,
        CONSTRAINT unique_employee_leave_type_year UNIQUE (employee_id, leave_type_id, year)
      );
    `);
        await queryRunner.query(`
      CREATE INDEX idx_leave_applications_employee ON leave_applications(employee_id);
      CREATE INDEX idx_leave_applications_leave_type ON leave_applications(leave_type_id);
      CREATE INDEX idx_leave_applications_status ON leave_applications(status);
      CREATE INDEX idx_leave_applications_dates ON leave_applications(start_date, end_date);
      
      CREATE INDEX idx_leave_approvals_application ON leave_approvals(leave_application_id);
      CREATE INDEX idx_leave_approvals_approver ON leave_approvals(approver_id);
      CREATE INDEX idx_leave_approvals_status ON leave_approvals(status);
      
      CREATE INDEX idx_leave_balances_employee ON leave_balances(employee_id);
      CREATE INDEX idx_leave_balances_leave_type ON leave_balances(leave_type_id);
      CREATE INDEX idx_leave_balances_year ON leave_balances(year);
    `);
        await queryRunner.query(`
      CREATE TRIGGER set_leave_types_updated_at
      BEFORE UPDATE ON leave_types
      FOR EACH ROW
      EXECUTE FUNCTION update_timestamp();

      CREATE TRIGGER set_leave_applications_updated_at
      BEFORE UPDATE ON leave_applications
      FOR EACH ROW
      EXECUTE FUNCTION update_timestamp();

      CREATE TRIGGER set_leave_approvals_updated_at
      BEFORE UPDATE ON leave_approvals
      FOR EACH ROW
      EXECUTE FUNCTION update_timestamp();

      CREATE TRIGGER set_leave_balances_updated_at
      BEFORE UPDATE ON leave_balances
      FOR EACH ROW
      EXECUTE FUNCTION update_timestamp();
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      DROP TABLE IF EXISTS leave_balances;
      DROP TABLE IF EXISTS leave_approvals;
      DROP TABLE IF EXISTS leave_applications;
      DROP TABLE IF EXISTS leave_types;
    `);
    }
}
exports.CreateLeaveManagementTables1724826000000 = CreateLeaveManagementTables1724826000000;
//# sourceMappingURL=1724826000000-CreateLeaveManagementTables.js.map