import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserFieldsToLeaveTypes1756444174000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add created_by and updated_by columns to leave_types table
    await queryRunner.query(`
      ALTER TABLE leave_types
      ADD COLUMN created_by UUID NULL REFERENCES users(id),
      ADD COLUMN updated_by UUID NULL REFERENCES users(id)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove created_by and updated_by columns from leave_types table
    await queryRunner.query(`
      ALTER TABLE leave_types
      DROP COLUMN IF EXISTS created_by,
      DROP COLUMN IF EXISTS updated_by
    `);
  }
}
