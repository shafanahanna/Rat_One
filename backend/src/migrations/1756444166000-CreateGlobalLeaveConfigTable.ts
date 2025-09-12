import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGlobalLeaveConfigTable1756444166000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public.global_leave_config (
        id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
        key character varying(100) NOT NULL,
        value jsonb NOT NULL,
        description text,
        created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
        CONSTRAINT "PK_global_leave_config" PRIMARY KEY (id),
        CONSTRAINT "UQ_global_leave_config_key" UNIQUE (key)
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS public.global_leave_config;`);
  }
}
