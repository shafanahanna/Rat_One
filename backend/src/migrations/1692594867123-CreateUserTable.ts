import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1692594867123 implements MigrationInterface {
    name = 'CreateUserTable1692594867123'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create enum type for user roles
        await queryRunner.query(`
            CREATE TYPE "user_role_enum" AS ENUM (
                'Director', 'HR', 'DM', 'TC', 'BA', 'RT', 'AC'
            )
        `);

        // Create users table
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

        // Create extension if not exists
        await queryRunner.query(`
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "user_role_enum"`);
    }
}
