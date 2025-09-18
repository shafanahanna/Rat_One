import { MigrationInterface, QueryRunner } from "typeorm";

export class CopyPermissionsFromRolesToDesignations1758185200000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if both tables exist
        const tablesExist = await queryRunner.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'custom_roles'
            ) AS roles_exist,
            EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'designations'
            ) AS designations_exist
        `);
        
        if (!tablesExist[0].roles_exist || !tablesExist[0].designations_exist) {
            console.log('One or both tables do not exist, skipping migration');
            return;
        }
        
        // Get all roles with permissions
        const roles = await queryRunner.query(`
            SELECT id, name, permissions
            FROM custom_roles
            WHERE permissions IS NOT NULL
        `);
        
        // Get all designations
        const designations = await queryRunner.query(`
            SELECT id, name
            FROM designations
        `);
        
        // For each designation, try to find a matching role by name
        for (const designation of designations) {
            const matchingRole = roles.find(role => 
                role.name.toLowerCase() === designation.name.toLowerCase()
            );
            
            if (matchingRole && matchingRole.permissions) {
                console.log(`Copying permissions from role "${matchingRole.name}" to designation "${designation.name}"`);
                
                // Update the designation with the role's permissions
                await queryRunner.query(`
                    UPDATE designations
                    SET permissions = $1
                    WHERE id = $2
                `, [matchingRole.permissions, designation.id]);
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // This migration is not reversible in a clean way
        // We could clear all permissions from designations, but that might not be desired
        console.log('This migration cannot be reversed automatically');
    }
}
