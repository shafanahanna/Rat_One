import { MigrationInterface, QueryRunner } from "typeorm";
export declare class CreateCountriesAndBranchesTables1724307356000 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
