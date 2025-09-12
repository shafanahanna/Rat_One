"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserTable1692594867123 = void 0;
class CreateUserTable1692594867123 {
    constructor() {
        this.name = 'CreateUserTable1692594867123';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TYPE "user_role_enum" AS ENUM (
                'Director', 'HR', 'DM', 'TC', 'BA', 'RT', 'AC'
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                "username" VARCHAR(100) NOT NULL,
                "email" VARCHAR(255) NOT NULL UNIQUE,
                "password_hash" VARCHAR(255) NOT NULL,
                "role" "user_role_enum" NOT NULL DEFAULT 'BA',
                "employee_id" VARCHAR(255),
                "country_id" UUID,
                "branch_id" UUID,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);
        await queryRunner.query(`
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "user_role_enum"`);
    }
}
exports.CreateUserTable1692594867123 = CreateUserTable1692594867123;
//# sourceMappingURL=1692594867123-CreateUserTable.js.map