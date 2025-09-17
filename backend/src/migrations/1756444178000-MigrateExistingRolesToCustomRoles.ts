import { MigrationInterface, QueryRunner } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

export class MigrateExistingRolesToCustomRoles1756444178000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Create default custom roles based on the existing enum roles
        const defaultRoles = [
            {
                id: uuidv4(),
                name: 'Admin', // Renamed from Director
                description: 'Full system access',
                permissions: ['admin', 'dashboard', 'users.view', 'users.create', 'users.edit', 'users.delete', 'roles.view', 'roles.create', 'roles.edit', 'roles.delete', 'settings', 'settings.edit', 'hr', 'employees', 'attendance', 'payroll', 'leave']
            },
            {
                id: uuidv4(),
                name: 'HR',
                description: 'Human Resources access',
                permissions: ['dashboard', 'users.view', 'hr', 'employees', 'attendance', 'payroll', 'leave']
            },
            {
                id: uuidv4(),
                name: 'DM',
                description: 'Department Manager access',
                permissions: ['dashboard', 'users.view', 'hr', 'employees', 'attendance', 'leave']
            },
            {
                id: uuidv4(),
                name: 'TC',
                description: 'Team Coordinator access',
                permissions: ['dashboard', 'users.view', 'hr', 'attendance', 'leave']
            },
            {
                id: uuidv4(),
                name: 'BA',
                description: 'Business Analyst access',
                permissions: ['dashboard']
            },
            {
                id: uuidv4(),
                name: 'RT',
                description: 'Reporting Team access',
                permissions: ['dashboard']
            },
            {
                id: uuidv4(),
                name: 'AC',
                description: 'Accounts access',
                permissions: ['dashboard', 'payroll']
            }
        ];

        // Insert default roles into custom_roles table
        for (const role of defaultRoles) {
            await queryRunner.query(`
                INSERT INTO custom_roles (id, name, description, permissions, created_at, updated_at)
                VALUES ($1, $2, $3, $4, NOW(), NOW())
                ON CONFLICT (name) DO NOTHING
            `, [role.id, role.name, role.description, role.permissions]);
        }

        // 2. Update any 'Director' role to 'Admin' in the users table
        await queryRunner.query(`
            UPDATE users
            SET role = 'Admin'
            WHERE role = 'Director'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert Admin back to Director
        await queryRunner.query(`
            UPDATE users
            SET role = 'Director'
            WHERE role = 'Admin'
        `);

        // Remove the default custom roles
        await queryRunner.query(`
            DELETE FROM custom_roles
            WHERE name IN ('Admin', 'HR', 'DM', 'TC', 'BA', 'RT', 'AC')
        `);
    }
}
