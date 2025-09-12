"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateGlobalLeaveConfigTable1756444166000 = void 0;
class CreateGlobalLeaveConfigTable1756444166000 {
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public.global_leave_config (
        id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
        key character varying(100) NOT NULL,
        value jsonb NOT NULL,
        description text,
        created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
        CONSTRAINT "PK_global_leave_config" PRIMARY KEY (id),
        CONSTRAINT "UQ_global_leave_config_key" UNIQUE (key)
      );
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS public.global_leave_config;`);
    }
}
exports.CreateGlobalLeaveConfigTable1756444166000 = CreateGlobalLeaveConfigTable1756444166000;
//# sourceMappingURL=1756444166000-CreateGlobalLeaveConfigTable.js.map