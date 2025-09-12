import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration to create leave configuration tables
 * Date: 2025-08-31
 */
export class CreateLeaveConfigurationTables1756444173000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      console.log('Creating leave configuration tables...');
      
      // Create leave_schemes table
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "leave_schemes" (
          "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          "name" VARCHAR(100) NOT NULL,
          "is_active" BOOLEAN DEFAULT TRUE,
          "created_by" UUID,
          "updated_by" UUID,
          "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          CONSTRAINT "leave_schemes_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE RESTRICT,
          CONSTRAINT "leave_schemes_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users" ("id") ON DELETE RESTRICT
        );
      `);
      console.log('✅ leave_schemes table created successfully');
      
      // Create leave_types table
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "leave_types" (
          "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          "name" VARCHAR(100) NOT NULL,
          "code" VARCHAR(20) NOT NULL UNIQUE,
          "description" TEXT,
          "is_paid" BOOLEAN DEFAULT TRUE,
          "is_active" BOOLEAN DEFAULT TRUE,
          "created_by" UUID NULL,
          "updated_by" UUID NULL,
          "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          CONSTRAINT "leave_types_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE SET NULL,
          CONSTRAINT "leave_types_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users" ("id") ON DELETE SET NULL
        );
      `);
      console.log('✅ leave_types table created successfully');
      
      // Create scheme_leave_types junction table
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "scheme_leave_types" (
          "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          "scheme_id" UUID NOT NULL,
          "leave_type_id" UUID NOT NULL,
          "days_allowed" INTEGER NOT NULL,
          "is_paid" BOOLEAN DEFAULT TRUE,
          "created_by" UUID,
          "updated_by" UUID,
          "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          CONSTRAINT "scheme_leave_types_scheme_id_fkey" FOREIGN KEY ("scheme_id") REFERENCES "leave_schemes" ("id") ON DELETE CASCADE,
          CONSTRAINT "scheme_leave_types_leave_type_id_fkey" FOREIGN KEY ("leave_type_id") REFERENCES "leave_types" ("id") ON DELETE CASCADE,
          CONSTRAINT "scheme_leave_types_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE RESTRICT,
          CONSTRAINT "scheme_leave_types_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users" ("id") ON DELETE RESTRICT,
          CONSTRAINT "scheme_leave_types_unique" UNIQUE ("scheme_id", "leave_type_id")
        );
      `);
      console.log('✅ scheme_leave_types table created successfully');
      
      // Create employee_leave_schemes table
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "employee_leave_schemes" (
          "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          "employee_id" UUID NOT NULL,
          "scheme_id" UUID NOT NULL,
          "effective_from" DATE NOT NULL DEFAULT CURRENT_DATE,
          "effective_to" DATE,
          "created_by" UUID,
          "updated_by" UUID,
          "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          CONSTRAINT "employee_leave_schemes_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees" ("id") ON DELETE CASCADE,
          CONSTRAINT "employee_leave_schemes_scheme_id_fkey" FOREIGN KEY ("scheme_id") REFERENCES "leave_schemes" ("id") ON DELETE CASCADE,
          CONSTRAINT "employee_leave_schemes_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE RESTRICT,
          CONSTRAINT "employee_leave_schemes_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users" ("id") ON DELETE RESTRICT,
          CONSTRAINT "employee_leave_schemes_active_unique" UNIQUE ("employee_id", "scheme_id", "effective_from"),
          CONSTRAINT "effective_date_check" CHECK (effective_to IS NULL OR effective_to > effective_from)
        );
      `);
      console.log('✅ employee_leave_schemes table created successfully');
      
      // Create update_timestamp function if it doesn't exist
      await queryRunner.query(`
        CREATE OR REPLACE FUNCTION update_timestamp()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = now();
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
      `);
      console.log('✅ update_timestamp function created successfully');
      
      // Create triggers for updated_at timestamp
      await queryRunner.query(`
        DROP TRIGGER IF EXISTS update_leave_schemes_timestamp ON "leave_schemes";
        CREATE TRIGGER update_leave_schemes_timestamp
        BEFORE UPDATE ON "leave_schemes"
        FOR EACH ROW
        EXECUTE FUNCTION update_timestamp();
        
        DROP TRIGGER IF EXISTS update_leave_types_timestamp ON "leave_types";
        CREATE TRIGGER update_leave_types_timestamp
        BEFORE UPDATE ON "leave_types"
        FOR EACH ROW
        EXECUTE FUNCTION update_timestamp();
        
        DROP TRIGGER IF EXISTS update_scheme_leave_types_timestamp ON "scheme_leave_types";
        CREATE TRIGGER update_scheme_leave_types_timestamp
        BEFORE UPDATE ON "scheme_leave_types"
        FOR EACH ROW
        EXECUTE FUNCTION update_timestamp();
        
        DROP TRIGGER IF EXISTS update_employee_leave_schemes_timestamp ON "employee_leave_schemes";
        CREATE TRIGGER update_employee_leave_schemes_timestamp
        BEFORE UPDATE ON "employee_leave_schemes"
        FOR EACH ROW
        EXECUTE FUNCTION update_timestamp();
      `);
      console.log('✅ Timestamp triggers created successfully');
      
      // Create indexes for better performance
      await queryRunner.query(`
        CREATE INDEX IF NOT EXISTS idx_leave_schemes_is_active ON "leave_schemes" (is_active);
        CREATE INDEX IF NOT EXISTS idx_leave_types_is_active ON "leave_types" (is_active);
        CREATE INDEX IF NOT EXISTS idx_scheme_leave_types_scheme_id ON "scheme_leave_types" (scheme_id);
        CREATE INDEX IF NOT EXISTS idx_scheme_leave_types_leave_type_id ON "scheme_leave_types" (leave_type_id);
        CREATE INDEX IF NOT EXISTS idx_employee_leave_schemes_employee_id ON "employee_leave_schemes" (employee_id);
        CREATE INDEX IF NOT EXISTS idx_employee_leave_schemes_scheme_id ON "employee_leave_schemes" (scheme_id);
        CREATE INDEX IF NOT EXISTS idx_employee_leave_schemes_effective_dates ON "employee_leave_schemes" (effective_from, effective_to);
      `);
      console.log('✅ Performance indexes created successfully');
      
      // Add comments to tables and columns
      await queryRunner.query(`
        COMMENT ON TABLE "leave_schemes" IS 'Leave schemes that can be assigned to employees';
        COMMENT ON TABLE "leave_types" IS 'Types of leave available in the system';
        COMMENT ON TABLE "scheme_leave_types" IS 'Junction table linking leave types to schemes with days allowed';
        COMMENT ON TABLE "employee_leave_schemes" IS 'Assignment of leave schemes to employees with effective dates';
        
        COMMENT ON COLUMN "leave_types"."is_paid" IS 'Whether this type of leave is paid or unpaid';
        COMMENT ON COLUMN "scheme_leave_types"."days_allowed" IS 'Number of days allowed for this leave type in this scheme';
        COMMENT ON COLUMN "scheme_leave_types"."is_paid" IS 'Override for whether this leave type is paid in this specific scheme';
      `);
      console.log('✅ Table and column comments added successfully');
      
      console.log('🎉 Leave configuration tables migration completed successfully');
    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      // Drop tables in reverse order to avoid foreign key constraints
      await queryRunner.query(`DROP TABLE IF EXISTS "employee_leave_schemes";`);
      await queryRunner.query(`DROP TABLE IF EXISTS "scheme_leave_types";`);
      await queryRunner.query(`DROP TABLE IF EXISTS "leave_types";`);
      await queryRunner.query(`DROP TABLE IF EXISTS "leave_schemes";`);
      
      // We don't drop the update_timestamp function as it might be used by other tables
      console.log('✅ Leave configuration tables dropped successfully');
    } catch (error) {
      console.error('❌ Rollback failed:', error);
      throw error;
    }
  }
}
