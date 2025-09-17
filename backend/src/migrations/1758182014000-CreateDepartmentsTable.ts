import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDepartmentsTable1758182014000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create departments table
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "departments" (
                "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                "name" VARCHAR(100) NOT NULL UNIQUE,
                "description" TEXT,
                "parent_id" UUID,
                "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "fk_department_parent" FOREIGN KEY ("parent_id") 
                    REFERENCES "departments" ("id") ON DELETE SET NULL
            )
        `);

        // Create trigger to update updated_at timestamp
        await queryRunner.query(`
            CREATE TRIGGER update_departments_timestamp
            BEFORE UPDATE ON departments
            FOR EACH ROW
            EXECUTE FUNCTION update_timestamp();
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the trigger first
        await queryRunner.query(`DROP TRIGGER IF EXISTS update_departments_timestamp ON departments`);
        
        // Drop the table
        await queryRunner.query(`DROP TABLE IF EXISTS "departments"`);
    }
}
