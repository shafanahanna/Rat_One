import { MigrationInterface, QueryRunner } from "typeorm";
export declare class RemoveCountryIdFromEmployees1724654803000 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
