"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModifyUserRoleColumn1756444177000 = void 0;
class ModifyUserRoleColumn1756444177000 {
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE users 
            ALTER COLUMN role TYPE VARCHAR(100)
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'userrole') THEN
                    CREATE TYPE "userrole" AS ENUM ('Director', 'HR', 'DM', 'TC', 'BA', 'RT', 'AC');
                END IF;
            END
            $$;
        `);
        await queryRunner.query(`
            ALTER TABLE users 
            ALTER COLUMN role TYPE "userrole" USING role::"userrole"
        `);
    }
}
exports.ModifyUserRoleColumn1756444177000 = ModifyUserRoleColumn1756444177000;
//# sourceMappingURL=1756444177000-ModifyUserRoleColumn.js.map