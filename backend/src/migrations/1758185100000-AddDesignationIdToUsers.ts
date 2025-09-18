import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDesignationIdToUsers1758185100000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if users table exists
        const tableExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'users'
            )
        `);
        
        if (tableExists[0].exists) {
            // Check if designation_id column already exists
            const columnExists = await queryRunner.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.columns 
                    WHERE table_name = 'users' AND column_name = 'designation_id'
                )
            `);
            
            if (!columnExists[0].exists) {
                // Add designation_id column to users table
                await queryRunner.query(`
                    ALTER TABLE "users" 
                    ADD COLUMN "designation_id" UUID,
                    ADD CONSTRAINT "fk_user_designation" 
                        FOREIGN KEY ("designation_id") REFERENCES "designations" ("id") ON DELETE SET NULL
                `);
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Check if users table exists
        const tableExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'users'
            )
        `);
        
        if (tableExists[0].exists) {
            // Check if designation_id column exists
            const columnExists = await queryRunner.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.columns 
                    WHERE table_name = 'users' AND column_name = 'designation_id'
                )
            `);
            
            if (columnExists[0].exists) {
                // Drop the foreign key constraint first
                await queryRunner.query(`
                    ALTER TABLE "users" 
                    DROP CONSTRAINT IF EXISTS "fk_user_designation"
                `);
                
                // Drop the designation_id column
                await queryRunner.query(`
                    ALTER TABLE "users" 
                    DROP COLUMN IF EXISTS "designation_id"
                `);
            }
        }
    }
}
