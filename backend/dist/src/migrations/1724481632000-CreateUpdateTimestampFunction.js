"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUpdateTimestampFunction1724481632000 = void 0;
class CreateUpdateTimestampFunction1724481632000 {
    constructor() {
        this.name = 'CreateUpdateTimestampFunction1724481632000';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION update_timestamp()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            DROP FUNCTION IF EXISTS update_timestamp();
        `);
    }
}
exports.CreateUpdateTimestampFunction1724481632000 = CreateUpdateTimestampFunction1724481632000;
//# sourceMappingURL=1724481632000-CreateUpdateTimestampFunction.js.map