import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCustomRolesTable1756444176000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "custom_roles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "description" character varying,
        "permissions" text NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_custom_roles_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_custom_roles_name" UNIQUE ("name")
      )
    `);
    
    // Add trigger for updated_at timestamp
    await queryRunner.query(`
      CREATE TRIGGER set_timestamp
      BEFORE UPDATE ON "custom_roles"
      FOR EACH ROW
      EXECUTE FUNCTION update_timestamp();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "custom_roles"`);
  }
}
