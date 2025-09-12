import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateLeaveSchemesTable1756444171000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
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
      }),
      true,
    );

    // Add foreign key for created_by referencing users table
    await queryRunner.createForeignKey(
      'leave_schemes',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'RESTRICT',
      }),
    );

    // Add foreign key for updated_by referencing users table
    await queryRunner.createForeignKey(
      'leave_schemes',
      new TableForeignKey({
        columnNames: ['updated_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'RESTRICT',
      }),
    );

    // Add trigger for updated_at timestamp
    await queryRunner.query(`
      CREATE TRIGGER update_leave_schemes_updated_at
      BEFORE UPDATE ON leave_schemes
      FOR EACH ROW
      EXECUTE FUNCTION update_timestamp();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys first
    const table = await queryRunner.getTable('leave_schemes');
    const foreignKeys = table.foreignKeys;
    
    for (const foreignKey of foreignKeys) {
      await queryRunner.dropForeignKey('leave_schemes', foreignKey);
    }
    
    // Drop trigger
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_leave_schemes_updated_at ON leave_schemes;`);
    
    // Drop table
    await queryRunner.dropTable('leave_schemes');
  }
}
