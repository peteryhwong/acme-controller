import { MigrationInterface, QueryRunner } from "typeorm";

export class AddName1743834422798 implements MigrationInterface {
    name = 'AddName1743834422798'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`assignee\` ADD \`name\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`assignee\` DROP COLUMN \`name\``);
    }

}
