import { MigrationInterface, QueryRunner } from "typeorm";
export declare class CreateUpdateTimestampFunction1724481632000 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
