import { MigrationInterface, QueryRunner } from "typeorm";
export declare class ChangeUserRoleToVarchar1756444179000 implements MigrationInterface {
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
