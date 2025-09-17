import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDesignationsWithDepartment1758182015000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if designations table exists
        const tableExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'designations'
            )
        `);
        
        if (!tableExists[0].exists) {
            // Create designations table if it doesn't exist
            await queryRunner.query(`
                CREATE TABLE IF NOT EXISTS "designations" (
                    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    "name" VARCHAR(100) NOT NULL UNIQUE,
                    "description" TEXT,
                    "department_id" UUID,
                    "level" INTEGER,
                    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    CONSTRAINT "fk_designation_department" FOREIGN KEY ("department_id") 
                        REFERENCES "departments" ("id") ON DELETE SET NULL
                )
            `);

            // Create trigger to update updated_at timestamp
            await queryRunner.query(`
                CREATE TRIGGER update_designations_timestamp
                BEFORE UPDATE ON designations
                FOR EACH ROW
                EXECUTE FUNCTION update_timestamp();
            `);
        } else {
            // Check if department_id column already exists
            const columnExists = await queryRunner.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.columns 
                    WHERE table_name = 'designations' AND column_name = 'department_id'
                )
            `);
            
            if (!columnExists[0].exists) {
                // Add department_id column to existing designations table
                await queryRunner.query(`
                    ALTER TABLE "designations" 
                    ADD COLUMN "department_id" UUID,
                    ADD CONSTRAINT "fk_designation_department" 
                        FOREIGN KEY ("department_id") REFERENCES "departments" ("id") ON DELETE SET NULL
                `);
            }
            
            // Check if level column already exists
            const levelColumnExists = await queryRunner.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.columns 
                    WHERE table_name = 'designations' AND column_name = 'level'
                )
            `);
            
            if (!levelColumnExists[0].exists) {
                // Add level column to existing designations table
                await queryRunner.query(`
                    ALTER TABLE "designations" 
                    ADD COLUMN "level" INTEGER
                `);
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Check if designations table exists
        const tableExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'designations'
            )
        `);
        
        if (tableExists[0].exists) {
            // Check if department_id column exists
            const columnExists = await queryRunner.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.columns 
                    WHERE table_name = 'designations' AND column_name = 'department_id'
                )
            `);
            
            if (columnExists[0].exists) {
                // Drop the foreign key constraint first
                await queryRunner.query(`
                    ALTER TABLE "designations" 
                    DROP CONSTRAINT IF EXISTS "fk_designation_department"
                `);
                
                // Drop the department_id column
                await queryRunner.query(`
                    ALTER TABLE "designations" 
                    DROP COLUMN IF EXISTS "department_id"
                `);
            }
            
            // Check if level column exists
            const levelColumnExists = await queryRunner.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.columns 
                    WHERE table_name = 'designations' AND column_name = 'level'
                )
            `);
            
            if (levelColumnExists[0].exists) {
                // Drop the level column
                await queryRunner.query(`
                    ALTER TABLE "designations" 
                    DROP COLUMN IF EXISTS "level"
                `);
            }
        }
    }
}
