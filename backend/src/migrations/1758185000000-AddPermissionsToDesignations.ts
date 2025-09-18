import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPermissionsToDesignations1758185000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if designations table exists
        const tableExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'designations'
            )
        `);
        
        if (tableExists[0].exists) {
            // Check if permissions column already exists
            const columnExists = await queryRunner.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.columns 
                    WHERE table_name = 'designations' AND column_name = 'permissions'
                )
            `);
            
            if (!columnExists[0].exists) {
                // Add permissions column to designations table
                await queryRunner.query(`
                    ALTER TABLE "designations" 
                    ADD COLUMN "permissions" text
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
            // Check if permissions column exists
            const columnExists = await queryRunner.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.columns 
                    WHERE table_name = 'designations' AND column_name = 'permissions'
                )
            `);
            
            if (columnExists[0].exists) {
                // Drop the permissions column
                await queryRunner.query(`
                    ALTER TABLE "designations" 
                    DROP COLUMN IF EXISTS "permissions"
                `);
            }
        }
    }
}
