import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropLeaveApprovalsTable1756444175000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // First drop indexes associated with leave_approvals table
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_leave_approvals_application;
      DROP INDEX IF EXISTS idx_leave_approvals_approver;
      DROP INDEX IF EXISTS idx_leave_approvals_status;
    `);

    // Drop the trigger for updating timestamps
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS set_leave_approvals_updated_at ON leave_approvals;
    `);

    // Drop the leave_approvals table
    await queryRunner.query(`
      DROP TABLE IF EXISTS leave_approvals;
    `);

    // Add comments column to leave_applications if it doesn't exist
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

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Recreate the leave_approvals table if we need to roll back
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

    // Recreate indexes
    await queryRunner.query(`
      CREATE INDEX idx_leave_approvals_application ON leave_approvals(leave_application_id);
      CREATE INDEX idx_leave_approvals_approver ON leave_approvals(approver_id);
      CREATE INDEX idx_leave_approvals_status ON leave_approvals(status);
    `);

    // Recreate trigger
    await queryRunner.query(`
      CREATE TRIGGER set_leave_approvals_updated_at
      BEFORE UPDATE ON leave_approvals
      FOR EACH ROW
      EXECUTE FUNCTION update_timestamp();
    `);
  }
}
