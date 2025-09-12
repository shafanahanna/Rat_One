import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateLeadTable1756444167000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
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
      }),
      true,
    );

    // Add foreign key for assigned_to_id referencing users table
    await queryRunner.createForeignKey(
      'leads',
      new TableForeignKey({
        columnNames: ['assigned_to_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    // Add foreign key for created_by referencing users table
    await queryRunner.createForeignKey(
      'leads',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    // Add foreign key for previous_lead_id referencing leads table (self-reference)
    await queryRunner.createForeignKey(
      'leads',
      new TableForeignKey({
        columnNames: ['previous_lead_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'leads',
        onDelete: 'SET NULL',
      }),
    );

    // Add trigger for updated_at timestamp
    await queryRunner.query(`
      CREATE TRIGGER update_leads_updated_at
      BEFORE UPDATE ON leads
      FOR EACH ROW
      EXECUTE FUNCTION update_timestamp();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys first
    const table = await queryRunner.getTable('leads');
    const foreignKeys = table.foreignKeys;
    
    for (const foreignKey of foreignKeys) {
      await queryRunner.dropForeignKey('leads', foreignKey);
    }
    
    // Drop trigger
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;`);
    
    // Drop table
    await queryRunner.dropTable('leads');
  }
}
