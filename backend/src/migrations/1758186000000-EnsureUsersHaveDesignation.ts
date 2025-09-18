import { MigrationInterface, QueryRunner } from "typeorm";

export class EnsureUsersHaveDesignation1758186000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if both tables exist
        const tablesExist = await queryRunner.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'users'
            ) AS users_exist,
            EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'designations'
            ) AS designations_exist
        `);
        
        if (!tablesExist[0].users_exist || !tablesExist[0].designations_exist) {
            console.log('One or both tables do not exist, skipping migration');
            return;
        }
        
        // Check if designation_id column exists in users table
        const columnExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.columns 
                WHERE table_name = 'users' AND column_name = 'designation_id'
            )
        `);
        
        if (!columnExists[0].exists) {
            console.log('designation_id column does not exist in users table, skipping migration');
            return;
        }
        
        // Get all users without a designation
        const usersWithoutDesignation = await queryRunner.query(`
            SELECT u.id, u.role, u.username
            FROM users u
            WHERE u.designation_id IS NULL
        `);
        
        console.log(`Found ${usersWithoutDesignation.length} users without a designation`);
        
        if (usersWithoutDesignation.length === 0) {
            console.log('No users without a designation, skipping migration');
            return;
        }
        
        // Get all designations
        const designations = await queryRunner.query(`
            SELECT id, name
            FROM designations
        `);
        
        if (designations.length === 0) {
            console.log('No designations found, creating default designations');
            
            // Create default designations based on existing roles
            const roles = await queryRunner.query(`
                SELECT DISTINCT role FROM users WHERE role IS NOT NULL
            `);
            
            for (const roleRow of roles) {
                const roleName = roleRow.role;
                
                // Skip empty roles
                if (!roleName) continue;
                
                console.log(`Creating designation for role: ${roleName}`);
                
                // Create designation
                await queryRunner.query(`
                    INSERT INTO designations (name, description, created_at, updated_at)
                    VALUES ($1, $2, NOW(), NOW())
                    RETURNING id
                `, [roleName, `Auto-created from role ${roleName}`]);
            }
            
            // Get the newly created designations
            const newDesignations = await queryRunner.query(`
                SELECT id, name
                FROM designations
            `);
            
            if (newDesignations.length === 0) {
                console.log('Failed to create default designations, skipping migration');
                return;
            }
            
            // Assign designations to users based on their roles
            for (const user of usersWithoutDesignation) {
                const matchingDesignation = newDesignations.find(d => 
                    d.name.toLowerCase() === (user.role || '').toLowerCase()
                );
                
                if (matchingDesignation) {
                    console.log(`Assigning designation ${matchingDesignation.name} to user ${user.username}`);
                    
                    await queryRunner.query(`
                        UPDATE users
                        SET designation_id = $1
                        WHERE id = $2
                    `, [matchingDesignation.id, user.id]);
                } else {
                    console.log(`No matching designation found for user ${user.username} with role ${user.role}`);
                }
            }
        } else {
            // Assign designations to users based on their roles
            for (const user of usersWithoutDesignation) {
                const matchingDesignation = designations.find(d => 
                    d.name.toLowerCase() === (user.role || '').toLowerCase()
                );
                
                if (matchingDesignation) {
                    console.log(`Assigning designation ${matchingDesignation.name} to user ${user.username}`);
                    
                    await queryRunner.query(`
                        UPDATE users
                        SET designation_id = $1
                        WHERE id = $2
                    `, [matchingDesignation.id, user.id]);
                } else {
                    console.log(`No matching designation found for user ${user.username} with role ${user.role}`);
                }
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // This migration is not reversible in a clean way
        console.log('This migration cannot be reversed automatically');
    }
}
