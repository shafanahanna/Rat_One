import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameBackToRole1758181872000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if temp_role column exists
        const tableColumns = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'temp_role'
        `);
        
        // If temp_role exists, rename it to role
        if (tableColumns && tableColumns.length > 0) {
            await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "temp_role" TO "role"`);
            console.log('Successfully renamed temp_role to role');
        } else {
            // If temp_role doesn't exist but role doesn't exist either, create role column
            const roleColumn = await queryRunner.query(`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'users' AND column_name = 'role'
            `);
            
            if (!roleColumn || roleColumn.length === 0) {
                await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "role" VARCHAR(100)`);
                console.log('Created new role column as temp_role was not found');
            } else {
                console.log('Role column already exists, no action needed');
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Check if role column exists
        const tableColumns = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'role'
        `);
        
        // If role exists, rename it back to temp_role
        if (tableColumns && tableColumns.length > 0) {
            await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "role" TO "temp_role"`);
        }
    }
}
