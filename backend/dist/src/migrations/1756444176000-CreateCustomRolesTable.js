"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCustomRolesTable1756444176000 = void 0;
class CreateCustomRolesTable1756444176000 {
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE "custom_roles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "description" character varying,
        "permissions" text NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_custom_roles_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_custom_roles_name" UNIQUE ("name")
      )
    `);
        await queryRunner.query(`
      CREATE TRIGGER set_timestamp
      BEFORE UPDATE ON "custom_roles"
      FOR EACH ROW
      EXECUTE FUNCTION update_timestamp();
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "custom_roles"`);
    }
}
exports.CreateCustomRolesTable1756444176000 = CreateCustomRolesTable1756444176000;
//# sourceMappingURL=1756444176000-CreateCustomRolesTable.js.map