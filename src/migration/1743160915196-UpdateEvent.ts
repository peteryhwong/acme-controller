import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEvent1743160915196 implements MigrationInterface {
    name = 'UpdateEvent1743160915196'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`starttime\``);
        await queryRunner.query(`ALTER TABLE \`event\` ADD \`starttime\` bigint NULL`);
        await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`endtime\``);
        await queryRunner.query(`ALTER TABLE \`event\` ADD \`endtime\` bigint NULL`);
        await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`duration\``);
        await queryRunner.query(`ALTER TABLE \`event\` ADD \`duration\` bigint NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`duration\``);
        await queryRunner.query(`ALTER TABLE \`event\` ADD \`duration\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`endtime\``);
        await queryRunner.query(`ALTER TABLE \`event\` ADD \`endtime\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`starttime\``);
        await queryRunner.query(`ALTER TABLE \`event\` ADD \`starttime\` int NULL`);
    }

}
