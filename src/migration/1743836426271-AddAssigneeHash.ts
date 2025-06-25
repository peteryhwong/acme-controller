import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAssigneeHash1743836426271 implements MigrationInterface {
    name = 'AddAssigneeHash1743836426271'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`assignee\` ADD \`hash\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`assignee\` DROP COLUMN \`hash\``);
    }

}
