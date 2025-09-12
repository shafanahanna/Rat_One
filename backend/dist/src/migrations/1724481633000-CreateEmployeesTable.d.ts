import { MigrationInterface, QueryRunner } from "typeorm";
export declare class CreateEmployeesTable1724481633000 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
