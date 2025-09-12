import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEmployeesTable1724481633000 implements MigrationInterface {
    name = 'CreateEmployeesTable1724481633000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create extension if not exists
        await queryRunner.query(`
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
        `);

        // Create employees table
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS public.employees (
                id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
                user_id uuid,
                full_name character varying(255) NOT NULL,
                department character varying(100),
                designation character varying(100),
                date_of_joining date,
                salary numeric(10,2),
                proposed_salary numeric(10,2),
                salary_status character varying(50) DEFAULT 'Approved'::character varying,
                created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
                updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
                emp_code character varying(20),
                
                branch_id uuid,
                profile_picture character varying(255),
                CONSTRAINT pk_employees PRIMARY KEY (id)
            )
        `);

        // Add foreign key constraints if they don't exist
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_constraint WHERE conname = 'fk_employees_user'
                ) THEN
                    ALTER TABLE public.employees
                    ADD CONSTRAINT fk_employees_user
                    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;
                END IF;
                
                IF NOT EXISTS (
                    SELECT 1 FROM pg_constraint WHERE conname = 'fk_employees_branch'
                ) THEN
                    ALTER TABLE public.employees
                    ADD CONSTRAINT fk_employees_branch
                    FOREIGN KEY (branch_id) REFERENCES public.branches(id) ON DELETE SET NULL;
                END IF;
            END
            $$;
        `);

        // Add trigger for updated_at timestamp on employees
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_trigger WHERE tgname = 'update_employees_timestamp'
                ) THEN
                    CREATE TRIGGER update_employees_timestamp
                    BEFORE UPDATE ON "employees"
                    FOR EACH ROW
                    EXECUTE FUNCTION update_timestamp();
                END IF;
            END
            $$;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop trigger first
        await queryRunner.query(`DROP TRIGGER IF EXISTS update_employees_timestamp ON "employees"`);
        
        // Drop table
        await queryRunner.query(`DROP TABLE IF EXISTS "employees"`);
    }
}
