"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSchemeLeaveTypesForeignKeys1756444172000 = void 0;
class UpdateSchemeLeaveTypesForeignKeys1756444172000 {
    async up(queryRunner) {
        try {
            console.log('Checking if scheme_leave_types table exists...');
            const tableExists = await queryRunner.hasTable('scheme_leave_types');
            if (!tableExists) {
                console.log(' Table scheme_leave_types does not exist yet. Skipping this migration.');
                return;
            }
            console.log(' Table exists. Updating scheme_leave_types foreign key constraints...');
            await queryRunner.query(`
        ALTER TABLE "scheme_leave_types" 
        DROP CONSTRAINT IF EXISTS "scheme_leave_types_created_by_fkey",
        DROP CONSTRAINT IF EXISTS "scheme_leave_types_updated_by_fkey"
      `);
            console.log(' Dropped existing constraints');
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
            await queryRunner.query(`
        ALTER TABLE "scheme_leave_types" 
        ALTER COLUMN "created_by" DROP NOT NULL,
        ALTER COLUMN "updated_by" DROP NOT NULL
      `);
            console.log(' Modified columns to allow NULL values');
            console.log(' Migration completed successfully');
        }
        catch (error) {
            console.error(' Migration failed:', error);
            throw error;
        }
    }
    async down(queryRunner) {
        try {
            const tableExists = await queryRunner.hasTable('scheme_leave_types');
            if (!tableExists) {
                console.log(' Table scheme_leave_types does not exist. Skipping rollback.');
                return;
            }
            await queryRunner.query(`
        ALTER TABLE "scheme_leave_types" 
        DROP CONSTRAINT IF EXISTS "scheme_leave_types_created_by_fkey",
        DROP CONSTRAINT IF EXISTS "scheme_leave_types_updated_by_fkey"
      `);
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
        }
        catch (error) {
            console.error(' Rollback failed:', error);
            throw error;
        }
    }
}
exports.UpdateSchemeLeaveTypesForeignKeys1756444172000 = UpdateSchemeLeaveTypesForeignKeys1756444172000;
//# sourceMappingURL=1756444172000-UpdateSchemeLeaveTypesForeignKeys.js.map