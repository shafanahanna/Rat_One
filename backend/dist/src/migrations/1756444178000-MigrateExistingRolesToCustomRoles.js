"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrateExistingRolesToCustomRoles1756444178000 = void 0;
const uuid_1 = require("uuid");
class MigrateExistingRolesToCustomRoles1756444178000 {
    async up(queryRunner) {
        const defaultRoles = [
            {
                id: (0, uuid_1.v4)(),
                name: 'Admin',
                description: 'Full system access',
                permissions: ['admin', 'dashboard', 'users.view', 'users.create', 'users.edit', 'users.delete', 'roles.view', 'roles.create', 'roles.edit', 'roles.delete', 'settings', 'settings.edit', 'hr', 'employees', 'attendance', 'payroll', 'leave']
            },
            {
                id: (0, uuid_1.v4)(),
                name: 'HR',
                description: 'Human Resources access',
                permissions: ['dashboard', 'users.view', 'hr', 'employees', 'attendance', 'payroll', 'leave']
            },
            {
                id: (0, uuid_1.v4)(),
                name: 'DM',
                description: 'Department Manager access',
                permissions: ['dashboard', 'users.view', 'hr', 'employees', 'attendance', 'leave']
            },
            {
                id: (0, uuid_1.v4)(),
                name: 'TC',
                description: 'Team Coordinator access',
                permissions: ['dashboard', 'users.view', 'hr', 'attendance', 'leave']
            },
            {
                id: (0, uuid_1.v4)(),
                name: 'BA',
                description: 'Business Analyst access',
                permissions: ['dashboard']
            },
            {
                id: (0, uuid_1.v4)(),
                name: 'RT',
                description: 'Reporting Team access',
                permissions: ['dashboard']
            },
            {
                id: (0, uuid_1.v4)(),
                name: 'AC',
                description: 'Accounts access',
                permissions: ['dashboard', 'payroll']
            }
        ];
        for (const role of defaultRoles) {
            await queryRunner.query(`
                INSERT INTO custom_roles (id, name, description, permissions, created_at, updated_at)
                VALUES ($1, $2, $3, $4, NOW(), NOW())
                ON CONFLICT (name) DO NOTHING
            `, [role.id, role.name, role.description, role.permissions]);
        }
        await queryRunner.query(`
            UPDATE users
            SET role = 'Admin'
            WHERE role = 'Director'
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            UPDATE users
            SET role = 'Director'
            WHERE role = 'Admin'
        `);
        await queryRunner.query(`
            DELETE FROM custom_roles
            WHERE name IN ('Admin', 'HR', 'DM', 'TC', 'BA', 'RT', 'AC')
        `);
    }
}
exports.MigrateExistingRolesToCustomRoles1756444178000 = MigrateExistingRolesToCustomRoles1756444178000;
//# sourceMappingURL=1756444178000-MigrateExistingRolesToCustomRoles.js.map