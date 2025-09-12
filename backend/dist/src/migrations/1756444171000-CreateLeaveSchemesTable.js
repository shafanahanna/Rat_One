"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateLeaveSchemesTable1756444171000 = void 0;
const typeorm_1 = require("typeorm");
class CreateLeaveSchemesTable1756444171000 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'leave_schemes',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'name',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'is_active',
                    type: 'boolean',
                    isNullable: false,
                    default: true,
                },
                {
                    name: 'created_by',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'updated_by',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                    onUpdate: 'CURRENT_TIMESTAMP',
                },
            ],
        }), true);
        await queryRunner.createForeignKey('leave_schemes', new typeorm_1.TableForeignKey({
            columnNames: ['created_by'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'RESTRICT',
        }));
        await queryRunner.createForeignKey('leave_schemes', new typeorm_1.TableForeignKey({
            columnNames: ['updated_by'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'RESTRICT',
        }));
        await queryRunner.query(`
      CREATE TRIGGER update_leave_schemes_updated_at
      BEFORE UPDATE ON leave_schemes
      FOR EACH ROW
      EXECUTE FUNCTION update_timestamp();
    `);
    }
    async down(queryRunner) {
        const table = await queryRunner.getTable('leave_schemes');
        const foreignKeys = table.foreignKeys;
        for (const foreignKey of foreignKeys) {
            await queryRunner.dropForeignKey('leave_schemes', foreignKey);
        }
        await queryRunner.query(`DROP TRIGGER IF EXISTS update_leave_schemes_updated_at ON leave_schemes;`);
        await queryRunner.dropTable('leave_schemes');
    }
}
exports.CreateLeaveSchemesTable1756444171000 = CreateLeaveSchemesTable1756444171000;
//# sourceMappingURL=1756444171000-CreateLeaveSchemesTable.js.map