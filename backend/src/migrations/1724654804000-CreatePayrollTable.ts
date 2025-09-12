import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePayrollTable1724654804000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public.payroll (
        id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
        employee_id uuid NOT NULL,
        month integer NOT NULL,
        year integer NOT NULL,
        basic_salary numeric NOT NULL,
        allowances numeric DEFAULT 0 NOT NULL,
        deductions numeric DEFAULT 0 NOT NULL,
        unpaid_days numeric DEFAULT 0 NOT NULL,
        net_salary numeric NOT NULL,
        payment_date date,
        payment_status character varying(50) DEFAULT 'Pending'::character varying NOT NULL,
        notes text,
        created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
        CONSTRAINT pk_payroll PRIMARY KEY (id),
        CONSTRAINT fk_payroll_employee FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE
      );
      
      -- Add trigger for automatic updated_at timestamp
      CREATE TRIGGER set_timestamp
      BEFORE UPDATE ON public.payroll
      FOR EACH ROW
      EXECUTE FUNCTION update_timestamp();
      
      -- Create index on employee_id for faster joins
      CREATE INDEX idx_payroll_employee_id ON public.payroll(employee_id);
      
      -- Create index on month and year for faster filtering
      CREATE INDEX idx_payroll_month_year ON public.payroll(month, year);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS set_timestamp ON public.payroll;
      DROP INDEX IF EXISTS idx_payroll_month_year;
      DROP INDEX IF EXISTS idx_payroll_employee_id;
      DROP TABLE IF EXISTS public.payroll;
    `);
  }
}
