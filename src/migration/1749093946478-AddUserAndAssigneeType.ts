import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserAndAssigneeType1749093946478 implements MigrationInterface {
    name = 'AddUserAndAssigneeType1749093946478'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`assignee\` ADD \`type\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`type\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`type\``);
        await queryRunner.query(`ALTER TABLE \`assignee\` DROP COLUMN \`type\``);
    }

}
