import { MigrationInterface, QueryRunner } from "typeorm";
export declare class MigrateExistingRolesToCustomRoles1756444178000 implements MigrationInterface {
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
