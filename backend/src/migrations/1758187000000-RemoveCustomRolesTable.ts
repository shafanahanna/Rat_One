import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveCustomRolesTable1758187000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if custom_roles table exists
        const tableExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'custom_roles'
            )
        `);
        
        if (!tableExists[0].exists) {
            console.log('custom_roles table does not exist, skipping migration');
            return;
        }
        
        // Check if there are any references to custom_roles table
        const references = await queryRunner.query(`
            SELECT tc.table_name, kcu.column_name
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu
              ON tc.constraint_name = kcu.constraint_name
            JOIN information_schema.constraint_column_usage ccu
              ON ccu.constraint_name = tc.constraint_name
            WHERE tc.constraint_type = 'FOREIGN KEY'
              AND ccu.table_name = 'custom_roles'
        `);
        
        if (references.length > 0) {
            console.log('Found references to custom_roles table, cannot drop:');
            for (const ref of references) {
                console.log(`Table ${ref.table_name} has a foreign key on column ${ref.column_name}`);
            }
            console.log('Please remove these references before dropping the custom_roles table');
            return;
        }
        
        // Drop the custom_roles table
        console.log('Dropping custom_roles table');
        await queryRunner.query(`DROP TABLE IF EXISTS custom_roles`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Check if custom_roles table exists
        const tableExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'custom_roles'
            )
        `);
        
        if (tableExists[0].exists) {
            console.log('custom_roles table already exists, skipping recreation');
            return;
        }
        
        // Recreate the custom_roles table
        await queryRunner.query(`
            CREATE TABLE custom_roles (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name VARCHAR(255) UNIQUE NOT NULL,
                description TEXT,
                permissions TEXT[],
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `);
        
        console.log('Recreated custom_roles table');
    }
}
