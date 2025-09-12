import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUpdateTimestampFunction1724481632000 implements MigrationInterface {
    name = 'CreateUpdateTimestampFunction1724481632000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create update_timestamp function
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

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the function if no dependencies exist
        await queryRunner.query(`
            DROP FUNCTION IF EXISTS update_timestamp();
        `);
    }
}
