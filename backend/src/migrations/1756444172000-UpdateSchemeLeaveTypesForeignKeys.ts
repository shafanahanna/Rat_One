import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration to update scheme_leave_types foreign key constraints
 * Date: 2025-08-31
 */
export class UpdateSchemeLeaveTypesForeignKeys1756444172000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      console.log('Checking if scheme_leave_types table exists...');
      
      // Check if the table exists first
      const tableExists = await queryRunner.hasTable('scheme_leave_types');
      if (!tableExists) {
        console.log(' Table scheme_leave_types does not exist yet. Skipping this migration.');
        return;
      }
      
      console.log(' Table exists. Updating scheme_leave_types foreign key constraints...');
      
      // Drop existing constraints
      await queryRunner.query(`
        ALTER TABLE "scheme_leave_types" 
        DROP CONSTRAINT IF EXISTS "scheme_leave_types_created_by_fkey",
        DROP CONSTRAINT IF EXISTS "scheme_leave_types_updated_by_fkey"
      `);
      console.log(' Dropped existing constraints');
      
      // Add new constraints with ON DELETE SET NULL
      await queryRunner.query(`
        ALTER TABLE "scheme_leave_types" 
        ADD CONSTRAINT "scheme_leave_types_created_by_fkey" 
        FOREIGN KEY ("created_by") 
        REFERENCES "users" ("id") 
        ON DELETE SET NULL,
        
        ADD CONSTRAINT "scheme_leave_types_updated_by_fkey" 
        FOREIGN KEY ("updated_by") 
        REFERENCES "users" ("id") 
        ON DELETE SET NULL
      `);
      console.log(' Added new constraints with ON DELETE SET NULL');
      
      // Modify columns to allow NULL values if not already
      await queryRunner.query(`
        ALTER TABLE "scheme_leave_types" 
        ALTER COLUMN "created_by" DROP NOT NULL,
        ALTER COLUMN "updated_by" DROP NOT NULL
      `);
      console.log(' Modified columns to allow NULL values');
      
      console.log(' Migration completed successfully');
    } catch (error) {
      console.error(' Migration failed:', error);
      throw error;
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      // Check if the table exists first
      const tableExists = await queryRunner.hasTable('scheme_leave_types');
      if (!tableExists) {
        console.log(' Table scheme_leave_types does not exist. Skipping rollback.');
        return;
      }
      
      // Drop the new constraints
      await queryRunner.query(`
        ALTER TABLE "scheme_leave_types" 
        DROP CONSTRAINT IF EXISTS "scheme_leave_types_created_by_fkey",
        DROP CONSTRAINT IF EXISTS "scheme_leave_types_updated_by_fkey"
      `);
      
      // Add back the original constraints (assuming they were NOT NULL and RESTRICT)
      await queryRunner.query(`
        ALTER TABLE "scheme_leave_types" 
        ALTER COLUMN "created_by" SET NOT NULL,
        ALTER COLUMN "updated_by" SET NOT NULL,
        
        ADD CONSTRAINT "scheme_leave_types_created_by_fkey" 
        FOREIGN KEY ("created_by") 
        REFERENCES "users" ("id") 
        ON DELETE RESTRICT,
        
        ADD CONSTRAINT "scheme_leave_types_updated_by_fkey" 
        FOREIGN KEY ("updated_by") 
        REFERENCES "users" ("id") 
        ON DELETE RESTRICT
      `);
    } catch (error) {
      console.error(' Rollback failed:', error);
      throw error;
    }
  }
}