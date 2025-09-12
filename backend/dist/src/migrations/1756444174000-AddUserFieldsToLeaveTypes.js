"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddUserFieldsToLeaveTypes1756444174000 = void 0;
class AddUserFieldsToLeaveTypes1756444174000 {
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE leave_types
      ADD COLUMN created_by UUID NULL REFERENCES users(id),
      ADD COLUMN updated_by UUID NULL REFERENCES users(id)
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE leave_types
      DROP COLUMN IF EXISTS created_by,
      DROP COLUMN IF EXISTS updated_by
    `);
    }
}
exports.AddUserFieldsToLeaveTypes1756444174000 = AddUserFieldsToLeaveTypes1756444174000;
//# sourceMappingURL=1756444174000-AddUserFieldsToLeaveTypes.js.map