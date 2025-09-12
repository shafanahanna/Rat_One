"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateLeadTable1756444167000 = void 0;
const typeorm_1 = require("typeorm");
class CreateLeadTable1756444167000 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'leads',
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
                    name: 'email',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'phone',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'destination',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'travel_date',
                    type: 'date',
                    isNullable: true,
                },
                {
                    name: 'status',
                    type: 'varchar',
                    isNullable: false,
                    default: "'new'",
                },
                {
                    name: 'source',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'notes',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'assigned_to_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'adult',
                    type: 'integer',
                    isNullable: true,
                    default: 1,
                },
                {
                    name: 'child',
                    type: 'integer',
                    isNullable: true,
                    default: 0,
                },
                {
                    name: 'lead_ui_id',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'reference_id',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'assignment_reason',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'branch',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'created_by',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'campaign_id',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'is_re_enquiry',
                    type: 'boolean',
                    isNullable: false,
                    default: false,
                },
                {
                    name: 'previous_lead_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'category',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'trip_duration',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'budget',
                    type: 'decimal',
                    precision: 10,
                    scale: 2,
                    isNullable: true,
                },
                {
                    name: 'budget_currency',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'accommodation_type',
                    type: 'varchar',
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
        await queryRunner.createForeignKey('leads', new typeorm_1.TableForeignKey({
            columnNames: ['assigned_to_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createForeignKey('leads', new typeorm_1.TableForeignKey({
            columnNames: ['created_by'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createForeignKey('leads', new typeorm_1.TableForeignKey({
            columnNames: ['previous_lead_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'leads',
            onDelete: 'SET NULL',
        }));
        await queryRunner.query(`
      CREATE TRIGGER update_leads_updated_at
      BEFORE UPDATE ON leads
      FOR EACH ROW
      EXECUTE FUNCTION update_timestamp();
    `);
    }
    async down(queryRunner) {
        const table = await queryRunner.getTable('leads');
        const foreignKeys = table.foreignKeys;
        for (const foreignKey of foreignKeys) {
            await queryRunner.dropForeignKey('leads', foreignKey);
        }
        await queryRunner.query(`DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;`);
        await queryRunner.dropTable('leads');
    }
}
exports.CreateLeadTable1756444167000 = CreateLeadTable1756444167000;
//# sourceMappingURL=1756444167000-CreateLeadTable.js.map