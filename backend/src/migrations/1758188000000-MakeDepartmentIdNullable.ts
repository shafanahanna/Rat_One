import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeDepartmentIdNullable1758188000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if designations table exists
        const tableExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'designations'
            )
        `);
        
        if (!tableExists[0].exists) {
            console.log('designations table does not exist, skipping migration');
            return;
        }
        
        // Check if department_id column exists in designations table
        const columnExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.columns 
                WHERE table_name = 'designations' AND column_name = 'department_id'
            )
        `);
        
        if (!columnExists[0].exists) {
            console.log('department_id column does not exist in designations table, skipping migration');
            return;
        }
        
        // Check if department_id column already allows NULL values
        const columnInfo = await queryRunner.query(`
            SELECT is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'designations' AND column_name = 'department_id'
        `);
        
        if (columnInfo[0].is_nullable === 'YES') {
            console.log('department_id column already allows NULL values, skipping migration');
            return;
        }
        
        // Alter the column to allow NULL values
        await queryRunner.query(`
            ALTER TABLE designations 
            ALTER COLUMN department_id DROP NOT NULL
        `);
        
        console.log('Successfully made department_id column nullable in designations table');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Check if designations table exists
        const tableExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'designations'
            )
        `);
        
        if (!tableExists[0].exists) {
            console.log('designations table does not exist, skipping migration rollback');
            return;
        }
        
        // Check if department_id column exists in designations table
        const columnExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.columns 
                WHERE table_name = 'designations' AND column_name = 'department_id'
            )
        `);
        
        if (!columnExists[0].exists) {
            console.log('department_id column does not exist in designations table, skipping migration rollback');
            return;
        }
        
        // Update any NULL values to a default value before making the column NOT NULL
        await queryRunner.query(`
            UPDATE designations
            SET department_id = (SELECT id FROM departments LIMIT 1)
            WHERE department_id IS NULL
        `);
        
        // Alter the column to NOT NULL
        await queryRunner.query(`
            ALTER TABLE designations 
            ALTER COLUMN department_id SET NOT NULL
        `);
        
        console.log('Successfully made department_id column NOT NULL in designations table');
    }
}
