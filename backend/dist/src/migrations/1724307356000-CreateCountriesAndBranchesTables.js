"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCountriesAndBranchesTables1724307356000 = void 0;
class CreateCountriesAndBranchesTables1724307356000 {
    constructor() {
        this.name = 'CreateCountriesAndBranchesTables1724307356000';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
        `);
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "countries" (
                "id" SERIAL PRIMARY KEY,
                "country_code" VARCHAR(2) UNIQUE NOT NULL,
                "country_name" VARCHAR(100) NOT NULL,
                "transaction_currency" VARCHAR(3) NOT NULL,
                "currency_symbol" VARCHAR(10),
                "timezone" VARCHAR(50),
                "date_format" VARCHAR(20) DEFAULT 'DD-MM-YYYY',
                "is_active" BOOLEAN DEFAULT TRUE,
                "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "branches" (
                "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                "country_id" INTEGER NOT NULL,
                "branch_code" VARCHAR(20) UNIQUE NOT NULL,
                "branch_name" VARCHAR(100) NOT NULL,
                "city" VARCHAR(50),
                "state_province" VARCHAR(50),
                "manager_user_id" UUID,
                "is_headquarters" BOOLEAN DEFAULT FALSE,
                "is_active" BOOLEAN DEFAULT TRUE,
                "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_constraint WHERE conname = 'fk_branches_country'
                ) THEN
                    ALTER TABLE "branches"
                    ADD CONSTRAINT fk_branches_country
                    FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE RESTRICT;
                END IF;

                IF NOT EXISTS (
                    SELECT 1 FROM pg_constraint WHERE conname = 'fk_branches_manager'
                ) THEN
                    ALTER TABLE "branches"
                    ADD CONSTRAINT fk_branches_manager
                    FOREIGN KEY ("manager_user_id") REFERENCES "users"("id") ON DELETE SET NULL;
                END IF;
            END
            $$;
        `);
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION update_timestamp()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
            
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_trigger WHERE tgname = 'update_countries_timestamp'
                ) THEN
                    CREATE TRIGGER update_countries_timestamp
                    BEFORE UPDATE ON "countries"
                    FOR EACH ROW
                    EXECUTE FUNCTION update_timestamp();
                END IF;
            END
            $$;
        `);
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_trigger WHERE tgname = 'update_branches_timestamp'
                ) THEN
                    CREATE TRIGGER update_branches_timestamp
                    BEFORE UPDATE ON "branches"
                    FOR EACH ROW
                    EXECUTE FUNCTION update_timestamp();
                END IF;
            END
            $$;
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TRIGGER IF EXISTS update_branches_timestamp ON "branches"`);
        await queryRunner.query(`DROP TRIGGER IF EXISTS update_countries_timestamp ON "countries"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "branches"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "countries"`);
        await queryRunner.query(`DROP FUNCTION IF EXISTS update_timestamp()`);
    }
}
exports.CreateCountriesAndBranchesTables1724307356000 = CreateCountriesAndBranchesTables1724307356000;
//# sourceMappingURL=1724307356000-CreateCountriesAndBranchesTables.js.map