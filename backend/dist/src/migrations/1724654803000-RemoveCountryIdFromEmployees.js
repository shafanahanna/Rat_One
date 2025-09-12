"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveCountryIdFromEmployees1724654803000 = void 0;
class RemoveCountryIdFromEmployees1724654803000 {
    constructor() {
        this.name = 'RemoveCountryIdFromEmployees1724654803000';
    }
    async up(queryRunner) {
        const tableExists = await queryRunner.hasTable('employees');
        if (tableExists) {
            const columnExists = await queryRunner.hasColumn('employees', 'country_id');
            if (columnExists) {
                await queryRunner.query(`
                    ALTER TABLE "employees" DROP COLUMN IF EXISTS "country_id"
                `);
                console.log('Dropped country_id column from employees table');
            }
            else {
                console.log('country_id column does not exist in employees table');
            }
        }
        else {
            console.log('employees table does not exist');
        }
    }
    async down(queryRunner) {
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
exports.RemoveCountryIdFromEmployees1724654803000 = RemoveCountryIdFromEmployees1724654803000;
//# sourceMappingURL=1724654803000-RemoveCountryIdFromEmployees.js.map