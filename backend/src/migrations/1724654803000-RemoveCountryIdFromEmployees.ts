import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveCountryIdFromEmployees1724654803000 implements MigrationInterface {
    name = 'RemoveCountryIdFromEmployees1724654803000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if the column exists before trying to drop it
        const tableExists = await queryRunner.hasTable('employees');
        if (tableExists) {
            const columnExists = await queryRunner.hasColumn('employees', 'country_id');
            if (columnExists) {
                await queryRunner.query(`
                    ALTER TABLE "employees" DROP COLUMN IF EXISTS "country_id"
                `);
                console.log('Dropped country_id column from employees table');
            } else {
                console.log('country_id column does not exist in employees table');
            }
        } else {
            console.log('employees table does not exist');
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Add the column back if needed
        const tableExists = await queryRunner.hasTable('employees');
        if (tableExists) {
            const columnExists = await queryRunner.hasColumn('employees', 'country_id');
            if (!columnExists) {
                await queryRunner.query(`
                    ALTER TABLE "employees" ADD COLUMN "country_id" uuid
                `);
            }
        }
    }
}
