import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAssigneeRole1748244896349 implements MigrationInterface {
    name = 'AddAssigneeRole1748244896349'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`assignee\` ADD \`role\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`assignee\` DROP COLUMN \`role\``);
    }

}
