import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyUserRoleColumn1756444177000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // First, drop the enum constraint
        await queryRunner.query(`
            ALTER TABLE users 
            ALTER COLUMN role TYPE VARCHAR(100)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Create the enum type if it doesn't exist
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'userrole') THEN
                    CREATE TYPE "userrole" AS ENUM ('Director', 'HR', 'DM', 'TC', 'BA', 'RT', 'AC');
                END IF;
            END
            $$;
        `);
        
        // Convert back to enum type
        await queryRunner.query(`
            ALTER TABLE users 
            ALTER COLUMN role TYPE "userrole" USING role::"userrole"
        `);
    }
}
