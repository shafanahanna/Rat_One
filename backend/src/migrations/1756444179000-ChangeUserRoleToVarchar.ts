import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeUserRoleToVarchar1756444179000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // First, check if the enum type exists
        const checkEnumQuery = `
            SELECT EXISTS (
                SELECT 1 FROM pg_type 
                WHERE typname = 'user_role_enum'
            );
        `;
        const enumExists = (await queryRunner.query(checkEnumQuery))[0].exists;

        if (enumExists) {
            // Create a temporary column with varchar type
            await queryRunner.query(`
                ALTER TABLE users 
                ADD COLUMN role_new VARCHAR(100)
            `);

            // Copy data from the enum column to the varchar column
            await queryRunner.query(`
                UPDATE users 
                SET role_new = role::text
            `);

            // Drop the old column
            await queryRunner.query(`
                ALTER TABLE users 
                DROP COLUMN role
            `);

            // Rename the new column to the original name
            await queryRunner.query(`
                ALTER TABLE users 
                RENAME COLUMN role_new TO role
            `);

            // Set not null constraint if needed
            await queryRunner.query(`
                ALTER TABLE users 
                ALTER COLUMN role SET NOT NULL
            `);

            // Drop the enum type if it's no longer used
            await queryRunner.query(`
                DROP TYPE IF EXISTS user_role_enum
            `);
        } else {
            // If the enum doesn't exist, just alter the column type directly
            await queryRunner.query(`
                ALTER TABLE users 
                ALTER COLUMN role TYPE VARCHAR(100)
            `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Create the enum type if it doesn't exist
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
                    CREATE TYPE user_role_enum AS ENUM ('Director', 'Admin', 'HR', 'DM', 'TC', 'BA', 'RT', 'AC');
                END IF;
            END
            $$;
        `);

        // Create a temporary column with enum type
        await queryRunner.query(`
            ALTER TABLE users 
            ADD COLUMN role_enum user_role_enum
        `);

        // Try to convert existing values to enum
        // This might fail if there are values that don't match the enum
        try {
            await queryRunner.query(`
                UPDATE users 
                SET role_enum = role::user_role_enum
            `);
        } catch (error) {
            // If conversion fails, set a default value
            await queryRunner.query(`
                UPDATE users 
                SET role_enum = 'BA'::user_role_enum
                WHERE role_enum IS NULL
            `);
        }

        // Drop the varchar column
        await queryRunner.query(`
            ALTER TABLE users 
            DROP COLUMN role
        `);

        // Rename the enum column to the original name
        await queryRunner.query(`
            ALTER TABLE users 
            RENAME COLUMN role_enum TO role
        `);

        // Set not null constraint
        await queryRunner.query(`
            ALTER TABLE users 
            ALTER COLUMN role SET NOT NULL
        `);
    }
}
