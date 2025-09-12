"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropLeaveApprovalsTable1756444175000 = void 0;
class DropLeaveApprovalsTable1756444175000 {
    async up(queryRunner) {
        await queryRunner.query(`
      DROP INDEX IF EXISTS idx_leave_approvals_application;
      DROP INDEX IF EXISTS idx_leave_approvals_approver;
      DROP INDEX IF EXISTS idx_leave_approvals_status;
    `);
        await queryRunner.query(`
      DROP TRIGGER IF EXISTS set_leave_approvals_updated_at ON leave_approvals;
    `);
        await queryRunner.query(`
      DROP TABLE IF EXISTS leave_approvals;
    `);
        await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'leave_applications' AND column_name = 'comments'
        ) THEN
          ALTER TABLE leave_applications ADD COLUMN comments TEXT;
        END IF;
      END $$;
    `);
    }
    async down(queryRunner) {
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
      CREATE INDEX idx_leave_approvals_application ON leave_approvals(leave_application_id);
      CREATE INDEX idx_leave_approvals_approver ON leave_approvals(approver_id);
      CREATE INDEX idx_leave_approvals_status ON leave_approvals(status);
    `);
        await queryRunner.query(`
      CREATE TRIGGER set_leave_approvals_updated_at
      BEFORE UPDATE ON leave_approvals
      FOR EACH ROW
      EXECUTE FUNCTION update_timestamp();
    `);
    }
}
exports.DropLeaveApprovalsTable1756444175000 = DropLeaveApprovalsTable1756444175000;
//# sourceMappingURL=1756444175000-DropLeaveApprovalsTable.js.map