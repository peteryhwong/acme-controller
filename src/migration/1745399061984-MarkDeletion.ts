import { MigrationInterface, QueryRunner } from "typeorm";

export class MarkDeletion1745399061984 implements MigrationInterface {
    name = 'MarkDeletion1745399061984'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`device\` ADD \`deletedat\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`assignee\` ADD \`deletedat\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`location\` ADD \`deletedat\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`deletedat\` datetime NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`deletedat\``);
        await queryRunner.query(`ALTER TABLE \`location\` DROP COLUMN \`deletedat\``);
        await queryRunner.query(`ALTER TABLE \`assignee\` DROP COLUMN \`deletedat\``);
        await queryRunner.query(`ALTER TABLE \`device\` DROP COLUMN \`deletedat\``);
    }

}
