"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeUserRoleToVarchar1756444179000 = void 0;
class ChangeUserRoleToVarchar1756444179000 {
    async up(queryRunner) {
        const checkEnumQuery = `
            SELECT EXISTS (
                SELECT 1 FROM pg_type 
                WHERE typname = 'user_role_enum'
            );
        `;
        const enumExists = (await queryRunner.query(checkEnumQuery))[0].exists;
        if (enumExists) {
            await queryRunner.query(`
                ALTER TABLE users 
                ADD COLUMN role_new VARCHAR(100)
            `);
            await queryRunner.query(`
                UPDATE users 
                SET role_new = role::text
            `);
            await queryRunner.query(`
                ALTER TABLE users 
                DROP COLUMN role
            `);
            await queryRunner.query(`
                ALTER TABLE users 
                RENAME COLUMN role_new TO role
            `);
            await queryRunner.query(`
                ALTER TABLE users 
                ALTER COLUMN role SET NOT NULL
            `);
            await queryRunner.query(`
                DROP TYPE IF EXISTS user_role_enum
            `);
        }
        else {
            await queryRunner.query(`
                ALTER TABLE users 
                ALTER COLUMN role TYPE VARCHAR(100)
            `);
        }
    }
    async down(queryRunner) {
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
                    CREATE TYPE user_role_enum AS ENUM ('Director', 'Admin', 'HR', 'DM', 'TC', 'BA', 'RT', 'AC');
                END IF;
            END
            $$;
        `);
        await queryRunner.query(`
            ALTER TABLE users 
            ADD COLUMN role_enum user_role_enum
        `);
        try {
            await queryRunner.query(`
                UPDATE users 
                SET role_enum = role::user_role_enum
            `);
        }
        catch (error) {
            await queryRunner.query(`
                UPDATE users 
                SET role_enum = 'BA'::user_role_enum
                WHERE role_enum IS NULL
            `);
        }
        await queryRunner.query(`
            ALTER TABLE users 
            DROP COLUMN role
        `);
        await queryRunner.query(`
            ALTER TABLE users 
            RENAME COLUMN role_enum TO role
        `);
        await queryRunner.query(`
            ALTER TABLE users 
            ALTER COLUMN role SET NOT NULL
        `);
    }
}
exports.ChangeUserRoleToVarchar1756444179000 = ChangeUserRoleToVarchar1756444179000;
//# sourceMappingURL=1756444179000-ChangeUserRoleToVarchar.js.map